/**
 * CareBridge Ethiopia — PostgreSQL / Supabase Production Schema & Administrative Assistant Service
 *
 * This module defines the relational schema blueprint, Row-Level Security (RLS) policy specifications,
 * and the non-clinical administrative coordination assistant fallback logic.
 */

export interface DatabaseTableBlueprint {
  tableName: string;
  purpose: string;
  primaryKey: string;
  foreignKeys: string[];
  keyColumns: string[];
  rlsPolicySummary: string;
}

export const CAREBRIDGE_DATABASE_SCHEMA: DatabaseTableBlueprint[] = [
  {
    tableName: "facilities",
    purpose: "Stores verified healthcare institutions, blood service centers, and authorized logistics nodes.",
    primaryKey: "id (uuid)",
    foreignKeys: [],
    keyColumns: ["name", "facility_type", "woreda_city", "verification_status", "has_blood_service", "last_inventory_sync"],
    rlsPolicySummary: "Readable by authenticated verified network members; INSERT/UPDATE restricted to Regional Authority Administrators via server-side RPC.",
  },
  {
    tableName: "facility_applications",
    purpose: "Tracks controlled institutional onboarding applications prior to authority verification.",
    primaryKey: "id (uuid)",
    foreignKeys: ["reviewed_by -> users.id"],
    keyColumns: ["institution_name", "license_reference", "applicant_email", "status", "submitted_at"],
    rlsPolicySummary: "Public INSERT allowed for onboarding inquiry; SELECT/UPDATE restricted strictly to Regional Authority Administrators.",
  },
  {
    tableName: "users",
    purpose: "Authenticated institutional staff profiles linked to Supabase Auth (auth.users).",
    primaryKey: "id (uuid, references auth.users)",
    foreignKeys: [],
    keyColumns: ["full_name", "email", "phone", "account_status"],
    rlsPolicySummary: "Users can view their own profile and verified network contacts; modifications require self or Facility/Authority Admin role.",
  },
  {
    tableName: "facility_memberships",
    purpose: "Binds users to a specific facility and enforces Role-Based Access Control (RBAC).",
    primaryKey: "id (uuid)",
    foreignKeys: ["user_id -> users.id", "facility_id -> facilities.id"],
    keyColumns: ["role", "status", "granted_by", "created_at"],
    rlsPolicySummary: "Enforces that a user can only modify inventory or respond to requests for their own assigned facility_id and permitted role.",
  },
  {
    tableName: "resource_categories",
    purpose: "Standardized taxonomy (Blood Product, Medical Oxygen, Essential Medication, Medical Equipment, Emergency Transport).",
    primaryKey: "id (text)",
    foreignKeys: [],
    keyColumns: ["label", "requires_cold_chain_check", "requires_blood_officer_signoff"],
    rlsPolicySummary: "Read-only reference table for all authenticated users; managed by Technical System Administrators.",
  },
  {
    tableName: "inventory_items",
    purpose: "Reported institutional resource availability (explicitly distinguished from guaranteed physical stock).",
    primaryKey: "id (uuid)",
    foreignKeys: ["facility_id -> facilities.id", "category_id -> resource_categories.id", "updated_by -> users.id"],
    keyColumns: ["resource_name", "quantity", "unit", "availability_status", "last_updated"],
    rlsPolicySummary: "SELECT allowed for all verified facilities (Resource Discovery); INSERT/UPDATE restricted to Inventory Officers & Facility Admins of that specific facility_id.",
  },
  {
    tableName: "inventory_history",
    purpose: "Immutable audit trail of every quantity or availability status update on inventory_items.",
    primaryKey: "id (uuid)",
    foreignKeys: ["inventory_id -> inventory_items.id", "updated_by -> users.id"],
    keyColumns: ["previous_qty", "new_qty", "previous_status", "new_status", "reason", "created_at"],
    rlsPolicySummary: "Append-only via database trigger on inventory_items; readable by the owning facility and Regional Coordination Authority.",
  },
  {
    tableName: "supply_requests",
    purpose: "Facility-to-facility resource coordination requests. Never deducts stock automatically on creation.",
    primaryKey: "id (uuid)",
    foreignKeys: ["requesting_facility_id -> facilities.id", "supplier_facility_id -> facilities.id", "created_by -> users.id"],
    keyColumns: ["resource_name", "requested_quantity", "confirmed_quantity", "status", "urgency", "is_blood_coordination"],
    rlsPolicySummary: "SELECT/UPDATE allowed for requesting facility, target supplier facility, assigned logistics coordinator, and Regional Authority.",
  },
  {
    tableName: "request_responses",
    purpose: "Records explicit supplier reviews (Confirm Full, Confirm Partial, Request Clarification, Decline).",
    primaryKey: "id (uuid)",
    foreignKeys: ["request_id -> supply_requests.id", "responder_id -> users.id"],
    keyColumns: ["decision", "confirmed_quantity", "response_note", "responded_at"],
    rlsPolicySummary: "INSERT restricted to authorized staff (Facility Admin, Inventory Officer, Blood Service Officer) belonging to supplier_facility_id.",
  },
  {
    tableName: "request_status_history",
    purpose: "Chronological state transition log from Submitted -> Awaiting Supplier -> Confirmed -> In Transit -> Delivered -> Received.",
    primaryKey: "id (uuid)",
    foreignKeys: ["request_id -> supply_requests.id", "actor_id -> users.id"],
    keyColumns: ["status", "note", "created_at"],
    rlsPolicySummary: "Append-only log readable by request participants and Regional Coordination Authority.",
  },
  {
    tableName: "dispatch_records",
    purpose: "Tracks ground transport, ambulance coordination, and handover progress for supplier-confirmed requests.",
    primaryKey: "id (uuid)",
    foreignKeys: ["request_id -> supply_requests.id", "coordinator_id -> users.id"],
    keyColumns: ["transport_method", "delivery_status", "expected_delivery_window", "cold_chain_verified"],
    rlsPolicySummary: "Managed by Logistics Coordinators and participating facilities.",
  },
  {
    tableName: "delivery_acknowledgments",
    purpose: "Records final physical receipt verification by the requesting facility.",
    primaryKey: "id (uuid)",
    foreignKeys: ["dispatch_id -> dispatch_records.id", "acknowledged_by -> users.id"],
    keyColumns: ["received_quantity", "condition_verified", "acknowledged_at", "notes"],
    rlsPolicySummary: "INSERT restricted strictly to authorized staff of requesting_facility_id.",
  },
  {
    tableName: "notifications",
    purpose: "In-app and future SMS gateway alerts for incoming requests, stale inventory, and escalations.",
    primaryKey: "id (uuid)",
    foreignKeys: ["target_facility_id -> facilities.id"],
    keyColumns: ["title", "message", "severity", "read", "created_at"],
    rlsPolicySummary: "Users read notifications scoped to their facility_id or Regional Authority role.",
  },
  {
    tableName: "audit_logs",
    purpose: "Tamper-evident governance log of all administrative, verification, inventory, and request actions.",
    primaryKey: "id (uuid)",
    foreignKeys: ["actor_id -> users.id"],
    keyColumns: ["action_type", "entity_reference", "summary", "created_at"],
    rlsPolicySummary: "Append-only via server-side/database triggers; SELECT restricted to Regional Authority and Technical System Administrators.",
  },
];

export interface AssistantResponsePayload {
  topic: string;
  answer: string;
  workflowSteps: string[];
  limitationNotice: string;
  source: "Server Gemini Assistant" | "Demonstration Administrative Guide";
}

export function getLocalAdministrativeAssistantResponse(query: string): AssistantResponsePayload {
  const lower = query.toLowerCase();

  // Safety boundary if user asks a clinical / treatment question
  if (
    lower.includes("dose") ||
    lower.includes("dosage") ||
    lower.includes("treat") ||
    lower.includes("diagnos") ||
    lower.includes("symptom") ||
    lower.includes("bleeding") ||
    lower.includes("patient") ||
    lower.includes("mg/kg") ||
    lower.includes("oxytocin") ||
    lower.includes("prescribe")
  ) {
    return {
      topic: "Clinical Boundary Notice — Non-Clinical Coordination Assistant",
      answer:
        "CareBridge Ethiopia does not provide clinical diagnoses, treatment instructions, medication dosages, or patient triage decisions. All clinical care and blood transfusion decisions must be performed by qualified healthcare professionals following national clinical guidelines.",
      workflowSteps: [
        "Use 'Resource Discovery' in the Institutional Workspace to locate reported blood, oxygen, or medication availability across East Shewa.",
        "Submit a non-identifiable 'Outgoing Request' to a potential supplier facility.",
        "For blood products, contact the supplying Blood Service Officer directly to coordinate cross-matching, screening, and cold-chain release.",
      ],
      limitationNotice:
        "Strict Safety Rule: AI components in CareBridge are restricted to administrative navigation and non-identifiable workflow summaries.",
      source: "Demonstration Administrative Guide",
    };
  }

  if (lower.includes("blood") || lower.includes("cross-match") || lower.includes("compatibility")) {
    return {
      topic: "Blood Resource Coordination Workflow & Safeguards",
      answer:
        "CareBridge assists authorized facilities in discovering reported blood unit counts and contacting regional blood bank officers. However, blood type listing alone never establishes clinical compatibility or authorizes release.",
      workflowSteps: [
        "1. Discover reported blood availability in 'Resource Discovery' (e.g., Adama HMC or Adama Regional Blood Bank).",
        "2. Submit a formal Blood Coordination Request without including any patient-identifiable information (PII).",
        "3. The supplying Medical/Blood Service Officer reviews physical inventory, compatibility/cross-match requirements, and cold-chain transport readiness.",
        "4. Only after explicit blood officer confirmation does logistics coordination begin.",
      ],
      limitationNotice:
        "Reported inventory is informational only. Qualified blood service professionals must authorize compatibility, screening, and cold-chain release.",
      source: "Demonstration Administrative Guide",
    };
  }

  if (lower.includes("drone") || lower.includes("uav") || lower.includes("quadcopter")) {
    return {
      topic: "Future UAV / Drone Feasibility Assessment Scope",
      answer:
        "Drone delivery in CareBridge is modeled strictly as a future feasibility assessment tool—not an active operational flight system. Heavy or pressurized items (such as 40L oxygen cylinders) and patient transport are ineligible.",
      workflowSteps: [
        "1. Open 'UAV Feasibility Assessment' under the Logistics Workspace.",
        "2. Review the 6 mandatory readiness criteria: payload weight, clinical handling review, approved operator availability, corridor route/landing pad, weather conditions, and ECAA regulatory authorization.",
        "3. Use ground vehicles or authorized ambulances for all current East Shewa inter-facility dispatches.",
      ],
      limitationNotice:
        "Simulated assessment only. UAV medical delivery requires Ethiopian Civil Aviation Authority (ECAA) and health authority permits.",
      source: "Demonstration Administrative Guide",
    };
  }

  return {
    topic: "CareBridge Facility-to-Facility Request & Confirmation Workflow",
    answer:
      "CareBridge operates on a 'Centralized Oversight, Decentralized Response' model. Requesting facilities submit requests directly to potential supplier facilities without automatic stock deduction, while the Regional Coordination Authority monitors network health and intervenes on escalations.",
    workflowSteps: [
      "1. Requesting Officer searches 'Resource Discovery' and submits a request ('Submitted' -> 'Awaiting Supplier').",
      "2. Supplier Facility reviews actual physical stock in 'Incoming Requests' and explicitly chooses 'Confirm Full', 'Confirm Partial', or 'Decline'.",
      "3. Upon confirmation, the Logistics Coordinator schedules transport ('Logistics Pending' -> 'In Transit' -> 'Delivered').",
      "4. The receiving facility verifies physical handover and marks the request 'Received'.",
    ],
    limitationNotice:
      "Demonstration Mode: Data shown in this prototype represents simulated East Shewa coordination workflows.",
    source: "Demonstration Administrative Guide",
  };
}
