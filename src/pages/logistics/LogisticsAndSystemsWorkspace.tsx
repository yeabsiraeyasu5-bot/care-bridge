import React, { useState } from "react";
import {
  Truck,
  Plane,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Smartphone,
  MessageSquare,
  Database,
  Send,
  Clock,
  ShieldAlert,
} from "lucide-react";
import type {
  PortalWorkspaceId,
  DispatchRecord,
  UAVAssessmentRecord,
  SupplyRequest,
  InventoryRecord,
  SmsSimulationMessage,
} from "../../types/carebridge";
import {
  CAREBRIDGE_DATABASE_SCHEMA,
  getLocalAdministrativeAssistantResponse,
  type AssistantResponsePayload,
} from "../../services/databaseSchema";

interface LogisticsAndSystemsWorkspaceProps {
  activeSection: PortalWorkspaceId;
  onSelectSection: (section: PortalWorkspaceId) => void;
  dispatchRecords: DispatchRecord[];
  uavAssessments: UAVAssessmentRecord[];
  requests: SupplyRequest[];
  inventory: InventoryRecord[];
  onAdvanceDispatchStatus: (
    dispatchId: string,
    nextStatus: "In Transit" | "Delivered",
    transportMethod?: DispatchRecord["transportMethod"]
  ) => void;
  onAddUavAssessment: (assessment: Omit<UAVAssessmentRecord, "id">) => void;
}

export const LogisticsAndSystemsWorkspace: React.FC<LogisticsAndSystemsWorkspaceProps> = ({
  activeSection,
  onSelectSection,
  dispatchRecords,
  uavAssessments,
  requests,
  inventory,
  onAdvanceDispatchStatus,
  onAddUavAssessment,
}) => {
  // UAV New Assessment Simulator Form State
  const [uavReqId, setUavReqId] = useState(requests[0]?.id || "REQ-2026-401");
  const [uavCargo, setUavCargo] = useState("Oxytocin & Maternal Emergency Kit");
  const [uavWeight, setUavWeight] = useState<number>(2.1);
  const [uavOrigin, setUavOrigin] = useState("Adama Hospital Medical College (Demo)");
  const [uavDest, setUavDest] = useState("Meki Health Center (Demo)");
  const [uavDist, setUavDist] = useState<number>(86);
  const [uavHandling, setUavHandling] = useState(true);
  const [uavWeather, setUavWeather] = useState(true);

  // Simulated 2-Way SMS Gateway State
  const [smsInput, setSmsInput] = useState("");
  const [smsThread, setSmsThread] = useState<SmsSimulationMessage[]>([
    {
      id: "SIM-SMS-1",
      sender: "gateway_sim",
      text: "[SIMULATED GATEWAY DEMO] CareBridge Low-Connectivity USSD/SMS Concept. Commands query reported demo figures or submit draft inquiries for supplier verification. Try: QUERY OXYGEN ADAMA, QUERY BLOOD ADAMA, or INQUIRE OXYGEN BATU.",
      timestamp: "09:00",
      tag: "SIMULATION ONLY — NOT LIVE GSM",
    },
  ]);

  // Administrative Assistant State
  const [assistantQuery, setAssistantQuery] = useState("");
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [assistantHistory, setAssistantHistory] = useState<
    Array<{ query: string; response: AssistantResponsePayload }>
  >([
    {
      query: "How does the CareBridge request and supplier confirmation workflow operate?",
      response: getLocalAdministrativeAssistantResponse(
        "How does the CareBridge request and supplier confirmation workflow operate?"
      ),
    },
  ]);

  const handleRunUavAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    const lowerCargo = uavCargo.toLowerCase();
    const isHeavyCylinder =
      uavWeight > 5 || lowerCargo.includes("cylinder") || lowerCargo.includes("40l");
    const isBlood = lowerCargo.includes("blood") || lowerCargo.includes("rbc");

    const cargoEligible = !isHeavyCylinder && uavWeight <= 4.5;
    const overallFeasibility: UAVAssessmentRecord["overallFeasibility"] = isHeavyCylinder
      ? "Ineligible — Requires Pressurized/Heavy Ground Transport"
      : isBlood
      ? "Requires Blood Bank Active Thermal Validation"
      : "Potentially Eligible for Future Pilot (Pending ECAA Permit)";

    onAddUavAssessment({
      requestId: uavReqId,
      cargoDescription: uavCargo,
      weightKg: uavWeight,
      originFacility: uavOrigin,
      destinationFacility: uavDest,
      distanceKm: uavDist,
      cargoEligible,
      handlingReviewed: uavHandling,
      operatorAvailable: false,
      routeAssessed: uavDist <= 60,
      weatherReviewed: uavWeather,
      regulatoryAuthorized: false,
      overallFeasibility,
      assessorNotes: isHeavyCylinder
        ? "Heavy or pressurized cargo exceeds medical UAV envelope; must use secured ground vehicle."
        : isBlood
        ? "Requires blood bank cold-chain validation (+2°C to +6°C), vibration testing, and regulatory clearance."
        : "Simulated assessment only. UAV transport is not currently operational and requires ECAA & health authority permits.",
    });
  };

  const handleSendSimulatedSms = (preset?: string) => {
    const cmd = (preset ?? smsInput).trim();
    if (!cmd) return;
    if (!preset) setSmsInput("");

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: SmsSimulationMessage = {
      id: `SMS-U-${Date.now()}`,
      sender: "facility_user",
      text: cmd,
      timestamp: now,
    };

    const upper = cmd.toUpperCase();
    let reply = "";
    let tag = "SIMULATED RESPONSE";

    if (upper.includes("OXYGEN") && upper.includes("ADAMA")) {
      const rec = inventory.find(
        (i) => i.woredaCity.includes("Adama") && i.category === "Medical Oxygen"
      );
      reply = `[DEMO REPORT - NOT GUARANTEED STOCK] Adama HMC reported ${
        rec?.quantity ?? 12
      }x 40L Cylinders (${rec?.availabilityStatus ?? "Available"}, updated ${
        rec?.lastUpdated ?? "recently"
      }). Note: SMS report does not reserve stock; formal supplier confirmation required.`;
    } else if (upper.includes("BLOOD") || upper.includes("O-NEG")) {
      const adamaBlood = inventory.find(
        (i) => i.woredaCity.includes("Adama") && i.resourceName.includes("O-Neg")
      );
      reply = `[DEMO BLOOD REPORT] Adama HMC reported ${
        adamaBlood?.quantity ?? 8
      } Units O-Neg (${adamaBlood?.availabilityStatus ?? "Available"}). Blood type listing does NOT establish compatibility; Blood Service Officer cross-match & release required.`;
    } else if (upper.startsWith("INQUIRE")) {
      tag = "DRAFT INQUIRY LOGGED";
      reply = `[DEMO INQUIRY] Logged non-binding coordination inquiry "${cmd}". Target supplier must explicitly verify physical availability and confirm before transport is scheduled.`;
    } else {
      reply = `[SIMULATED SMS GATEWAY] Try "QUERY OXYGEN ADAMA", "QUERY BLOOD ADAMA", or "INQUIRE OXYGEN BATU". All responses are simulated low-connectivity demonstrations.`;
    }

    const sysMsg: SmsSimulationMessage = {
      id: `SMS-S-${Date.now() + 1}`,
      sender: "gateway_sim",
      text: reply,
      timestamp: now,
      tag,
    };

    setSmsThread((prev) => [...prev, userMsg, sysMsg]);
  };

  const handleAskAssistant = async (preset?: string) => {
    const q = (preset ?? assistantQuery).trim();
    if (!q || isAssistantLoading) return;
    if (!preset) setAssistantQuery("");

    setIsAssistantLoading(true);
    let responsePayload = getLocalAdministrativeAssistantResponse(q);

    try {
      const networkSummary = `Modeled Facilities: ${inventory.length} resource lines; Active Requests: ${requests.length}.`;
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, networkSummary }),
      });
      if (res.ok) {
        const data = await res.json();
        if (!data.useFallback && data.result) {
          responsePayload = {
            topic: data.result.topic || responsePayload.topic,
            answer: data.result.answer || responsePayload.answer,
            workflowSteps: Array.isArray(data.result.workflowSteps)
              ? data.result.workflowSteps
              : responsePayload.workflowSteps,
            limitationNotice: data.result.limitationNotice || responsePayload.limitationNotice,
            source: "Server Gemini Assistant",
          };
        }
      }
    } catch {
      // Fallback already prepared
    }

    setAssistantHistory((prev) => [{ query: q, response: responsePayload }, ...prev]);
    setIsAssistantLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-emerald-700">
            Inter-Facility Transport, Future UAV Assessment &amp; Technical Systems
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">
            Logistics Coordination &amp; Platform Architecture Workspace
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-lg shrink-0">
          {(
            [
              ["logistics-tracking", "1. Ground & Ambulance Logistics"],
              ["logistics-uav", "2. UAV Feasibility (Future Sim)"],
              ["low-connectivity-sms", "3. Simulated 2-Way SMS"],
              ["admin-assistant", "4. Admin Coordination Assistant"],
              ["architecture-schema", "5. DB Schema & RLS Blueprint"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => onSelectSection(id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === id
                  ? "bg-slate-900 text-white font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* 1. LOGISTICS & DELIVERY TRACKING                                  */}
      {/* ================================================================= */}
      {activeSection === "logistics-tracking" && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Active Ground &amp; Ambulance Transport Coordination (`dispatch_records`)
                </h2>
                <p className="text-xs text-slate-500">
                  Logistics records are created only after a supplying facility explicitly confirms
                  availability. Final receipt (`Handover Confirmed` / `Received`) must be
                  acknowledged by the receiving facility.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {dispatchRecords.length} Active Dispatches
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
                    <th className="py-3 px-4">Dispatch &amp; Request ID</th>
                    <th className="py-3 px-4">Supplying → Requesting Facility</th>
                    <th className="py-3 px-4">Confirmed Cargo</th>
                    <th className="py-3 px-4">Agreed Transport Method</th>
                    <th className="py-3 px-4">Responsible Coordinator</th>
                    <th className="py-3 px-4">Delivery Status &amp; ETA</th>
                    <th className="py-3 px-4 text-right">Logistics Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {dispatchRecords.map((d) => (
                    <tr key={d.id} className="align-top hover:bg-slate-50">
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        {d.id}
                        <div className="text-emerald-700 font-semibold mt-0.5">{d.requestId}</div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-900">{d.supplyingFacilityName}</p>
                        <p className="text-slate-500 mt-0.5">→ To: {d.requestingFacilityName}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-900">{d.resourceSummary}</p>
                        <p className="text-slate-500 mt-0.5">
                          Cold-Chain Verified: {d.coldChainVerified ? "Yes (+2°C to +6°C)" : "N/A"}
                        </p>
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-800">{d.transportMethod}</td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-900">{d.responsibleCoordinator}</p>
                        <p className="font-mono text-slate-500">{d.coordinatorPhone}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-emerald-800">{d.deliveryStatus}</span>
                        <p className="text-slate-500 mt-0.5">{d.expectedDeliveryWindow}</p>
                        {d.handoverAcknowledgedBy && (
                          <p className="text-emerald-700 font-semibold mt-0.5">
                            Signed off by {d.handoverAcknowledgedBy} ({d.handoverTimestamp})
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {d.deliveryStatus === "Logistics Pending" && (
                          <button
                            type="button"
                            onClick={() =>
                              onAdvanceDispatchStatus(d.id, "In Transit", "Facility Ground Vehicle")
                            }
                            className="px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md cursor-pointer"
                          >
                            Mark Departed (In Transit)
                          </button>
                        )}
                        {d.deliveryStatus === "In Transit" && (
                          <button
                            type="button"
                            onClick={() => onAdvanceDispatchStatus(d.id, "Delivered")}
                            className="px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white rounded-md cursor-pointer"
                          >
                            Mark Arrived at Facility (`Delivered`)
                          </button>
                        )}
                        {d.deliveryStatus === "Delivered" && (
                          <span className="text-amber-700 font-semibold">
                            Awaiting Receiving Facility Sign-Off
                          </span>
                        )}
                        {d.deliveryStatus === "Handover Confirmed" && (
                          <span className="text-emerald-700 font-semibold">
                            Handover Complete
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 2. UAV FEASIBILITY ASSESSMENT (FUTURE CAPABILITY SIMULATION)      */}
      {/* ================================================================= */}
      {activeSection === "logistics-uav" && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                Future Capability Feasibility Simulator — Not Operational Flight Dispatch
              </p>
              <p className="mt-1 leading-relaxed">
                This interface evaluates whether a requested medical cargo item could potentially
                qualify for future UAV delivery once regulatory authorizations (ECAA), validated
                blood cold-chain containers, and licensed operators are established. Heavy items
                (such as 40L oxygen cylinders) and patient transportation are strictly excluded.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Simulator Input Form */}
            <form
              onSubmit={handleRunUavAssessment}
              className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-3.5 text-xs"
            >
              <h2 className="text-sm font-bold text-slate-900">
                Run Simulated UAV Cargo Eligibility Check
              </h2>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Associated Request ID
                </label>
                <input
                  type="text"
                  value={uavReqId}
                  onChange={(e) => setUavReqId(e.target.value)}
                  className="w-full px-3 py-1.5 font-mono bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cargo Description *
                </label>
                <input
                  type="text"
                  required
                  value={uavCargo}
                  onChange={(e) => setUavCargo(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Payload Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={uavWeight}
                    onChange={(e) => setUavWeight(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 font-mono bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Corridor Distance (km)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={uavDist}
                    onChange={(e) => setUavDist(parseInt(e.target.value) || 20)}
                    className="w-full px-3 py-1.5 font-mono bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Origin Facility</label>
                  <input
                    type="text"
                    value={uavOrigin}
                    onChange={(e) => setUavOrigin(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Destination Facility
                  </label>
                  <input
                    type="text"
                    value={uavDest}
                    onChange={(e) => setUavDest(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="space-y-1.5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={uavHandling}
                    onChange={(e) => setUavHandling(e.target.checked)}
                  />
                  <span>Professional handling &amp; packaging reviewed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={uavWeather}
                    onChange={(e) => setUavWeather(e.target.checked)}
                  />
                  <span>Corridor weather &amp; wind envelope reviewed</span>
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Evaluate Simulated Feasibility
              </button>
            </form>

            {/* 6-Criteria Assessment Table */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900">
                  Simulated UAV Readiness &amp; Eligibility Assessments (`uav_assessments`)
                </h2>
              </div>
              <div className="divide-y divide-slate-200">
                {uavAssessments.map((u) => (
                  <div key={u.id} className="p-5 space-y-3 text-xs">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-slate-900">
                          {u.id} · Ref: {u.requestId}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                          {u.cargoDescription} ({u.weightKg} kg · {u.distanceKm} km)
                        </h3>
                        <p className="text-slate-500">
                          {u.originFacility} → {u.destinationFacility}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded font-semibold ${
                          u.overallFeasibility.startsWith("Ineligible")
                            ? "bg-red-50 text-red-800 border border-red-200"
                            : "bg-amber-50 text-amber-900 border border-amber-200"
                        }`}
                      >
                        {u.overallFeasibility}
                      </span>
                    </div>

                    {/* 6 Criteria Checkboxes */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-1.5">
                        {u.cargoEligible ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        )}
                        <span>1. Cargo Payload Eligible</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {u.handlingReviewed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        )}
                        <span>2. Clinical Handling Reviewed</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {u.operatorAvailable ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span>3. Approved Operator Ready</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {u.routeAssessed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        )}
                        <span>4. Route &amp; Landing Assessed</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {u.weatherReviewed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        )}
                        <span>5. Operating Weather OK</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {u.regulatoryAuthorized ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        )}
                        <span>6. ECAA Regulatory Permit</span>
                      </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed">
                      <strong>Assessment Finding:</strong> {u.assessorNotes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. SIMULATED LOW-CONNECTIVITY TWO-WAY SMS DEMONSTRATION           */}
      {/* ================================================================= */}
      {activeSection === "low-connectivity-sms" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-950">
              <p className="font-bold">Simulated Low-Connectivity Access Demonstration</p>
              <p className="mt-1 leading-relaxed">
                This module demonstrates how rural health centers experiencing internet outages
                could query reported network availability via future GSM shortcode integration. No
                real SMS gateway is connected, and SMS commands never bypass supplier confirmation
                or automatically deduct stock.
              </p>
            </div>

            <h2 className="text-base font-bold text-slate-900">
              Future SMS Gateway Architecture &amp; Governance Rules
            </h2>
            <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
              <li>
                · <strong>Sender Verification:</strong> Only pre-registered institutional SIM
                numbers mapped in <code>facility_memberships</code> would be accepted by a future
                SMS gateway.
              </li>
              <li>
                · <strong>Informational Queries Only:</strong> <code>QUERY OXYGEN ADAMA</code> or{" "}
                <code>QUERY BLOOD ADAMA</code> returns the latest reported count along with its
                freshness timestamp.
              </li>
              <li>
                · <strong>No Automatic Stock Locking:</strong> Sending an SMS inquiry creates a
                pending request that still requires explicit confirmation by the supplying facility.
              </li>
            </ul>

            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-700 mb-2">
                Click a simulated command to test:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleSendSimulatedSms("QUERY OXYGEN ADAMA")}
                  className="px-3 py-1.5 text-xs font-mono bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                >
                  QUERY OXYGEN ADAMA
                </button>
                <button
                  type="button"
                  onClick={() => handleSendSimulatedSms("QUERY BLOOD ADAMA")}
                  className="px-3 py-1.5 text-xs font-mono bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                >
                  QUERY BLOOD ADAMA
                </button>
                <button
                  type="button"
                  onClick={() => handleSendSimulatedSms("INQUIRE OXYGEN BATU")}
                  className="px-3 py-1.5 text-xs font-mono bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                >
                  INQUIRE OXYGEN BATU
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 text-white border border-slate-800 rounded-xl p-5 flex flex-col h-[480px]">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold">
                SIMULATED GSM SANDBOX (NO LIVE TELECOM LINK)
              </span>
              <span className="text-slate-400">Demo Mode</span>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3 font-mono text-xs">
              {smsThread.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === "facility_user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-lg px-3.5 py-2.5 leading-relaxed ${
                      m.sender === "facility_user"
                        ? "bg-emerald-700 text-white"
                        : "bg-slate-800 text-slate-100 border border-slate-700"
                    }`}
                  >
                    {m.tag && <div className="text-[10px] text-amber-400 font-bold mb-1">{m.tag}</div>}
                    <p>{m.text}</p>
                    <div className="text-[10px] opacity-60 text-right mt-1">{m.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendSimulatedSms();
              }}
              className="pt-3 border-t border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={smsInput}
                onChange={(e) => setSmsInput(e.target.value)}
                placeholder="Enter simulated shortcode command..."
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer"
              >
                SEND SIM
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 4. ADMINISTRATIVE COORDINATION ASSISTANT (NON-CLINICAL)           */}
      {/* ================================================================= */}
      {activeSection === "admin-assistant" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              CareBridge Administrative Coordination Assistant
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              This optional assistant helps institutional staff understand CareBridge workflows,
              request statuses, blood coordination disclaimers, and UAV assessment boundaries.
            </p>
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-950">
              <p className="font-bold">Strict Non-Clinical Scope</p>
              <p className="mt-1 leading-relaxed">
                This assistant does NOT diagnose patients, recommend treatments or medication
                dosages, select blood products, or trigger emergency dispatch.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <p className="text-xs font-semibold text-slate-700">Sample Administrative Prompts:</p>
              {[
                "How does the CareBridge request and supplier confirmation workflow operate?",
                "What are the blood resource coordination safeguards?",
                "What are the limitations of future drone / UAV logistics?",
                "What happens if I ask for a clinical treatment protocol or medication dose?",
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleAskAssistant(q)}
                  className="w-full text-left px-3 py-2 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-800 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAssistant();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={assistantQuery}
                onChange={(e) => setAssistantQuery(e.target.value)}
                placeholder="Ask an administrative question about CareBridge workflows..."
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
              <button
                type="submit"
                disabled={isAssistantLoading}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                {isAssistantLoading ? "Checking..." : "Ask Assistant"}
              </button>
            </form>

            <div className="space-y-4 max-h-[480px] overflow-y-auto">
              {assistantHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold text-slate-900">Q: {item.query}</span>
                    <span className="font-mono text-[11px]">{item.response.source}</span>
                  </div>
                  <h3 className="text-sm font-bold text-emerald-900">{item.response.topic}</h3>
                  <p className="text-slate-700 leading-relaxed">{item.response.answer}</p>
                  <ul className="space-y-1 text-slate-700">
                    {item.response.workflowSteps.map((s, i) => (
                      <li key={i} className="bg-white border border-slate-200 rounded px-2.5 py-1.5">
                        {s}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-amber-800 font-medium pt-1">
                    {item.response.limitationNotice}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 5. DATABASE & SUPABASE RLS ARCHITECTURE BLUEPRINT                 */}
      {/* ================================================================= */}
      {activeSection === "architecture-schema" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900">
                PostgreSQL / Supabase Multi-Institution Schema &amp; Row-Level Security (RLS)
                Blueprint
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Designed for persistent multi-institution deployment with Supabase Auth, strict
                facility-scoped RLS policies, and server-side privileged operations.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
                    <th className="py-3 px-4">Table Name</th>
                    <th className="py-3 px-4">Primary &amp; Foreign Keys</th>
                    <th className="py-3 px-4">Key Columns</th>
                    <th className="py-3 px-4">Purpose</th>
                    <th className="py-3 px-4">Row-Level Security (RLS) Policy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {CAREBRIDGE_DATABASE_SCHEMA.map((tbl) => (
                    <tr key={tbl.tableName} className="align-top hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                        {tbl.tableName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        <div>PK: {tbl.primaryKey}</div>
                        {tbl.foreignKeys.map((fk, i) => (
                          <div key={i} className="text-slate-500">
                            FK: {fk}
                          </div>
                        ))}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                        {tbl.keyColumns.join(", ")}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 max-w-xs">{tbl.purpose}</td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-sm">
                        {tbl.rlsPolicySummary}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
