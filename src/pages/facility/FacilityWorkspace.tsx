import React, { useState, useMemo } from "react";
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Plus,
  Send,
  ShieldAlert,
  UserPlus,
  History,
  PhoneCall,
} from "lucide-react";
import type {
  PortalWorkspaceId,
  Facility,
  DemoUserAccount,
  InventoryRecord,
  InventoryHistoryEntry,
  SupplyRequest,
  StaffMember,
  ResourceCategory,
  AvailabilityStatus,
  UserRole,
} from "../../types/carebridge";

interface FacilityWorkspaceProps {
  activeSection: PortalWorkspaceId;
  onSelectSection: (section: PortalWorkspaceId) => void;
  activeFacility: Facility;
  allFacilities: Facility[];
  onSwitchActiveFacility: (facilityId: string) => void;
  currentUser: DemoUserAccount;
  inventory: InventoryRecord[];
  inventoryHistory: InventoryHistoryEntry[];
  requests: SupplyRequest[];
  staffMembers: StaffMember[];
  onUpdateInventoryRecord: (
    recordId: string,
    newQty: number,
    newStatus: AvailabilityStatus,
    reason: string
  ) => void;
  onAddInventoryRecord: (record: {
    category: ResourceCategory;
    resourceName: string;
    quantity: number;
    unit: string;
    availabilityStatus: AvailabilityStatus;
    requiresColdChain: boolean;
    notes: string;
  }) => void;
  onSubmitNewRequest: (req: {
    supplierFacilityId: string;
    category: ResourceCategory;
    resourceName: string;
    requestedQuantity: number;
    unit: string;
    urgency: "Standard" | "Urgent" | "Emergency";
    isBloodCoordination: boolean;
    bloodCompatibilityAcknowledged: boolean;
    nonIdentifiableClinicalContext: string;
  }) => void;
  onSupplierRespondToRequest: (
    requestId: string,
    decision: "Confirmed" | "Partially Confirmed" | "Declined" | "Clarification",
    confirmedQty: number | null,
    responseNote: string
  ) => void;
  onRequesterAction: (
    requestId: string,
    action: "Cancel" | "Escalate" | "AcknowledgeReceipt",
    note: string
  ) => void;
  onInviteStaff: (staff: {
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
  }) => void;
}

export const FacilityWorkspace: React.FC<FacilityWorkspaceProps> = ({
  activeSection,
  onSelectSection,
  activeFacility,
  allFacilities,
  onSwitchActiveFacility,
  currentUser,
  inventory,
  inventoryHistory,
  requests,
  staffMembers,
  onUpdateInventoryRecord,
  onAddInventoryRecord,
  onSubmitNewRequest,
  onSupplierRespondToRequest,
  onRequesterAction,
  onInviteStaff,
}) => {
  // Facility Inventory Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<AvailabilityStatus>("Available");
  const [editReason, setEditReason] = useState<string>("");

  // Add New Inventory Item Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState<ResourceCategory>("Essential Medication");
  const [newResourceName, setNewResourceName] = useState("");
  const [newQty, setNewQty] = useState<number>(5);
  const [newUnit, setNewUnit] = useState("Units");
  const [newStatus, setNewStatus] = useState<AvailabilityStatus>("Available");
  const [newColdChain, setNewColdChain] = useState(false);
  const [newNotes, setNewNotes] = useState("");

  // Resource Discovery Filter State
  const [discSearch, setDiscSearch] = useState("");
  const [discCategory, setDiscCategory] = useState<"All" | ResourceCategory>("All");
  const [discLocation, setDiscLocation] = useState<string>("All");
  const [discFacilityId, setDiscFacilityId] = useState<string>("All");
  const [discAvailability, setDiscAvailability] = useState<"All" | AvailabilityStatus>("All");

  // Outgoing Request Form State
  const [reqSupplierId, setReqSupplierId] = useState<string>("FAC-ADAMA-HMC");
  const [reqCategory, setReqCategory] = useState<ResourceCategory>("Blood Product");
  const [reqResourceName, setReqResourceName] = useState<string>(
    "Whole Blood / Packed RBC — O RhD Negative (O-Neg)"
  );
  const [reqQty, setReqQty] = useState<number>(2);
  const [reqUnit, setReqUnit] = useState<string>("Units");
  const [reqUrgency, setReqUrgency] = useState<"Standard" | "Urgent" | "Emergency">("Emergency");
  const [reqBloodAck, setReqBloodAck] = useState<boolean>(false);
  const [reqContext, setReqContext] = useState<string>("");
  const [reqFormError, setReqFormError] = useState<string | null>(null);

  // Incoming Supplier Review State
  const [partialQtyInput, setPartialQtyInput] = useState<Record<string, number>>({});
  const [supplierNoteInput, setSupplierNoteInput] = useState<Record<string, string>>({});

  // Staff Invite State
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPhone, setStaffPhone] = useState("");
  const [staffRole, setStaffRole] = useState<UserRole>("Inventory officer");

  // Scoped Lists for the Active Facility
  const myInventory = useMemo(
    () => inventory.filter((i) => i.facilityId === activeFacility.id),
    [inventory, activeFacility.id]
  );

  const incomingRequests = useMemo(
    () => requests.filter((r) => r.supplierFacilityId === activeFacility.id),
    [requests, activeFacility.id]
  );

  const outgoingRequests = useMemo(
    () => requests.filter((r) => r.requestingFacilityId === activeFacility.id),
    [requests, activeFacility.id]
  );

  const myStaff = useMemo(
    () => staffMembers.filter((s) => s.facilityId === activeFacility.id),
    [staffMembers, activeFacility.id]
  );

  // Filtered Network Inventory for Resource Discovery
  const discoveredResources = useMemo(() => {
    return inventory.filter((item) => {
      const matchesQuery =
        !discSearch.trim() ||
        item.resourceName.toLowerCase().includes(discSearch.toLowerCase()) ||
        item.facilityName.toLowerCase().includes(discSearch.toLowerCase()) ||
        item.woredaCity.toLowerCase().includes(discSearch.toLowerCase());
      const matchesCat = discCategory === "All" || item.category === discCategory;
      const matchesLoc =
        discLocation === "All" ||
        item.woredaCity.toLowerCase().includes(discLocation.toLowerCase());
      const matchesFac = discFacilityId === "All" || item.facilityId === discFacilityId;
      const matchesAvail =
        discAvailability === "All" || item.availabilityStatus === discAvailability;
      return matchesQuery && matchesCat && matchesLoc && matchesFac && matchesAvail;
    });
  }, [inventory, discSearch, discCategory, discLocation, discFacilityId, discAvailability]);

  // Initiate request directly from a discovered resource row
  const handleInitiateRequestFromDiscovery = (item: InventoryRecord) => {
    setReqSupplierId(item.facilityId);
    setReqCategory(item.category);
    setReqResourceName(item.resourceName);
    setReqUnit(item.unit);
    setReqQty(item.quantity > 0 ? Math.min(2, item.quantity) : 1);
    setReqBloodAck(false);
    setReqFormError(null);
    onSelectSection("facility-outgoing");
  };

  const handleCreateRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReqFormError(null);

    if (reqSupplierId === activeFacility.id) {
      setReqFormError("Please select a partner supplying facility other than your own institution.");
      return;
    }

    const isBlood = reqCategory === "Blood Product";
    if (isBlood && !reqBloodAck) {
      setReqFormError(
        "Blood Resource Coordination requires acknowledging that compatibility cross-matching, screening, and release must be authorized by qualified blood service professionals."
      );
      return;
    }

    onSubmitNewRequest({
      supplierFacilityId: reqSupplierId,
      category: reqCategory,
      resourceName: reqResourceName.trim(),
      requestedQuantity: Math.max(1, reqQty),
      unit: reqUnit.trim() || "Units",
      urgency: reqUrgency,
      isBloodCoordination: isBlood,
      bloodCompatibilityAcknowledged: reqBloodAck,
      nonIdentifiableClinicalContext:
        reqContext.trim() ||
        "Inter-facility resource coordination request (no patient-identifiable information).",
    });

    setReqContext("");
  };

  return (
    <div className="space-y-6">
      {/* Facility Context Header & Sub-Navigation */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-emerald-700">
              Verified Institutional Workspace ({activeFacility.verificationStatus})
            </span>
            <span aria-hidden="true">·</span>
            <span>{activeFacility.facilityType}</span>
            <span aria-hidden="true">·</span>
            <span>{activeFacility.woredaCity}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {activeFacility.name}
            </h1>
            {/* Demo helper to switch facility perspective cleanly */}
            <div className="flex items-center gap-1.5 text-xs bg-slate-100 px-2.5 py-1 rounded-md">
              <span className="text-slate-500 font-medium">Demo Perspective:</span>
              <select
                value={activeFacility.id}
                onChange={(e) => onSwitchActiveFacility(e.target.value)}
                className="font-semibold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
              >
                {allFacilities.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 6 Facility Sub-Modules */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-lg shrink-0">
          {(
            [
              ["facility-overview", "Overview"],
              ["facility-inventory", `My Inventory (${myInventory.length})`],
              ["facility-discovery", "Resource Discovery"],
              [
                "facility-incoming",
                `Incoming Requests (${
                  incomingRequests.filter((r) => r.status === "Awaiting Supplier").length
                } Pending)`,
              ],
              ["facility-outgoing", `Outgoing Requests (${outgoingRequests.length})`],
              ["facility-staff", `Staff (${myStaff.length})`],
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
      {/* 1. FACILITY OVERVIEW                                              */}
      {/* ================================================================= */}
      {activeSection === "facility-overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-medium text-slate-500">Reported Inventory Lines</p>
              <p className="mt-2 text-3xl font-bold font-mono tabular-nums text-slate-900">
                {myInventory.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Last sync: {activeFacility.lastInventorySync} ({activeFacility.freshnessStatus})
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-medium text-slate-500">
                Incoming Requests Awaiting Review
              </p>
              <p className="mt-2 text-3xl font-bold font-mono tabular-nums text-amber-700">
                {incomingRequests.filter((r) => r.status === "Awaiting Supplier").length}
              </p>
              <button
                type="button"
                onClick={() => onSelectSection("facility-incoming")}
                className="mt-1 text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
              >
                Open Incoming Supplier Queue →
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-medium text-slate-500">Outgoing Requests Submitted</p>
              <p className="mt-2 text-3xl font-bold font-mono tabular-nums text-slate-900">
                {outgoingRequests.length}
              </p>
              <button
                type="button"
                onClick={() => onSelectSection("facility-outgoing")}
                className="mt-1 text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
              >
                Track Outgoing Requests →
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-medium text-slate-500">Authorized Facility Staff</p>
              <p className="mt-2 text-3xl font-bold font-mono tabular-nums text-slate-900">
                {myStaff.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Focal Contact: {activeFacility.contactPerson}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5">
              <h2 className="text-sm font-bold text-slate-900">
                Facility Profile &amp; Coordination Contacts
              </h2>
              <div className="mt-4 space-y-2.5 text-xs text-slate-700">
                <p>
                  <strong>Institution Name:</strong> {activeFacility.name}
                </p>
                <p>
                  <strong>Category:</strong> {activeFacility.facilityType}
                </p>
                <p>
                  <strong>Woreda / City:</strong> {activeFacility.woredaCity}
                </p>
                <p>
                  <strong>Primary Coordination Officer:</strong> {activeFacility.contactPerson}
                </p>
                <p className="font-mono">
                  <strong>Telephone:</strong> {activeFacility.contactPhone}
                </p>
                <p className="font-mono">
                  <strong>Email:</strong> {activeFacility.contactEmail}
                </p>
                <p>
                  <strong>On-Site Blood Service Unit:</strong>{" "}
                  {activeFacility.hasBloodService
                    ? "Yes — Qualified Blood Service Officer required for release"
                    : "No — Coordinates with Adama / Batu Blood Services"}
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5">
              <h2 className="text-sm font-bold text-slate-900">
                Recent Facility Request Activity
              </h2>
              <div className="mt-4 space-y-2.5 text-xs">
                {[...incomingRequests, ...outgoingRequests].slice(0, 4).map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="font-bold text-slate-900">
                        {req.id}: {req.resourceName} ({req.requestedQuantity} {req.unit})
                      </p>
                      <p className="text-slate-600 mt-0.5">
                        {req.requestingFacilityName} → {req.supplierFacilityName}
                      </p>
                    </div>
                    <span className="font-semibold text-emerald-800 whitespace-nowrap">
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 2. RESOURCE INVENTORY (FACILITY INVENTORY MANAGEMENT)             */}
      {/* ================================================================= */}
      {activeSection === "facility-inventory" && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex items-start justify-between gap-4">
            <div>
              <p className="font-bold">
                Reported Resource Information Notice (Not Guaranteed Physical Lock)
              </p>
              <p className="mt-0.5">
                Inventory figures recorded here inform verified East Shewa partner facilities of
                reported availability. Actual allocation only occurs when your facility explicitly
                confirms an incoming request.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? "Close Form" : "Add Resource Record"}</span>
            </button>
          </div>

          {showAddForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newResourceName.trim()) return;
                onAddInventoryRecord({
                  category: newCategory,
                  resourceName: newResourceName.trim(),
                  quantity: Math.max(0, newQty),
                  unit: newUnit.trim() || "Units",
                  availabilityStatus: newStatus,
                  requiresColdChain: newColdChain,
                  notes: newNotes.trim() || "Reported by facility inventory officer.",
                });
                setNewResourceName("");
                setNewNotes("");
                setShowAddForm(false);
              }}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
            >
              <h2 className="text-sm font-bold text-slate-900">
                Add New Resource Record for {activeFacility.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resource Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ResourceCategory)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="Blood Product">Blood Product</option>
                    <option value="Medical Oxygen">Medical Oxygen</option>
                    <option value="Essential Medication">Essential Medication</option>
                    <option value="Medical Equipment">Medical Equipment</option>
                    <option value="Emergency Transport">Emergency Transport</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resource Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newResourceName}
                    onChange={(e) => setNewResourceName(e.target.value)}
                    placeholder="e.g., Ringer's Lactate 1000mL IV Bags"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reported Quantity
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newQty}
                    onChange={(e) => setNewQty(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit of Measurement
                  </label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="Units / Cylinders / Boxes"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Availability Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as AvailabilityStatus)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="Available">Available</option>
                    <option value="Limited">Limited</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="Unknown">Unknown</option>
                    <option value="Update required">Update required</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newColdChain}
                      onChange={(e) => setNewColdChain(e.target.checked)}
                    />
                    <span>Requires Cold-Chain</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Handling / Storage Notes
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Optional storage or coordination notes..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg cursor-pointer"
              >
                Save Resource Report
              </button>
            </form>
          )}

          {/* Facility Inventory Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900">
                Reported Resource Inventory — {activeFacility.name}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
                    <th className="py-3 px-4">Resource Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Quantity &amp; Unit</th>
                    <th className="py-3 px-4">Availability Status</th>
                    <th className="py-3 px-4">Last Updated &amp; Staff</th>
                    <th className="py-3 px-4 text-right">Update Record</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {myInventory.map((item) => {
                    const isEditing = editingId === item.id;
                    return (
                      <tr key={item.id} className="align-top hover:bg-slate-50">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{item.resourceName}</p>
                          <p className="text-slate-500 mt-0.5">{item.notes}</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{item.category}</td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={editQty}
                              onChange={(e) =>
                                setEditQty(Math.max(0, parseInt(e.target.value) || 0))
                              }
                              className="w-20 px-2 py-1 text-right bg-white border border-slate-300 rounded"
                            />
                          ) : (
                            `${item.quantity} ${item.unit}`
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-semibold">
                          {isEditing ? (
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value as AvailabilityStatus)}
                              className="px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                            >
                              <option value="Available">Available</option>
                              <option value="Limited">Limited</option>
                              <option value="Unavailable">Unavailable</option>
                              <option value="Unknown">Unknown</option>
                              <option value="Update required">Update required</option>
                            </select>
                          ) : (
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
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-mono text-slate-700">{item.lastUpdated}</p>
                          <p className="text-slate-500">By {item.updatedByStaff}</p>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isEditing ? (
                            <div className="flex flex-col items-end gap-1.5">
                              <input
                                type="text"
                                value={editReason}
                                onChange={(e) => setEditReason(e.target.value)}
                                placeholder="Reason for update..."
                                className="px-2 py-1 text-xs bg-white border border-slate-300 rounded w-44"
                              />
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onUpdateInventoryRecord(
                                      item.id,
                                      editQty,
                                      editStatus,
                                      editReason || "Routine physical stock verification."
                                    );
                                    setEditingId(null);
                                  }}
                                  className="px-2.5 py-1 text-xs font-semibold bg-emerald-700 text-white rounded cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                  className="px-2 py-1 text-xs text-slate-600 bg-slate-100 rounded cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(item.id);
                                setEditQty(item.quantity);
                                setEditStatus(item.availabilityStatus);
                                setEditReason("");
                              }}
                              className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                            >
                              Edit Quantity / Status
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inventory Update History */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              <span>Inventory Update Audit Trail (`inventory_history`)</span>
            </h3>
            <div className="mt-3 space-y-2 text-xs">
              {inventoryHistory.map((h) => (
                <div
                  key={h.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {h.facilityName} · {h.resourceName}
                    </p>
                    <p className="text-slate-600 mt-0.5">
                      Qty: <span className="font-mono">{h.previousQty}</span> →{" "}
                      <span className="font-mono font-bold">{h.newQty}</span> ({h.previousStatus} →{" "}
                      {h.newStatus}) · Reason: {h.reason}
                    </p>
                  </div>
                  <div className="text-right font-mono text-slate-500">
                    <div>{h.timestamp}</div>
                    <div>By {h.updatedBy}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. RESOURCE DISCOVERY (NETWORK-WIDE SEARCH)                       */}
      {/* ================================================================= */}
      {activeSection === "facility-discovery" && (
        <div className="space-y-5">
          {/* Filters */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={discSearch}
                onChange={(e) => setDiscSearch(e.target.value)}
                placeholder="Search blood, oxygen, facility..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <select
              value={discCategory}
              onChange={(e) => setDiscCategory(e.target.value as "All" | ResourceCategory)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="All">All Resource Categories</option>
              <option value="Blood Product">Blood Product</option>
              <option value="Medical Oxygen">Medical Oxygen</option>
              <option value="Essential Medication">Essential Medication</option>
              <option value="Medical Equipment">Medical Equipment</option>
              <option value="Emergency Transport">Emergency Transport</option>
            </select>

            <select
              value={discLocation}
              onChange={(e) => setDiscLocation(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="All">All East Shewa Locations</option>
              <option value="Adama">Adama</option>
              <option value="Meki">Meki (Dugda)</option>
              <option value="Batu">Batu (Adami Tullu)</option>
              <option value="Olenchiti">Olenchiti (Boset)</option>
            </select>

            <select
              value={discFacilityId}
              onChange={(e) => setDiscFacilityId(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="All">All Verified Facilities</option>
              {allFacilities.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>

            <select
              value={discAvailability}
              onChange={(e) => setDiscAvailability(e.target.value as "All" | AvailabilityStatus)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="All">All Availability Statuses</option>
              <option value="Available">Available</option>
              <option value="Limited">Limited</option>
              <option value="Unavailable">Unavailable</option>
              <option value="Update required">Update required</option>
            </select>
          </div>

          {/* Discovery Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  East Shewa Network Resource Discovery
                </h2>
                <p className="text-xs text-slate-500">
                  Reported availability across participating institutions. Submitting a request
                  requires explicit confirmation by the supplying facility.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {discoveredResources.length} Matching Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
                    <th className="py-3 px-4">Supplying Facility &amp; Contact</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Resource &amp; Category</th>
                    <th className="py-3 px-4 text-right">Reported Qty</th>
                    <th className="py-3 px-4">Availability</th>
                    <th className="py-3 px-4">Freshness / Updated By</th>
                    <th className="py-3 px-4 text-right">Coordination Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {discoveredResources.map((item) => (
                    <tr key={item.id} className="align-top hover:bg-slate-50">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{item.facilityName}</p>
                        <p className="font-mono text-slate-500 mt-0.5 inline-flex items-center gap-1">
                          <PhoneCall className="w-3 h-3" />
                          {item.contactPhone}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{item.woredaCity}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{item.resourceName}</p>
                        <p className="text-slate-500 mt-0.5">{item.category}</p>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-3.5 px-4 font-semibold">
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
                      <td className="py-3.5 px-4">
                        <p className="font-mono text-slate-700">{item.lastUpdated}</p>
                        <p className="text-slate-500">By {item.updatedByStaff}</p>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {item.facilityId === activeFacility.id ? (
                          <span className="text-slate-400">Own Facility</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleInitiateRequestFromDiscovery(item)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md whitespace-nowrap cursor-pointer"
                          >
                            Initiate Resource Request
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
      {/* 4. INCOMING REQUESTS (SUPPLIER REVIEW & EXPLICIT CONFIRMATION)    */}
      {/* ================================================================= */}
      {activeSection === "facility-incoming" && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="text-base font-bold text-slate-900">
              Incoming Facility Requests Directed to {activeFacility.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Review physical stock and respond explicitly. Stock is only deducted when you click{" "}
              <strong>Confirm Full</strong> or <strong>Confirm Partial</strong>.
            </p>

            <div className="mt-5 space-y-4">
              {incomingRequests.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">
                  No incoming resource requests currently directed to {activeFacility.name}. Switch
                  perspective to <strong>Adama Hospital Medical College (Demo)</strong> above to
                  review Meki Health Center’s pending emergency blood request.
                </p>
              ) : (
                incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="border border-slate-200 rounded-xl p-5 bg-slate-50/60 space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 pb-3 border-b border-slate-200">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-mono font-bold text-slate-900">{req.id}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-red-700">
                            Urgency: {req.urgency}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-600">
                            From: <strong>{req.requestingFacilityName}</strong> (
                            {req.requestingOfficer}, {req.requestingPhone})
                          </span>
                        </div>
                        <h3 className="mt-1 text-base font-bold text-slate-900">
                          {req.resourceName} — Requested: {req.requestedQuantity} {req.unit}
                        </h3>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md">
                          Status: {req.status}
                        </span>
                      </div>
                    </div>

                    {req.isBloodCoordination && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-950">
                        <strong>Blood Service Safeguard:</strong> Compatibility cross-matching,
                        screening verification, and cold-chain transport readiness (+2°C to +6°C)
                        must be verified by a qualified Blood Service Officer prior to physical
                        release.
                      </div>
                    )}

                    <div className="text-xs text-slate-700 space-y-1">
                      <p>
                        <strong>Requesting Facility Context (Non-Identifiable):</strong>{" "}
                        {req.nonIdentifiableClinicalContext}
                      </p>
                      <p>
                        <strong>Supplier Response Note:</strong> {req.supplierResponseNote}
                      </p>
                    </div>

                    {/* Supplier Action Controls */}
                    {(req.status === "Awaiting Supplier" || req.status === "Submitted") && (
                      <div className="pt-3 border-t border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={supplierNoteInput[req.id] || ""}
                            onChange={(e) =>
                              setSupplierNoteInput((prev) => ({
                                ...prev,
                                [req.id]: e.target.value,
                              }))
                            }
                            placeholder="Enter supplier response / release instructions..."
                            className="flex-1 min-w-[220px] px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                          />
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-slate-600">Partial Qty:</span>
                            <input
                              type="number"
                              min={1}
                              max={req.requestedQuantity}
                              value={
                                partialQtyInput[req.id] ?? Math.max(1, req.requestedQuantity - 1)
                              }
                              onChange={(e) =>
                                setPartialQtyInput((prev) => ({
                                  ...prev,
                                  [req.id]: Math.max(1, parseInt(e.target.value) || 1),
                                }))
                              }
                              className="w-16 px-2 py-1.5 font-mono bg-white border border-slate-300 rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onSupplierRespondToRequest(
                                req.id,
                                "Confirmed",
                                req.requestedQuantity,
                                supplierNoteInput[req.id] ||
                                  `Full quantity (${req.requestedQuantity} ${req.unit}) confirmed by ${activeFacility.name}. Ready for logistics pickup.`
                              )
                            }
                            className="px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg cursor-pointer"
                          >
                            Confirm Full ({req.requestedQuantity} {req.unit})
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const partQty =
                                partialQtyInput[req.id] ?? Math.max(1, req.requestedQuantity - 1);
                              onSupplierRespondToRequest(
                                req.id,
                                "Partially Confirmed",
                                partQty,
                                supplierNoteInput[req.id] ||
                                  `Partially confirmed ${partQty} of ${req.requestedQuantity} ${req.unit} to preserve local inpatient safety reserve.`
                              );
                            }}
                            className="px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-lg cursor-pointer"
                          >
                            Confirm Partial
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              onSupplierRespondToRequest(
                                req.id,
                                "Clarification",
                                null,
                                supplierNoteInput[req.id] ||
                                  "Supplier requested additional cold-chain courier or cross-match sample details."
                              )
                            }
                            className="px-3 py-1.5 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg cursor-pointer"
                          >
                            Request Clarification
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              onSupplierRespondToRequest(
                                req.id,
                                "Declined",
                                0,
                                supplierNoteInput[req.id] ||
                                  "Unable to fulfill due to current inpatient emergency surgical demand."
                              )
                            }
                            className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 5. OUTGOING REQUESTS (CREATE & TRACK FACILITY REQUESTS)           */}
      {/* ================================================================= */}
      {activeSection === "facility-outgoing" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Create Request Form (5 Cols) */}
          <form
            onSubmit={handleCreateRequestSubmit}
            className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4"
          >
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Submit Outgoing Facility Resource Request
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Requesting Institution: <strong>{activeFacility.name}</strong>. Submitting a request
                does NOT automatically deduct supplier stock.
              </p>
            </div>

            {reqFormError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900">
                {reqFormError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Potential Supplier Facility *
              </label>
              <select
                value={reqSupplierId}
                onChange={(e) => setReqSupplierId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              >
                {allFacilities
                  .filter((f) => f.id !== activeFacility.id)
                  .map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.woredaCity})
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resource Category *
                </label>
                <select
                  value={reqCategory}
                  onChange={(e) => setReqCategory(e.target.value as ResourceCategory)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="Blood Product">Blood Product</option>
                  <option value="Medical Oxygen">Medical Oxygen</option>
                  <option value="Essential Medication">Essential Medication</option>
                  <option value="Medical Equipment">Medical Equipment</option>
                  <option value="Emergency Transport">Emergency Transport</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Urgency *</label>
                <select
                  value={reqUrgency}
                  onChange={(e) =>
                    setReqUrgency(e.target.value as "Standard" | "Urgent" | "Emergency")
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="Emergency">Emergency</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Standard">Standard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Requested Resource Name *
              </label>
              <input
                type="text"
                required
                value={reqResourceName}
                onChange={(e) => setReqResourceName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Requested Quantity *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={reqQty}
                  onChange={(e) => setReqQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Unit *</label>
                <input
                  type="text"
                  required
                  value={reqUnit}
                  onChange={(e) => setReqUnit(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Specialized Blood Resource Coordination Safeguard */}
            {reqCategory === "Blood Product" && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg space-y-2 text-xs text-red-950">
                <p className="font-bold">Mandatory Blood Resource Coordination Safeguard</p>
                <p className="leading-relaxed">
                  Blood type listing alone does not establish compatibility. Qualified blood service
                  professionals must perform compatibility cross-matching, screening, release
                  authorization, and cold-chain validation. Do not enter patient names or PII.
                </p>
                <label className="flex items-start gap-2 font-semibold cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={reqBloodAck}
                    onChange={(e) => setReqBloodAck(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    I acknowledge that this request initiates blood bank coordination only and is
                    not a clinical compatibility or release authorization.
                  </span>
                </label>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Non-Identifiable Coordination Notes (No Patient PII)
              </label>
              <textarea
                rows={2}
                value={reqContext}
                onChange={(e) => setReqContext(e.target.value)}
                placeholder="e.g., Obstetric theatre emergency replenishment (Case Ref #MK-12)..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer"
            >
              Submit Formal Request to Supplier
            </button>
          </form>

          {/* Outgoing Requests Lifecycle & History (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h2 className="text-base font-bold text-slate-900">
                Outgoing Requests &amp; Status History — {activeFacility.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Track supplier responses, logistics status, and acknowledge physical delivery.
              </p>

              <div className="mt-4 space-y-4">
                {outgoingRequests.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    No outgoing requests from {activeFacility.name}. Switch perspective to{" "}
                    <strong>Meki Health Center (Demo)</strong> or submit a new request on the left.
                  </p>
                ) : (
                  outgoingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {req.id}
                          </span>
                          <span className="mx-1.5 text-slate-400">·</span>
                          <span className="text-xs text-slate-600">
                            To: <strong>{req.supplierFacilityName}</strong>
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                            {req.resourceName} (Requested: {req.requestedQuantity} {req.unit} ·
                            Confirmed:{" "}
                            {req.confirmedQuantity !== null
                              ? `${req.confirmedQuantity} ${req.unit}`
                              : "Awaiting Supplier"}
                            )
                          </h3>
                        </div>
                        <span className="text-xs font-bold text-emerald-800 bg-white border border-slate-200 px-2.5 py-1 rounded">
                          {req.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">
                        <strong>Supplier Response:</strong> {req.supplierResponseNote}
                      </p>

                      {/* Chronological Request Status History */}
                      <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1.5 text-[11px]">
                        <p className="font-bold text-slate-700">Status History Trail:</p>
                        {req.statusHistory.map((ev, idx) => (
                          <div key={idx} className="text-slate-600 flex items-start gap-2">
                            <span className="font-mono text-slate-400 shrink-0">
                              [{ev.timestamp}]
                            </span>
                            <span>
                              <strong>{ev.status}</strong> ({ev.actorName}): {ev.note}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Requesting Facility Actions */}
                      <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                        {req.status === "Delivered" && (
                          <button
                            type="button"
                            onClick={() =>
                              onRequesterAction(
                                req.id,
                                "AcknowledgeReceipt",
                                `Receiving officer at ${activeFacility.name} verified physical delivery and condition.`
                              )
                            }
                            className="px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white rounded-md cursor-pointer"
                          >
                            Acknowledge Physical Receipt (`Received`)
                          </button>
                        )}

                        {req.status === "Awaiting Supplier" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                onRequesterAction(
                                  req.id,
                                  "Escalate",
                                  `Escalated to Regional Coordination Authority by ${activeFacility.name} due to urgent clinical shortage.`
                                )
                              }
                              className="px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-md cursor-pointer"
                            >
                              Escalate to Regional Authority
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onRequesterAction(
                                  req.id,
                                  "Cancel",
                                  `Cancelled by requesting facility (${activeFacility.name}).`
                                )
                              }
                              className="px-3 py-1.5 text-xs font-medium bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md cursor-pointer"
                            >
                              Cancel Request
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 6. STAFF MANAGEMENT                                               */}
      {/* ================================================================= */}
      {activeSection === "facility-staff" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!staffName.trim() || !staffEmail.trim()) return;
              onInviteStaff({
                fullName: staffName.trim(),
                email: staffEmail.trim(),
                phone: staffPhone.trim() || "+251 911 000 000",
                role: staffRole,
              });
              setStaffName("");
              setStaffEmail("");
              setStaffPhone("");
            }}
            className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4"
          >
            <h2 className="text-base font-bold text-slate-900">
              Invite Institutional Staff — {activeFacility.name}
            </h2>
            <p className="text-xs text-slate-500">
              Assign facility-scoped roles so staff only modify records they are authorized to
              manage.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Staff Full Name *
              </label>
              <input
                type="text"
                required
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="e.g., Sr. Marta Tadesse"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email *
              </label>
              <input
                type="email"
                required
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
                placeholder="marta@facility.org.et"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telephone</label>
              <input
                type="tel"
                value={staffPhone}
                onChange={(e) => setStaffPhone(e.target.value)}
                placeholder="+251 911 ..."
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Role *
              </label>
              <select
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="Facility administrator">Facility administrator</option>
                <option value="Inventory officer">Inventory officer</option>
                <option value="Request officer">Request officer</option>
                <option value="Medical/blood service officer">Medical/blood service officer</option>
                <option value="Logistics coordinator">Logistics coordinator</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              Invite Staff Member
            </button>
          </form>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900">
                Authorized Staff Roster — {activeFacility.name}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {myStaff.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-900">{s.fullName}</td>
                      <td className="py-3 px-4 text-emerald-800 font-medium">{s.role}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {s.email} · {s.phone}
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-700">{s.status}</td>
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
