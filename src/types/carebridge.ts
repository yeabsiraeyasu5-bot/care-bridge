export type PublicPageId =
  | "home"
  | "about"
  | "mission"
  | "how-it-works"
  | "network"
  | "impact"
  | "drone-logistics"
  | "partnerships"
  | "contact";

export type EnvironmentMode = "public" | "login" | "portal";

export type PortalWorkspaceId =
  | "authority-overview"
  | "authority-verification"
  | "authority-monitoring"
  | "authority-analytics"
  | "authority-rbac-audit"
  | "facility-overview"
  | "facility-inventory"
  | "facility-discovery"
  | "facility-incoming"
  | "facility-outgoing"
  | "facility-staff"
  | "logistics-tracking"
  | "logistics-uav"
  | "low-connectivity-sms"
  | "admin-assistant"
  | "architecture-schema";

export type InstitutionVerificationStatus =
  | "Pending"
  | "Under Review"
  | "Verified"
  | "Suspended"
  | "Rejected";

export type FacilityType =
  | "Referral Hospital"
  | "Primary Hospital"
  | "Health Center"
  | "Blood Service Center"
  | "Logistics Provider";

export type UserRole =
  | "Regional authority administrator"
  | "Facility administrator"
  | "Inventory officer"
  | "Request officer"
  | "Medical/blood service officer"
  | "Logistics coordinator"
  | "Technical system administrator";

export type ResourceCategory =
  | "Blood Product"
  | "Medical Oxygen"
  | "Essential Medication"
  | "Medical Equipment"
  | "Emergency Transport";

export type AvailabilityStatus =
  | "Available"
  | "Limited"
  | "Unavailable"
  | "Unknown"
  | "Update required";

export type RequestStatus =
  | "Draft"
  | "Submitted"
  | "Matching"
  | "Awaiting Supplier"
  | "Confirmed"
  | "Partially Confirmed"
  | "Logistics Pending"
  | "In Transit"
  | "Delivered"
  | "Received"
  | "Declined"
  | "Cancelled"
  | "Escalated";

export interface Facility {
  id: string;
  name: string;
  facilityType: FacilityType;
  woredaCity: string;
  verificationStatus: InstitutionVerificationStatus;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  hasBloodService: boolean;
  lastInventorySync: string;
  freshnessStatus: "Current" | "Stale (>24h)" | "Update required";
  isDemoExample: boolean;
}

export interface FacilityApplication {
  id: string;
  institutionName: string;
  facilityType: FacilityType;
  woredaCity: string;
  licenseReference: string;
  applicantName: string;
  applicantRole: string;
  contactPhone: string;
  contactEmail: string;
  status: InstitutionVerificationStatus;
  submittedAt: string;
  notes: string;
  reviewedBy?: string;
}

export interface StaffMember {
  id: string;
  facilityId: string;
  facilityName: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: "Active" | "Invited" | "Suspended";
  lastActive: string;
}

export interface DemoUserAccount {
  id: string;
  fullName: string;
  role: UserRole;
  facilityId: string;
  facilityName: string;
  email: string;
  defaultWorkspace: PortalWorkspaceId;
  permissionsSummary: string;
}

export interface InventoryRecord {
  id: string;
  facilityId: string;
  facilityName: string;
  woredaCity: string;
  category: ResourceCategory;
  resourceName: string;
  quantity: number;
  unit: string;
  availabilityStatus: AvailabilityStatus;
  lastUpdated: string;
  updatedByStaff: string;
  requiresColdChain: boolean;
  contactPhone: string;
  notes: string;
}

export interface InventoryHistoryEntry {
  id: string;
  inventoryId: string;
  facilityName: string;
  resourceName: string;
  previousQty: number;
  newQty: number;
  previousStatus: AvailabilityStatus;
  newStatus: AvailabilityStatus;
  updatedBy: string;
  timestamp: string;
  reason: string;
}

export interface RequestStatusEvent {
  status: RequestStatus;
  actorName: string;
  actorFacility: string;
  timestamp: string;
  note: string;
}

export interface SupplyRequest {
  id: string;
  requestingFacilityId: string;
  requestingFacilityName: string;
  requestingOfficer: string;
  requestingPhone: string;
  supplierFacilityId: string;
  supplierFacilityName: string;
  category: ResourceCategory;
  resourceName: string;
  requestedQuantity: number;
  confirmedQuantity: number | null;
  unit: string;
  urgency: "Standard" | "Urgent" | "Emergency";
  status: RequestStatus;
  isBloodCoordination: boolean;
  bloodCompatibilityAcknowledged: boolean;
  nonIdentifiableClinicalContext: string;
  supplierResponseNote: string;
  respondedByStaff?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: RequestStatusEvent[];
}

export interface DispatchRecord {
  id: string;
  requestId: string;
  requestingFacilityName: string;
  supplyingFacilityName: string;
  resourceSummary: string;
  transportMethod:
    | "Facility Ground Vehicle"
    | "Authorized Ambulance"
    | "Cold-Chain Medical Courier"
    | "Pending Assignment";
  responsibleCoordinator: string;
  coordinatorPhone: string;
  deliveryStatus:
    | "Logistics Pending"
    | "In Transit"
    | "Delivered"
    | "Handover Confirmed";
  expectedDeliveryWindow: string;
  handoverAcknowledgedBy?: string;
  handoverTimestamp?: string;
  coldChainVerified: boolean;
}

export interface UAVAssessmentRecord {
  id: string;
  requestId: string;
  cargoDescription: string;
  weightKg: number;
  originFacility: string;
  destinationFacility: string;
  distanceKm: number;
  cargoEligible: boolean;
  handlingReviewed: boolean;
  operatorAvailable: boolean;
  routeAssessed: boolean;
  weatherReviewed: boolean;
  regulatoryAuthorized: boolean;
  overallFeasibility:
    | "Potentially Eligible for Future Pilot (Pending ECAA Permit)"
    | "Ineligible — Requires Pressurized/Heavy Ground Transport"
    | "Requires Blood Bank Active Thermal Validation";
  assessorNotes: string;
}

export interface PlatformNotification {
  id: string;
  targetScope: "Authority" | "Facility" | "All";
  targetFacilityId?: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "urgent";
  timestamp: string;
  read: boolean;
}

export interface AuditLogEntry {
  id: string;
  actorName: string;
  actorRole: UserRole;
  actorFacility: string;
  actionType:
    | "INVENTORY_UPDATE"
    | "REQUEST_SUBMITTED"
    | "SUPPLIER_RESPONSE"
    | "LOGISTICS_UPDATE"
    | "RECEIPT_ACKNOWLEDGED"
    | "FACILITY_VERIFICATION"
    | "ROLE_PERMISSION"
    | "ESCALATION";
  entityReference: string;
  summary: string;
  timestamp: string;
}

export interface SmsSimulationMessage {
  id: string;
  sender: "facility_user" | "gateway_sim";
  text: string;
  timestamp: string;
  tag?: string;
}
