/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
  Lock,
  ArrowLeft,
} from "lucide-react";
import type {
  EnvironmentMode,
  PublicPageId,
  PortalWorkspaceId,
  Facility,
  FacilityApplication,
  DemoUserAccount,
  StaffMember,
  InventoryRecord,
  InventoryHistoryEntry,
  SupplyRequest,
  DispatchRecord,
  UAVAssessmentRecord,
  PlatformNotification,
  AuditLogEntry,
  InstitutionVerificationStatus,
  AvailabilityStatus,
  ResourceCategory,
  UserRole,
} from "./types/carebridge";
import {
  DEMO_FACILITIES,
  INITIAL_FACILITY_APPLICATIONS,
  DEMO_USER_ACCOUNTS,
  INITIAL_STAFF_MEMBERS,
  INITIAL_INVENTORY_RECORDS,
  INITIAL_INVENTORY_HISTORY,
  INITIAL_SUPPLY_REQUESTS,
  INITIAL_DISPATCH_RECORDS,
  INITIAL_UAV_ASSESSMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from "./data/demo/initialState";
import { PublicWebsite } from "./pages/public/PublicWebsite";
import { Login } from "./pages/auth/Login";
import { AuthorityWorkspace } from "./pages/authority/AuthorityWorkspace";
import { FacilityWorkspace } from "./pages/facility/FacilityWorkspace";
import { LogisticsAndSystemsWorkspace } from "./pages/logistics/LogisticsAndSystemsWorkspace";

interface ToastMessage {
  id: string;
  title: string;
  detail: string;
  tone: "success" | "warning" | "info";
}

export default function App() {
  // Environment separation: "public" | "login" | "portal"
  const [environment, setEnvironment] = useState<EnvironmentMode>("public");
  const [publicPage, setPublicPage] = useState<PublicPageId>("home");
  const [portalWorkspace, setPortalWorkspace] = useState<PortalWorkspaceId>("facility-overview");

  // Current Demonstration User & Active Facility Context
  const [currentUser, setCurrentUser] = useState<DemoUserAccount>(DEMO_USER_ACCOUNTS[1]); // Default to Adama HMC Facility Admin when entering portal
  const [activeFacilityId, setActiveFacilityId] = useState<string>("FAC-ADAMA-HMC");

  // Shared Demonstration State
  const [facilities, setFacilities] = useState<Facility[]>(DEMO_FACILITIES);
  const [applications, setApplications] = useState<FacilityApplication[]>(
    INITIAL_FACILITY_APPLICATIONS
  );
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(INITIAL_STAFF_MEMBERS);
  const [inventory, setInventory] = useState<InventoryRecord[]>(INITIAL_INVENTORY_RECORDS);
  const [inventoryHistory, setInventoryHistory] = useState<InventoryHistoryEntry[]>(
    INITIAL_INVENTORY_HISTORY
  );
  const [requests, setRequests] = useState<SupplyRequest[]>(INITIAL_SUPPLY_REQUESTS);
  const [dispatchRecords, setDispatchRecords] = useState<DispatchRecord[]>(
    INITIAL_DISPATCH_RECORDS
  );
  const [uavAssessments, setUavAssessments] = useState<UAVAssessmentRecord[]>(
    INITIAL_UAV_ASSESSMENTS
  );
  const [notifications, setNotifications] =
    useState<PlatformNotification[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = (
    title: string,
    detail: string,
    tone: "success" | "warning" | "info" = "info"
  ) => {
    const id = `TST-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [{ id, title, detail, tone }, ...prev.slice(0, 3)]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  const appendAuditLog = (
    actionType: AuditLogEntry["actionType"],
    entityReference: string,
    summary: string,
    overrideActor?: { name: string; role: UserRole; facility: string }
  ) => {
    const entry: AuditLogEntry = {
      id: `AUD-${Math.floor(9010 + Math.random() * 900)}`,
      actorName: overrideActor?.name || currentUser.fullName,
      actorRole: overrideActor?.role || currentUser.role,
      actorFacility: overrideActor?.facility || currentUser.facilityName,
      actionType,
      entityReference,
      summary,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  // Handle Login Account Selection
  const handleSelectAccount = (account: DemoUserAccount) => {
    setCurrentUser(account);
    if (account.facilityId !== "REGIONAL-AUTHORITY") {
      setActiveFacilityId(account.facilityId);
    }
    setPortalWorkspace(account.defaultWorkspace);
    setEnvironment("portal");
    pushToast(
      `Signed in (Demo Mode): ${account.role}`,
      `Active Scope: ${account.facilityName}`,
      "info"
    );
  };

  // 1. Public Onboarding Application Submission
  const handleSubmitOnboardingApplication = (
    appData: Omit<FacilityApplication, "id" | "status" | "submittedAt">
  ) => {
    const newApp: FacilityApplication = {
      ...appData,
      id: `APP-2026-${Math.floor(100 + Math.random() * 899)}`,
      status: "Pending",
      submittedAt: "Just now",
    };
    setApplications((prev) => [newApp, ...prev]);
    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}`,
        targetScope: "Authority",
        title: `New Institutional Application (${newApp.id})`,
        message: `${newApp.institutionName} (${newApp.woredaCity}) applied for CareBridge verification.`,
        severity: "info",
        timestamp: "Just now",
        read: false,
      },
      ...prev,
    ]);
    pushToast(
      "Application Submitted",
      `${newApp.institutionName} added to Regional Coordination Authority verification queue.`,
      "success"
    );
  };

  // 2. Authority: Verify or Reject Institutional Application
  const handleVerifyApplication = (
    appId: string,
    decision: InstitutionVerificationStatus,
    reviewNote: string
  ) => {
    const targetApp = applications.find((a) => a.id === appId);
    if (!targetApp) return;

    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: decision,
              notes: `${a.notes} [Review: ${reviewNote}]`,
              reviewedBy: currentUser.fullName,
            }
          : a
      )
    );

    if (decision === "Verified") {
      const newFacility: Facility = {
        id: `FAC-${Date.now().toString().slice(-4)}`,
        name: targetApp.institutionName,
        facilityType: targetApp.facilityType,
        woredaCity: targetApp.woredaCity,
        verificationStatus: "Verified",
        contactPerson: targetApp.applicantName,
        contactPhone: targetApp.contactPhone,
        contactEmail: targetApp.contactEmail,
        hasBloodService: targetApp.facilityType === "Blood Service Center",
        lastInventorySync: "Just verified",
        freshnessStatus: "Update required",
        isDemoExample: true,
      };
      setFacilities((prev) => [...prev, newFacility]);
    }

    appendAuditLog(
      "FACILITY_VERIFICATION",
      appId,
      `Application for ${targetApp.institutionName} marked '${decision}'. Note: ${reviewNote}`
    );

    pushToast(
      `Institution ${decision}`,
      `${targetApp.institutionName} status updated to ${decision}.`,
      decision === "Verified" ? "success" : "warning"
    );
  };

  // 3. Authority: Update Standing Facility Verification Status
  const handleUpdateFacilityVerification = (
    facilityId: string,
    status: InstitutionVerificationStatus
  ) => {
    const target = facilities.find((f) => f.id === facilityId);
    if (!target) return;
    setFacilities((prev) =>
      prev.map((f) => (f.id === facilityId ? { ...f, verificationStatus: status } : f))
    );
    appendAuditLog(
      "FACILITY_VERIFICATION",
      facilityId,
      `Updated institutional status for ${target.name} to '${status}'.`
    );
    pushToast("Facility Status Updated", `${target.name} is now ${status}.`, "info");
  };

  // 4. Authority: Mediate Unanswered / Escalated Request
  const handleAuthorityMediateRequest = (requestId: string, note: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          updatedAt: "Just now",
          statusHistory: [
            ...r.statusHistory,
            {
              status: r.status,
              actorName: currentUser.fullName,
              actorFacility: "Regional Coordination Authority",
              timestamp: "Just now",
              note: `[Authority Oversight Follow-Up]: ${note}`,
            },
          ],
        };
      })
    );
    appendAuditLog("ESCALATION", requestId, `Regional Authority logged mediation note: ${note}`);
    pushToast("Oversight Follow-Up Logged", `Recorded mediation note on ${requestId}.`, "info");
  };

  // 5. Facility: Update Reported Inventory Record
  const handleUpdateInventoryRecord = (
    recordId: string,
    newQty: number,
    newStatus: AvailabilityStatus,
    reason: string
  ) => {
    const existing = inventory.find((i) => i.id === recordId);
    if (!existing) return;

    const historyEntry: InventoryHistoryEntry = {
      id: `HIST-${Date.now().toString().slice(-4)}`,
      inventoryId: recordId,
      facilityName: existing.facilityName,
      resourceName: existing.resourceName,
      previousQty: existing.quantity,
      newQty,
      previousStatus: existing.availabilityStatus,
      newStatus,
      updatedBy: currentUser.fullName,
      timestamp: "Just now",
      reason,
    };

    setInventoryHistory((prev) => [historyEntry, ...prev]);
    setInventory((prev) =>
      prev.map((i) =>
        i.id === recordId
          ? {
              ...i,
              quantity: newQty,
              availabilityStatus: newStatus,
              lastUpdated: "Just now",
              updatedByStaff: currentUser.fullName,
            }
          : i
      )
    );

    setFacilities((prev) =>
      prev.map((f) =>
        f.id === existing.facilityId
          ? { ...f, lastInventorySync: "Just now", freshnessStatus: "Current" }
          : f
      )
    );

    appendAuditLog(
      "INVENTORY_UPDATE",
      recordId,
      `Updated ${existing.resourceName} at ${existing.facilityName}: ${existing.quantity} -> ${newQty} (${newStatus}).`
    );

    pushToast(
      "Reported Inventory Updated",
      `${existing.resourceName} updated to ${newQty} ${existing.unit} (${newStatus}).`,
      "success"
    );
  };

  // 6. Facility: Add New Resource Record
  const handleAddInventoryRecord = (newRec: {
    category: ResourceCategory;
    resourceName: string;
    quantity: number;
    unit: string;
    availabilityStatus: AvailabilityStatus;
    requiresColdChain: boolean;
    notes: string;
  }) => {
    const activeFac = facilities.find((f) => f.id === activeFacilityId) || facilities[0];
    const created: InventoryRecord = {
      id: `INV-CB-${Math.floor(200 + Math.random() * 799)}`,
      facilityId: activeFac.id,
      facilityName: activeFac.name,
      woredaCity: activeFac.woredaCity,
      category: newRec.category,
      resourceName: newRec.resourceName,
      quantity: newRec.quantity,
      unit: newRec.unit,
      availabilityStatus: newRec.availabilityStatus,
      lastUpdated: "Just now",
      updatedByStaff: currentUser.fullName,
      requiresColdChain: newRec.requiresColdChain,
      contactPhone: activeFac.contactPhone,
      notes: newRec.notes,
    };

    setInventory((prev) => [created, ...prev]);
    appendAuditLog(
      "INVENTORY_UPDATE",
      created.id,
      `Added new reported resource '${created.resourceName}' (${created.quantity} ${created.unit}) at ${activeFac.name}.`
    );
    pushToast(
      "Resource Added",
      `${created.resourceName} added to ${activeFac.name} reported inventory.`,
      "success"
    );
  };

  // 7. Facility: Submit Outgoing Request (NEVER automatically deducts stock)
  const handleSubmitNewRequest = (reqData: {
    supplierFacilityId: string;
    category: ResourceCategory;
    resourceName: string;
    requestedQuantity: number;
    unit: string;
    urgency: "Standard" | "Urgent" | "Emergency";
    isBloodCoordination: boolean;
    bloodCompatibilityAcknowledged: boolean;
    nonIdentifiableClinicalContext: string;
  }) => {
    const reqFac = facilities.find((f) => f.id === activeFacilityId) || facilities[0];
    const supFac =
      facilities.find((f) => f.id === reqData.supplierFacilityId) || facilities[0];

    const newReq: SupplyRequest = {
      id: `REQ-2026-${Math.floor(410 + Math.random() * 580)}`,
      requestingFacilityId: reqFac.id,
      requestingFacilityName: reqFac.name,
      requestingOfficer: currentUser.fullName,
      requestingPhone: reqFac.contactPhone,
      supplierFacilityId: supFac.id,
      supplierFacilityName: supFac.name,
      category: reqData.category,
      resourceName: reqData.resourceName,
      requestedQuantity: reqData.requestedQuantity,
      confirmedQuantity: null,
      unit: reqData.unit,
      urgency: reqData.urgency,
      status: "Awaiting Supplier",
      isBloodCoordination: reqData.isBloodCoordination,
      bloodCompatibilityAcknowledged: reqData.bloodCompatibilityAcknowledged,
      nonIdentifiableClinicalContext: reqData.nonIdentifiableClinicalContext,
      supplierResponseNote: `Awaiting explicit review and confirmation by ${supFac.name}.`,
      createdAt: "Just now",
      updatedAt: "Just now",
      statusHistory: [
        {
          status: "Submitted",
          actorName: currentUser.fullName,
          actorFacility: reqFac.name,
          timestamp: "Just now",
          note: "Submitted formal request. Supplier stock was NOT automatically deducted.",
        },
        {
          status: "Awaiting Supplier",
          actorName: "CareBridge Routing",
          actorFacility: "System",
          timestamp: "Just now",
          note: `Delivered to ${supFac.name} Incoming Requests queue.`,
        },
      ],
    };

    setRequests((prev) => [newReq, ...prev]);
    appendAuditLog(
      "REQUEST_SUBMITTED",
      newReq.id,
      `${reqFac.name} requested ${newReq.requestedQuantity} ${newReq.unit} of ${newReq.resourceName} from ${supFac.name}.`
    );

    pushToast(
      `Request ${newReq.id} Submitted`,
      `Routed to ${supFac.name} for explicit supplier review. Stock is not deducted until supplier confirms.`,
      "success"
    );
  };

  // 8. Supplier Facility: Explicitly Confirm Full, Confirm Partial, Request Clarification, or Decline
  const handleSupplierRespondToRequest = (
    requestId: string,
    decision: "Confirmed" | "Partially Confirmed" | "Declined" | "Clarification",
    confirmedQty: number | null,
    responseNote: string
  ) => {
    const targetReq = requests.find((r) => r.id === requestId);
    if (!targetReq) return;

    const nextStatus =
      decision === "Clarification" ? ("Awaiting Supplier" as const) : decision;

    // Deduct stock ONLY if supplier explicitly Confirmed or Partially Confirmed
    if (
      (decision === "Confirmed" || decision === "Partially Confirmed") &&
      confirmedQty &&
      confirmedQty > 0
    ) {
      setInventory((prev) =>
        prev.map((inv) => {
          if (
            inv.facilityId === targetReq.supplierFacilityId &&
            inv.resourceName.toLowerCase() === targetReq.resourceName.toLowerCase()
          ) {
            const updatedQty = Math.max(0, inv.quantity - confirmedQty);
            const updatedStatus: AvailabilityStatus =
              updatedQty === 0 ? "Unavailable" : updatedQty <= 2 ? "Limited" : "Available";
            return {
              ...inv,
              quantity: updatedQty,
              availabilityStatus: updatedStatus,
              lastUpdated: "Confirmed just now",
            };
          }
          return inv;
        })
      );

      // Create Logistics Dispatch Record in "Logistics Pending" state
      const newDispatch: DispatchRecord = {
        id: `LOG-${Math.floor(8900 + Math.random() * 999)}`,
        requestId: targetReq.id,
        requestingFacilityName: targetReq.requestingFacilityName,
        supplyingFacilityName: targetReq.supplierFacilityName,
        resourceSummary: `${confirmedQty} ${targetReq.unit} — ${targetReq.resourceName} (${decision})`,
        transportMethod: targetReq.isBloodCoordination
          ? "Cold-Chain Medical Courier"
          : "Facility Ground Vehicle",
        responsibleCoordinator: "Ato Solomon Dibaba (East Shewa Logistics Desk)",
        coordinatorPhone: "+251 911 402 918",
        deliveryStatus: "Logistics Pending",
        expectedDeliveryWindow: "Awaiting transport departure confirmation",
        coldChainVerified: targetReq.isBloodCoordination,
      };
      setDispatchRecords((prev) => [newDispatch, ...prev]);
    }

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          status: nextStatus,
          confirmedQuantity:
            decision === "Confirmed" || decision === "Partially Confirmed"
              ? confirmedQty
              : decision === "Declined"
              ? 0
              : r.confirmedQuantity,
          supplierResponseNote: responseNote,
          respondedByStaff: currentUser.fullName,
          updatedAt: "Just now",
          statusHistory: [
            ...r.statusHistory,
            {
              status: nextStatus,
              actorName: currentUser.fullName,
              actorFacility: targetReq.supplierFacilityName,
              timestamp: "Just now",
              note: responseNote,
            },
          ],
        };
      })
    );

    appendAuditLog(
      "SUPPLIER_RESPONSE",
      requestId,
      `${targetReq.supplierFacilityName} responded '${decision}' (Confirmed Qty: ${
        confirmedQty ?? "N/A"
      }). Note: ${responseNote}`
    );

    pushToast(
      `Supplier Response Recorded (${decision})`,
      `${requestId}: ${responseNote}`,
      decision === "Declined" ? "warning" : "success"
    );
  };

  // 9. Requesting Facility: Cancel, Escalate, or Acknowledge Physical Receipt
  const handleRequesterAction = (
    requestId: string,
    action: "Cancel" | "Escalate" | "AcknowledgeReceipt",
    note: string
  ) => {
    const targetReq = requests.find((r) => r.id === requestId);
    if (!targetReq) return;

    const nextStatus =
      action === "Cancel"
        ? ("Cancelled" as const)
        : action === "Escalate"
        ? ("Escalated" as const)
        : ("Received" as const);

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          status: nextStatus,
          updatedAt: "Just now",
          statusHistory: [
            ...r.statusHistory,
            {
              status: nextStatus,
              actorName: currentUser.fullName,
              actorFacility: targetReq.requestingFacilityName,
              timestamp: "Just now",
              note,
            },
          ],
        };
      })
    );

    if (action === "AcknowledgeReceipt") {
      setDispatchRecords((prev) =>
        prev.map((d) =>
          d.requestId === requestId
            ? {
                ...d,
                deliveryStatus: "Handover Confirmed",
                handoverAcknowledgedBy: currentUser.fullName,
                handoverTimestamp: "Just now",
              }
            : d
        )
      );
      appendAuditLog("RECEIPT_ACKNOWLEDGED", requestId, note);
    } else if (action === "Escalate") {
      appendAuditLog("ESCALATION", requestId, note);
    } else {
      appendAuditLog("SUPPLIER_RESPONSE", requestId, note);
    }

    pushToast(`Request ${nextStatus}`, `${requestId}: ${note}`, "info");
  };

  // 10. Logistics Coordinator: Advance Dispatch Status
  const handleAdvanceDispatchStatus = (
    dispatchId: string,
    nextStatus: "In Transit" | "Delivered",
    transportMethod?: DispatchRecord["transportMethod"]
  ) => {
    const targetDisp = dispatchRecords.find((d) => d.id === dispatchId);
    if (!targetDisp) return;

    setDispatchRecords((prev) =>
      prev.map((d) =>
        d.id === dispatchId
          ? {
              ...d,
              deliveryStatus: nextStatus,
              transportMethod: transportMethod || d.transportMethod,
              expectedDeliveryWindow:
                nextStatus === "In Transit"
                  ? "En route along East Shewa corridor"
                  : "Arrived at destination; awaiting receiving facility sign-off",
            }
          : d
      )
    );

    setRequests((prev) =>
      prev.map((r) =>
        r.id === targetDisp.requestId
          ? {
              ...r,
              status: nextStatus,
              updatedAt: "Just now",
              statusHistory: [
                ...r.statusHistory,
                {
                  status: nextStatus,
                  actorName: currentUser.fullName,
                  actorFacility: "East Shewa Inter-Facility Logistics Desk",
                  timestamp: "Just now",
                  note: `Shipment marked '${nextStatus}' (${
                    transportMethod || targetDisp.transportMethod
                  }).`,
                },
              ],
            }
          : r
      )
    );

    appendAuditLog(
      "LOGISTICS_UPDATE",
      `${dispatchId} / ${targetDisp.requestId}`,
      `Transport status updated to '${nextStatus}'.`
    );

    pushToast(
      `Logistics Updated: ${nextStatus}`,
      `${targetDisp.requestId} is now ${nextStatus}.`,
      "success"
    );
  };

  // 11. Facility Staff Invitation
  const handleInviteStaff = (staff: {
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
  }) => {
    const activeFac = facilities.find((f) => f.id === activeFacilityId) || facilities[0];
    const created: StaffMember = {
      id: `STF-${Date.now().toString().slice(-3)}`,
      facilityId: activeFac.id,
      facilityName: activeFac.name,
      fullName: staff.fullName,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      status: "Active",
      lastActive: "Invited just now",
    };
    setStaffMembers((prev) => [created, ...prev]);
    appendAuditLog(
      "ROLE_PERMISSION",
      created.id,
      `Invited ${created.fullName} as '${created.role}' at ${activeFac.name}.`
    );
    pushToast(
      "Staff Member Added",
      `${created.fullName} assigned role '${created.role}' at ${activeFac.name}.`,
      "success"
    );
  };

  // 12. Reset Demo Data
  const handleResetDemo = () => {
    setFacilities(DEMO_FACILITIES);
    setApplications(INITIAL_FACILITY_APPLICATIONS);
    setStaffMembers(INITIAL_STAFF_MEMBERS);
    setInventory(INITIAL_INVENTORY_RECORDS);
    setInventoryHistory(INITIAL_INVENTORY_HISTORY);
    setRequests(INITIAL_SUPPLY_REQUESTS);
    setDispatchRecords(INITIAL_DISPATCH_RECORDS);
    setUavAssessments(INITIAL_UAV_ASSESSMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    pushToast(
      "Demonstration Dataset Restored",
      "All East Shewa facilities, inventories, requests, and audit logs reset to initial demo state.",
      "info"
    );
  };

  const activeFacility =
    facilities.find((f) => f.id === activeFacilityId) || facilities[0];

  // Render Public Website Environment
  if (environment === "public") {
    return (
      <>
        <PublicWebsite
          activePage={publicPage}
          onNavigatePage={setPublicPage}
          onOpenPortalLogin={() => setEnvironment("login")}
          facilities={facilities}
          requests={requests}
          onSubmitOnboardingApplication={handleSubmitOnboardingApplication}
        />
      </>
    );
  }

  // Render Demonstration Login Environment
  if (environment === "login") {
    return (
      <Login
        accounts={DEMO_USER_ACCOUNTS}
        onSelectAccount={handleSelectAccount}
        onBackToPublic={() => setEnvironment("public")}
        onGoToOnboarding={() => {
          setPublicPage("partnerships");
          setEnvironment("public");
        }}
      />
    );
  }

  // Render Secure Institutional Platform Environment
  const isAuthorityWorkspace = portalWorkspace.startsWith("authority-");
  const isFacilityWorkspace = portalWorkspace.startsWith("facility-");
  const isLogisticsOrSystemWorkspace =
    portalWorkspace.startsWith("logistics-") ||
    portalWorkspace === "low-connectivity-sms" ||
    portalWorkspace === "admin-assistant" ||
    portalWorkspace === "architecture-schema";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 px-6 py-3.5">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand Title */}
          <a
            href="#portal"
            onClick={(e) => {
              e.preventDefault();
              setPortalWorkspace("facility-overview");
            }}
            className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            CareBridge Ethiopia
          </a>

          {/* Zone 2: Primary Portal Workspaces */}
          <nav
            aria-label="Institutional Portal Navigation"
            className="flex items-center gap-6 overflow-x-auto text-sm font-medium"
          >
            <button
              type="button"
              onClick={() => setPortalWorkspace("facility-overview")}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
                isFacilityWorkspace
                  ? "border-emerald-400 text-white font-semibold"
                  : "border-transparent text-slate-300 hover:text-white"
              }`}
            >
              Institutional Workspace
            </button>
            <button
              type="button"
              onClick={() => setPortalWorkspace("authority-overview")}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
                isAuthorityWorkspace
                  ? "border-emerald-400 text-white font-semibold"
                  : "border-transparent text-slate-300 hover:text-white"
              }`}
            >
              Regional Coordination Authority
            </button>
            <button
              type="button"
              onClick={() => setPortalWorkspace("logistics-tracking")}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
                isLogisticsOrSystemWorkspace
                  ? "border-emerald-400 text-white font-semibold"
                  : "border-transparent text-slate-300 hover:text-white"
              }`}
            >
              Logistics, UAV &amp; Architecture
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setEnvironment("public")}
              className="px-3.5 py-2 text-xs font-semibold text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Public Website
            </button>
          </div>
        </div>
      </header>

      {/* Demonstration Session & Role Context Bar */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-2">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-amber-950">
          <div className="flex flex-wrap items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span className="font-bold">DEMONSTRATION MODE PORTAL</span>
            <span aria-hidden="true">·</span>
            <span>
              Active Officer: <strong>{currentUser.fullName}</strong> ({currentUser.role})
            </span>
            <span aria-hidden="true">·</span>
            <span>Simulated East Shewa Dataset (Not Live Clinical Stock)</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-amber-900">Switch Demo Role:</span>
              <select
                value={currentUser.id}
                onChange={(e) => {
                  const found = DEMO_USER_ACCOUNTS.find((a) => a.id === e.target.value);
                  if (found) handleSelectAccount(found);
                }}
                className="px-2 py-1 text-xs font-semibold bg-white border border-amber-300 rounded text-slate-900 cursor-pointer"
              >
                {DEMO_USER_ACCOUNTS.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.role} — {acc.facilityName}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleResetDemo}
              className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Toasts */}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0"
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              className="pointer-events-auto bg-slate-900 text-white border border-slate-700 rounded-lg p-4 shadow-lg flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                {t.tone === "warning" ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-xs font-bold">{t.title}</p>
                  <p className="text-xs text-slate-300 mt-0.5">{t.detail}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Portal Content */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-6">
        {isAuthorityWorkspace && (
          <AuthorityWorkspace
            activeSection={portalWorkspace}
            onSelectSection={setPortalWorkspace}
            facilities={facilities}
            applications={applications}
            inventory={inventory}
            requests={requests}
            notifications={notifications}
            auditLogs={auditLogs}
            onVerifyApplication={handleVerifyApplication}
            onUpdateFacilityVerification={handleUpdateFacilityVerification}
            onAuthorityMediateRequest={handleAuthorityMediateRequest}
          />
        )}

        {isFacilityWorkspace && (
          <FacilityWorkspace
            activeSection={portalWorkspace}
            onSelectSection={setPortalWorkspace}
            activeFacility={activeFacility}
            allFacilities={facilities}
            onSwitchActiveFacility={setActiveFacilityId}
            currentUser={currentUser}
            inventory={inventory}
            inventoryHistory={inventoryHistory}
            requests={requests}
            staffMembers={staffMembers}
            onUpdateInventoryRecord={handleUpdateInventoryRecord}
            onAddInventoryRecord={handleAddInventoryRecord}
            onSubmitNewRequest={handleSubmitNewRequest}
            onSupplierRespondToRequest={handleSupplierRespondToRequest}
            onRequesterAction={handleRequesterAction}
            onInviteStaff={handleInviteStaff}
          />
        )}

        {isLogisticsOrSystemWorkspace && (
          <LogisticsAndSystemsWorkspace
            activeSection={portalWorkspace}
            onSelectSection={setPortalWorkspace}
            dispatchRecords={dispatchRecords}
            uavAssessments={uavAssessments}
            requests={requests}
            inventory={inventory}
            onAdvanceDispatchStatus={handleAdvanceDispatchStatus}
            onAddUavAssessment={(u) => {
              setUavAssessments((prev) => [
                { id: `UAV-SIM-0${prev.length + 1}`, ...u },
                ...prev,
              ]);
              pushToast(
                "Simulated UAV Assessment Added",
                `Evaluated '${u.cargoDescription}': ${u.overallFeasibility}`,
                "info"
              );
            }}
          />
        )}
      </main>

      {/* Quiet Portal Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-4 mt-12">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            CareBridge Ethiopia · Secure Institutional Coordination Platform (Demonstration Mode)
          </span>
          <span>East Shewa Zone, Oromia · Centralized Oversight, Decentralized Response</span>
        </div>
      </footer>
    </div>
  );
}
