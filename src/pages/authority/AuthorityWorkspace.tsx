import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  Activity,
  FileSpreadsheet,
  Lock,
  Bell,
} from "lucide-react";
import type {
  PortalWorkspaceId,
  Facility,
  FacilityApplication,
  InventoryRecord,
  SupplyRequest,
  PlatformNotification,
  AuditLogEntry,
  InstitutionVerificationStatus,
} from "../../types/carebridge";

interface AuthorityWorkspaceProps {
  activeSection: PortalWorkspaceId;
  onSelectSection: (section: PortalWorkspaceId) => void;
  facilities: Facility[];
  applications: FacilityApplication[];
  inventory: InventoryRecord[];
  requests: SupplyRequest[];
  notifications: PlatformNotification[];
  auditLogs: AuditLogEntry[];
  onVerifyApplication: (
    appId: string,
    decision: InstitutionVerificationStatus,
    reviewNote: string
  ) => void;
  onUpdateFacilityVerification: (
    facilityId: string,
    status: InstitutionVerificationStatus
  ) => void;
  onAuthorityMediateRequest: (requestId: string, note: string) => void;
}

export const AuthorityWorkspace: React.FC<AuthorityWorkspaceProps> = ({
  activeSection,
  onSelectSection,
  facilities,
  applications,
  inventory,
  requests,
  notifications,
  auditLogs,
  onVerifyApplication,
  onUpdateFacilityVerification,
  onAuthorityMediateRequest,
}) => {
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [mediationNote, setMediationNote] = useState<Record<string, string>>({});

  const verifiedFacilitiesCount = facilities.filter(
    (f) => f.verificationStatus === "Verified"
  ).length;
  const staleFacilities = facilities.filter((f) => f.freshnessStatus !== "Current");
  const pendingApplications = applications.filter(
    (a) => a.status === "Pending" || a.status === "Under Review"
  );
  const unansweredOrEscalatedRequests = requests.filter(
    (r) => r.status === "Awaiting Supplier" || r.status === "Escalated"
  );

  return (
    <div className="space-y-6">
      {/* Authority Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-emerald-400">
            GOVERNANCE MODEL: CENTRALIZED OVERSIGHT · DECENTRALIZED FACILITY RESPONSE
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Regional Coordination Authority — East Shewa Oversight Console
          </h1>
          <p className="mt-1 text-xs text-slate-300 max-w-3xl leading-relaxed">
            The Regional Coordination Authority verifies participating institutions, monitors
            inventory update freshness, oversees inter-facility request performance, and mediates
            escalations—without delaying direct facility-to-facility confirmations.
          </p>
        </div>

        {/* Sub-navigation tabs for Authority modules */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800 p-1.5 rounded-lg shrink-0">
          {(
            [
              ["authority-overview", "1. Overview"],
              ["authority-verification", `2. Verification (${pendingApplications.length})`],
              ["authority-monitoring", "3. Network & Requests"],
              ["authority-analytics", "4. Analytics & Reports"],
              ["authority-rbac-audit", "5. RBAC & Audit Logs"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => onSelectSection(id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === id
                  ? "bg-emerald-600 text-white font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* SECTION 1: REGIONAL OVERVIEW & NOTIFICATIONS                      */}
      {/* ================================================================= */}
      {activeSection === "authority-overview" && (
        <div className="space-y-6">
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-medium text-slate-500">Verified Demo Institutions</p>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
                  {verifiedFacilitiesCount}
                </span>
                <span className="text-xs text-emerald-700 font-semibold">East Shewa Network</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                { staleFacilities.length } facility requires inventory freshness update
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-medium text-slate-500">Pending Institution Applications</p>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-3xl font-bold font-mono tabular-nums text-amber-700">
                  {pendingApplications.length}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectSection("authority-verification")}
                  className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  Review Queue →
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Controlled onboarding prevents unverified access
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-medium text-slate-500">
                Active Facility-to-Facility Requests
              </p>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
                  {requests.length}
                </span>
                <span className="text-xs font-mono text-amber-700">
                  {unansweredOrEscalatedRequests.length} Awaiting / Escalated
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Direct peer responses; Authority monitors exceptions
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-medium text-slate-500">Reported Resource Lines</p>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
                  {inventory.length}
                </span>
                <span className="text-xs text-slate-500">Informational Reports</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Requires supplier confirmation prior to release
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Authority Notifications & Exceptions */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span>Regional Oversight Alerts &amp; Notifications</span>
                </h2>
                <span className="text-xs font-mono text-slate-500">
                  {notifications.length} Active
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-lg border text-xs ${
                      n.severity === "urgent"
                        ? "bg-red-50/60 border-red-200 text-red-950"
                        : n.severity === "warning"
                        ? "bg-amber-50/60 border-amber-200 text-amber-950"
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{n.title}</span>
                      <span className="font-mono font-normal text-[11px] opacity-75">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="mt-1 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Freshness & Participation Overview */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900">
                  Facility Participation &amp; Inventory Freshness Monitor
                </h2>
                <span className="text-xs text-slate-500">24h Freshness Standard</span>
              </div>
              <div className="mt-4 space-y-2.5 text-xs">
                {facilities.map((fac) => (
                  <div
                    key={fac.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-2"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{fac.name}</p>
                      <p className="text-slate-500 mt-0.5">
                        {fac.facilityType} · {fac.woredaCity} · Contact: {fac.contactPerson}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          fac.freshnessStatus === "Current" ? "text-emerald-700" : "text-amber-700"
                        }`}
                      >
                        {fac.freshnessStatus === "Current" ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        )}
                        <span>{fac.freshnessStatus}</span>
                      </span>
                      <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                        Sync: {fac.lastInventorySync}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SECTION 2: FACILITY VERIFICATION & ONBOARDING QUEUE               */}
      {/* ================================================================= */}
      {activeSection === "authority-verification" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Institutional Onboarding Applications (`facility_applications`)
                </h2>
                <p className="text-xs text-slate-500">
                  Review institutional credentials and approve, place under review, or reject
                  applicants. Approved institutions are added to the verified East Shewa network.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {applications.length} Total Applications
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
                    <th className="py-3 px-4">Application ID</th>
                    <th className="py-3 px-4">Institution &amp; Type</th>
                    <th className="py-3 px-4">Woreda / License</th>
                    <th className="py-3 px-4">Applicant &amp; Contact</th>
                    <th className="py-3 px-4">Scope Notes</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Verification Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="align-top hover:bg-slate-50">
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        {app.id}
                        <div className="font-normal text-[11px] text-slate-500 mt-0.5">
                          {app.submittedAt}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-900">{app.institutionName}</p>
                        <p className="text-slate-500 mt-0.5">{app.facilityType}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-slate-800">{app.woredaCity}</p>
                        <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                          Lic: {app.licenseReference}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-900">
                          {app.applicantName} ({app.applicantRole})
                        </p>
                        <p className="font-mono text-slate-600 mt-0.5">{app.contactPhone}</p>
                        <p className="font-mono text-slate-500">{app.contactEmail}</p>
                      </td>
                      <td className="py-4 px-4 max-w-xs text-slate-600 leading-relaxed">
                        {app.notes}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap font-semibold">
                        {app.status === "Verified" && (
                          <span className="text-emerald-700">Verified</span>
                        )}
                        {(app.status === "Pending" || app.status === "Under Review") && (
                          <span className="text-amber-700">{app.status}</span>
                        )}
                        {(app.status === "Rejected" || app.status === "Suspended") && (
                          <span className="text-red-700">{app.status}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right space-y-2 min-w-[230px]">
                        <input
                          type="text"
                          value={reviewNotes[app.id] || ""}
                          onChange={(e) =>
                            setReviewNotes((prev) => ({ ...prev, [app.id]: e.target.value }))
                          }
                          placeholder="Audit review note..."
                          className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded"
                        />
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              onVerifyApplication(
                                app.id,
                                "Verified",
                                reviewNotes[app.id] || "Credentials & license verified by Authority."
                              )
                            }
                            className="px-2.5 py-1 text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white rounded cursor-pointer"
                          >
                            Verify &amp; Approve
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onVerifyApplication(
                                app.id,
                                "Rejected",
                                reviewNotes[app.id] || "Insufficient institutional documentation."
                              )
                            }
                            className="px-2.5 py-1 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Existing Network Verification Status Governance */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900">
                Active Institutional Directory &amp; Standing Controls
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
                    <th className="py-3 px-5">Institution</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Woreda</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-5 text-right">Governance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {facilities.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="py-3 px-5 font-semibold text-slate-900">{f.name}</td>
                      <td className="py-3 px-4 text-slate-600">{f.facilityType}</td>
                      <td className="py-3 px-4 text-slate-600">{f.woredaCity}</td>
                      <td className="py-3 px-4 font-semibold">
                        <span
                          className={
                            f.verificationStatus === "Verified"
                              ? "text-emerald-700"
                              : "text-red-700"
                          }
                        >
                          {f.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right space-x-2">
                        {f.verificationStatus === "Verified" ? (
                          <button
                            type="button"
                            onClick={() => onUpdateFacilityVerification(f.id, "Suspended")}
                            className="px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded cursor-pointer"
                          >
                            Suspend Access
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onUpdateFacilityVerification(f.id, "Verified")}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded cursor-pointer"
                          >
                            Restore Verified Status
                          </button>
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
      {/* SECTION 3: NETWORK, RESOURCE & REQUEST MONITORING                 */}
      {/* ================================================================= */}
      {activeSection === "authority-monitoring" && (
        <div className="space-y-6">
          {/* Request Monitoring Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Regional Request Monitoring &amp; Escalation Mediation (`supply_requests`)
                </h2>
                <p className="text-xs text-slate-500">
                  Ordinary requests flow peer-to-peer between facilities. The Authority monitors
                  turnaround times and mediates unanswered or escalated requests.
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
                    <th className="py-3 px-4">Request ID</th>
                    <th className="py-3 px-4">Requesting Facility</th>
                    <th className="py-3 px-4">Target Supplier</th>
                    <th className="py-3 px-4">Resource &amp; Qty</th>
                    <th className="py-3 px-4">Urgency</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Authority Oversight / Mediation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {requests.map((r) => (
                    <tr key={r.id} className="align-top hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {r.id}
                        <div className="font-normal text-[11px] text-slate-500">{r.createdAt}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {r.requestingFacilityName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">{r.supplierFacilityName}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{r.resourceName}</p>
                        <p className="font-mono text-slate-500 mt-0.5">
                          Requested: {r.requestedQuantity} {r.unit} · Confirmed:{" "}
                          {r.confirmedQuantity !== null ? `${r.confirmedQuantity} ${r.unit}` : "Pending"}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-semibold">
                        <span
                          className={
                            r.urgency === "Emergency"
                              ? "text-red-700"
                              : r.urgency === "Urgent"
                              ? "text-amber-700"
                              : "text-slate-600"
                          }
                        >
                          {r.urgency}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{r.status}</td>
                      <td className="py-3.5 px-4 text-right min-w-[240px]">
                        {r.status === "Awaiting Supplier" || r.status === "Escalated" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <input
                              type="text"
                              value={mediationNote[r.id] || ""}
                              onChange={(e) =>
                                setMediationNote((prev) => ({ ...prev, [r.id]: e.target.value }))
                              }
                              placeholder="Coordination advisory note..."
                              className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded w-40"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                onAuthorityMediateRequest(
                                  r.id,
                                  mediationNote[r.id] ||
                                    "Regional Authority contacted supplier focal person to expedite review."
                                );
                                setMediationNote((prev) => ({ ...prev, [r.id]: "" }));
                              }}
                              className="px-2.5 py-1 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded whitespace-nowrap cursor-pointer"
                            >
                              Log Oversight Follow-Up
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400">Peer workflow active</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regional Reported Inventory Oversight */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Regional Resource Reporting Monitor (`inventory_items`)
                </h2>
                <p className="text-xs text-slate-500">
                  Important: Reported figures represent facility-submitted status updates and do not
                  guarantee physical availability without supplier confirmation.
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
                    <th className="py-3 px-4">Facility</th>
                    <th className="py-3 px-4">Resource</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Reported Qty</th>
                    <th className="py-3 px-4">Reported Status</th>
                    <th className="py-3 px-4">Last Updated</th>
                    <th className="py-3 px-4">Responsible Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {item.facilityName}
                      </td>
                      <td className="py-3 px-4 text-slate-900">{item.resourceName}</td>
                      <td className="py-3 px-4 text-slate-600">{item.category}</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        <span
                          className={
                            item.availabilityStatus === "Available"
                              ? "text-emerald-700"
                              : item.availabilityStatus === "Limited"
                              ? "text-amber-700"
                              : "text-red-700"
                          }
                        >
                          {item.availabilityStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{item.lastUpdated}</td>
                      <td className="py-3 px-4 text-slate-600">{item.updatedByStaff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SECTION 4: REPORTS AND ANALYTICS                                  */}
      {/* ================================================================= */}
      {activeSection === "authority-analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-900">
              Demonstration Resource Demand Breakdown by Category
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Aggregated from simulated East Shewa inter-facility requests (`supply_requests`).
            </p>
            <div className="mt-5 space-y-3 text-xs">
              {(
                [
                  "Blood Product",
                  "Medical Oxygen",
                  "Essential Medication",
                  "Medical Equipment",
                  "Emergency Transport",
                ] as const
              ).map((cat) => {
                const count = requests.filter((r) => r.category === cat).length;
                const invCount = inventory.filter((i) => i.category === cat).length;
                return (
                  <div
                    key={cat}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{cat}</p>
                      <p className="text-slate-500 mt-0.5">
                        {invCount} reported facility inventory lines across network
                      </p>
                    </div>
                    <span className="font-mono tabular-nums font-bold text-slate-900">
                      {count} Request(s)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-900">
              Coordination Governance &amp; Data Integrity Notes
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Analytical safeguards enforced by the Regional Coordination Authority:
            </p>
            <ul className="mt-4 space-y-3 text-xs text-slate-700 leading-relaxed">
              <li className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <strong>1. No Unverified Clinical Outcome Claims:</strong> Reports track operational
                coordination states (Submitted, Confirmed, In Transit, Received) rather than
                fabricating clinical survival figures.
              </li>
              <li className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <strong>2. Freshness Decay Tracking:</strong> Any inventory record not confirmed
                within 24 hours transitions to <code>Update required</code> so requesting clinics
                are warned of stale reports.
              </li>
              <li className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <strong>3. Partial Fulfillment Transparency:</strong> Suppliers can confirm partial
                quantities (e.g., 2 of 3 oxygen cylinders) to protect their own inpatient safety
                margins.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SECTION 5: USER & PERMISSION MANAGEMENT + AUDIT LOGS              */}
      {/* ================================================================= */}
      {activeSection === "authority-rbac-audit" && (
        <div className="space-y-6">
          {/* RBAC Matrix */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-900">
              Role-Based Access Control (RBAC) Governance Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Permissions enforced at the application and PostgreSQL Row-Level Security (RLS)
              layers.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
                    <th className="py-2.5 px-4">Role</th>
                    <th className="py-2.5 px-4">Verify Institutions</th>
                    <th className="py-2.5 px-4">Update Own Inventory</th>
                    <th className="py-2.5 px-4">Submit / Confirm Requests</th>
                    <th className="py-2.5 px-4">Blood Release Review</th>
                    <th className="py-2.5 px-4">Manage Transport</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    [
                      "Regional authority administrator",
                      "Yes (Full)",
                      "No (Oversight Only)",
                      "Mediate Escalations",
                      "Audit Only",
                      "Monitor Only",
                    ],
                    [
                      "Facility administrator",
                      "No",
                      "Yes (Own Facility)",
                      "Yes (Own Facility)",
                      "With Blood Officer",
                      "Coordinate",
                    ],
                    [
                      "Inventory officer",
                      "No",
                      "Yes (Own Facility)",
                      "View / Assist",
                      "No",
                      "Handover Prep",
                    ],
                    [
                      "Request officer",
                      "No",
                      "View Only",
                      "Submit & Acknowledge Receipt",
                      "Initiate Inquiry",
                      "Track Delivery",
                    ],
                    [
                      "Medical/blood service officer",
                      "No",
                      "Blood Inventory Only",
                      "Confirm/Decline Blood Requests",
                      "Yes (Required)",
                      "Cold-Chain Signoff",
                    ],
                    [
                      "Logistics coordinator",
                      "No",
                      "View Only",
                      "View Confirmed",
                      "No",
                      "Yes (Full Dispatch)",
                    ],
                    [
                      "Technical system administrator",
                      "Audit Only",
                      "No",
                      "No",
                      "No",
                      "Schema & Gateway Config",
                    ],
                  ].map(([role, v, inv, req, bld, log]) => (
                    <tr key={role} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{role}</td>
                      <td className="py-3 px-4 text-slate-600">{v}</td>
                      <td className="py-3 px-4 text-slate-600">{inv}</td>
                      <td className="py-3 px-4 text-slate-600">{req}</td>
                      <td className="py-3 px-4 text-slate-600">{bld}</td>
                      <td className="py-3 px-4 text-slate-600">{log}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Immutable Governance Audit Logs (`audit_logs`)
                </h2>
                <p className="text-xs text-slate-500">
                  Every inventory update, request submission, supplier confirmation, and
                  verification action is recorded chronologically.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">{auditLogs.length} Entries</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
                    <th className="py-3 px-4">Log ID &amp; Timestamp</th>
                    <th className="py-3 px-4">Actor &amp; Role</th>
                    <th className="py-3 px-4">Institution</th>
                    <th className="py-3 px-4">Action Type</th>
                    <th className="py-3 px-4">Entity Ref</th>
                    <th className="py-3 px-4">Audit Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-900 whitespace-nowrap">
                        <span className="font-bold">{log.id}</span>
                        <div className="text-[11px] text-slate-500">{log.timestamp}</div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{log.actorName}</p>
                        <p className="text-slate-500">{log.actorRole}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{log.actorFacility}</td>
                      <td className="py-3 px-4 font-mono text-emerald-800 font-semibold">
                        {log.actionType}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">{log.entityReference}</td>
                      <td className="py-3 px-4 text-slate-700 max-w-md">{log.summary}</td>
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
