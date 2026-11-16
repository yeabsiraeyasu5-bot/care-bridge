import React, { useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Truck,
  AlertCircle,
  MapPin,
  Search,
  Clock,
  Lock,
  FileCheck2,
} from "lucide-react";
import type {
  PublicPageId,
  Facility,
  FacilityApplication,
  FacilityType,
  SupplyRequest,
} from "../../types/carebridge";
import { PublicHeader } from "../../components/layout/PublicHeader";

interface PublicWebsiteProps {
  activePage: PublicPageId;
  onNavigatePage: (page: PublicPageId) => void;
  onOpenPortalLogin: () => void;
  facilities: Facility[];
  requests: SupplyRequest[];
  onSubmitOnboardingApplication: (
    app: Omit<FacilityApplication, "id" | "status" | "submittedAt">
  ) => void;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({
  activePage,
  onNavigatePage,
  onOpenPortalLogin,
  facilities,
  requests,
  onSubmitOnboardingApplication,
}) => {
  // Partnership / Institutional Onboarding Application Form state
  const [institutionName, setInstitutionName] = useState("");
  const [facilityType, setFacilityType] = useState<FacilityType>("Health Center");
  const [woredaCity, setWoredaCity] = useState("");
  const [licenseReference, setLicenseReference] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [applicantRole, setApplicantRole] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // Contact Inquiry Form state
  const [contactSender, setContactSender] = useState("");
  const [contactSenderEmail, setContactSenderEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("General Coordination Inquiry");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);

  const navigateAndScroll = (page: PublicPageId) => {
    onNavigatePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePartnershipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionName.trim() || !contactEmail.trim()) return;
    onSubmitOnboardingApplication({
      institutionName: institutionName.trim(),
      facilityType,
      woredaCity: woredaCity.trim() || "East Shewa Zone",
      licenseReference: licenseReference.trim() || "PENDING-DOC-VERIFICATION",
      applicantName: applicantName.trim(),
      applicantRole: applicantRole.trim() || "Institutional Representative",
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
      notes: notes.trim(),
    });
    setApplicationSubmitted(true);
    setInstitutionName("");
    setWoredaCity("");
    setLicenseReference("");
    setApplicantName("");
    setApplicantRole("");
    setContactPhone("");
    setContactEmail("");
    setNotes("");
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactSender.trim() || !contactSenderEmail.trim() || !contactMessage.trim()) return;
    setContactSent(true);
    setContactSender("");
    setContactSenderEmail("");
    setContactMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* Unified Single Public Header with Hamburger Drawer */}
      <PublicHeader
        activePage={activePage}
        onNavigatePage={onNavigatePage}
        onOpenPortalLogin={onOpenPortalLogin}
      />

      {/* Main Public Content */}
      <main className="flex-1 w-full">
        {/* =============================================================== */}
        {/* 1. HOME PAGE                                                    */}
        {/* =============================================================== */}
        {activePage === "home" && (
          <div>
            {/* SECTION 1: HERO SECTION */}
            <section className="bg-slate-50/70 border-b border-slate-200/80 py-12 sm:py-16 lg:py-20">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                {/* Left Column: Headline, Description & Primary CTAs */}
                <div className="lg:col-span-6 space-y-5">
                  <p className="text-xs font-semibold tracking-wider text-emerald-800">
                    REGIONAL HEALTHCARE COORDINATION · EAST SHEWA, ETHIOPIA
                  </p>

                  <h1
                    className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-slate-900 leading-[1.15]"
                    style={{ textWrap: "balance" }}
                  >
                    Connecting Healthcare. Strengthening Coordination.
                  </h1>

                  <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                    CareBridge Ethiopia is a digital coordination platform designed to connect
                    healthcare institutions, improve visibility of reported medical resources, and
                    support accountable inter-facility coordination across East Shewa.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigateAndScroll("how-it-works")}
                      className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Explore How It Works</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateAndScroll("partnerships")}
                      className="px-5 py-2.5 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Become a Partner
                    </button>
                  </div>

                  <div className="pt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>Initial Regional Scope: East Shewa Zone, Oromia</span>
                    <span aria-hidden="true">·</span>
                    <span>Adama · Meki · Batu · Mojo · Boset</span>
                  </div>
                </div>

                {/* Right Column: Clean Healthcare Network Coordination Diagram */}
                <div className="lg:col-span-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          East Shewa Regional Coordination Network
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Demonstration Topology · Facility-to-Facility Workflow
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-800 font-semibold">
                        Oversight + Peer Response
                      </span>
                    </div>

                    {/* Custom Clean Light-Mode SVG Network Illustration */}
                    <div className="my-4 bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                      <svg
                        viewBox="0 0 560 230"
                        className="w-full h-auto"
                        role="img"
                        aria-label="CareBridge Ethiopia East Shewa Healthcare Network Diagram"
                      >
                        {/* Subtle Grid Background Lines */}
                        <line x1="0" y1="55" x2="560" y2="55" stroke="#e2e8f0" strokeWidth="1" />
                        <line x1="0" y1="115" x2="560" y2="115" stroke="#e2e8f0" strokeWidth="1" />
                        <line x1="0" y1="175" x2="560" y2="175" stroke="#e2e8f0" strokeWidth="1" />

                        {/* Connection Lines between Facilities */}
                        <path
                          d="M 105 70 L 270 95 L 445 65"
                          stroke="#94a3b8"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="5 4"
                        />
                        <path
                          d="M 270 95 L 185 175 L 385 185"
                          stroke="#059669"
                          strokeWidth="2.5"
                          fill="none"
                        />
                        <path
                          d="M 270 95 L 385 185"
                          stroke="#0284c7"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="4 4"
                        />

                        {/* Node: Mojo Primary Hospital */}
                        <g transform="translate(105, 70)">
                          <circle r="9" fill="#ffffff" stroke="#475569" strokeWidth="2.5" />
                          <circle r="3.5" fill="#475569" />
                          <text
                            x="0"
                            y="-16"
                            textAnchor="middle"
                            fill="#334155"
                            fontSize="11"
                            fontWeight="600"
                          >
                            Mojo Hospital
                          </text>
                        </g>

                        {/* Central Hub: Adama Hospital Medical College & Blood Bank */}
                        <g transform="translate(270, 95)">
                          <circle r="16" fill="#ecfdf5" stroke="#047857" strokeWidth="2.5" />
                          <circle r="6" fill="#047857" />
                          <text
                            x="0"
                            y="-24"
                            textAnchor="middle"
                            fill="#0f172a"
                            fontSize="12"
                            fontWeight="700"
                          >
                            Adama HMC &amp; Blood Service
                          </text>
                          <text
                            x="0"
                            y="30"
                            textAnchor="middle"
                            fill="#047857"
                            fontSize="10"
                            fontWeight="600"
                          >
                            Referral &amp; Resource Hub
                          </text>
                        </g>

                        {/* Node: Boset / Olenchiti Health Center */}
                        <g transform="translate(445, 65)">
                          <circle r="9" fill="#ffffff" stroke="#475569" strokeWidth="2.5" />
                          <circle r="3.5" fill="#475569" />
                          <text
                            x="0"
                            y="-16"
                            textAnchor="middle"
                            fill="#334155"
                            fontSize="11"
                            fontWeight="600"
                          >
                            Boset Health Center
                          </text>
                        </g>

                        {/* Node: Meki Health Center */}
                        <g transform="translate(185, 175)">
                          <circle r="11" fill="#f0fdf4" stroke="#059669" strokeWidth="2.5" />
                          <circle r="4" fill="#059669" />
                          <text
                            x="0"
                            y="24"
                            textAnchor="middle"
                            fill="#0f172a"
                            fontSize="11"
                            fontWeight="600"
                          >
                            Meki Health Center
                          </text>
                        </g>

                        {/* Node: Batu Hospital */}
                        <g transform="translate(385, 185)">
                          <circle r="11" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2.5" />
                          <circle r="4" fill="#0284c7" />
                          <text
                            x="0"
                            y="24"
                            textAnchor="middle"
                            fill="#0f172a"
                            fontSize="11"
                            fontWeight="600"
                          >
                            Batu Hospital
                          </text>
                        </g>
                      </svg>
                    </div>

                    {/* Bottom Workflow Indicators inside Diagram Card */}
                    <div className="grid grid-cols-3 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                        <p className="font-bold text-slate-900">1. Reported Info</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Time-stamped facility updates
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                        <p className="font-bold text-slate-900">2. Explicit Review</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Supplier confirms availability
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                        <p className="font-bold text-slate-900">3. Safe Handover</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Tracked transport &amp; receipt
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: BRIEF INTRODUCTION TO CAREBRIDGE */}
            <section className="py-14 sm:py-16 border-b border-slate-200/80">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5">
                  <p className="text-xs font-semibold text-emerald-800">
                    What CareBridge Ethiopia Is
                  </p>
                  <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Practical Resource Coordination Built on Institutional Accountability
                  </h2>
                </div>
                <div className="lg:col-span-7 space-y-4 text-sm text-slate-600 leading-relaxed">
                  <p>
                    CareBridge Ethiopia is a regional coordination platform connecting verified
                    hospitals, primary health centers, blood service units, and authorized logistics
                    providers. Rather than operating as an unverified public directory or making
                    automated clinical decisions, CareBridge structures how participating
                    institutions share resource information and respond to urgent supply requests.
                  </p>
                  <p>
                    Our governance model balances <strong>Centralized Regional Oversight</strong>{" "}
                    with <strong>Decentralized Facility Response</strong>: the Regional Coordination
                    Authority verifies institutions and monitors network health, while healthcare
                    facilities communicate directly to review requests, confirm physical
                    availability, and coordinate transport without administrative bottlenecks.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 3: THE REGIONAL HEALTHCARE COORDINATION CHALLENGE */}
            <section className="py-14 sm:py-16 bg-slate-50/60 border-b border-slate-200/80">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-8">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold text-slate-500">
                    The Coordination Challenge
                  </p>
                  <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Why Inter-Facility Resource Coordination Needs Structure
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    When a health center or district hospital faces an acute shortage of blood
                    products, medical oxygen, or essential maternal supplies, informal phone calls
                    often lead to delays and uncertainty.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-4">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      Fragmented Resource Visibility
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      Clinics often lack a shared view of which nearby hospitals or blood banks
                      recently reported available supplies—or whether those reports are current or
                      outdated.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-4">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      Unconfirmed Referrals &amp; Transit Delays
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      Dispatching a vehicle or courier without explicit supplier confirmation and
                      blood bank cross-matching risks wasted travel time when stock is already
                      committed locally.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-4">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      Incomplete Handover Records
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      Verbal arrangements leave no clear audit trail of confirmed quantities,
                      cold-chain transport responsibilities, or final delivery acknowledgment by the
                      receiving facility.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: HOW CAREBRIDGE WORKS (4-STEP VISUAL EXPLANATION) */}
            <section className="py-14 sm:py-16 border-b border-slate-200/80">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="max-w-2xl">
                    <p className="text-xs font-semibold text-emerald-800">
                      Coordination Workflow
                    </p>
                    <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      How CareBridge Works in Four Steps
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Every request follows a clear, accountable path from discovery to confirmed
                      delivery.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateAndScroll("how-it-works")}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-700 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <span>View Complete 8-Step Process</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    {
                      step: "01",
                      title: "Discover Reported Resources",
                      desc: "Verified institutions publish time-stamped resource updates. Partner facilities search across East Shewa by category, location, and freshness.",
                    },
                    {
                      step: "02",
                      title: "Submit Formal Request",
                      desc: "A requesting facility submits a structured request directly to a potential supplier. Reported inventory is never deducted automatically.",
                    },
                    {
                      step: "03",
                      title: "Explicit Supplier Confirmation",
                      desc: "Authorized staff at the supplying facility check actual stock and explicitly confirm full quantity, partial quantity, or decline.",
                    },
                    {
                      step: "04",
                      title: "Coordinate Transport & Receipt",
                      desc: "Logistics teams coordinate ground or ambulance transport, and the receiving facility formally acknowledges physical delivery.",
                    },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="bg-slate-50/70 border border-slate-200 rounded-xl p-5 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-xs font-mono font-bold text-emerald-800">
                          STEP {item.step}
                        </span>
                        <h3 className="mt-2 text-base font-bold text-slate-900">{item.title}</h3>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 5: MAIN PLATFORM CAPABILITIES */}
            <section className="py-14 sm:py-16 bg-slate-50/60 border-b border-slate-200/80">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-8">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold text-emerald-800">Core Capabilities</p>
                  <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Designed for Operational Clarity Across Facilities
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">1. Resource Discovery</h3>
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                        Search reported blood products, medical oxygen cylinders, essential
                        medications, and transport capacity across participating facilities—complete
                        with last-updated timestamps and responsible officer contacts.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        2. Direct Facility-to-Facility Requests
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                        Initiate structured requests directly between institutions without waiting
                        for central bureaucracy on routine transfers, while enforcing mandatory
                        professional safeguards for blood resource coordination.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        3. Explicit Supplier Confirmation
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                        Protect local inpatient safety margins by empowering supplying facilities to
                        review requests, confirm full or partial quantities, request clarification,
                        or decline when stock is needed on site.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        4. Logistics &amp; Handover Coordination
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                        Track ground vehicles, authorized ambulances, and cold-chain couriers from
                        supplier release through transit to formal receiving facility acknowledgment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6: REGIONAL NETWORK OVERVIEW */}
            <section className="py-14 sm:py-16 border-b border-slate-200/80">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <p className="text-xs font-semibold text-emerald-800">
                    Initial Geographical Scope
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Focused on East Shewa Zone, Oromia
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    CareBridge focuses on a practical, high-need regional corridor connecting urban
                    referral hubs in Adama with district hospitals and woreda health centers across
                    Mojo, Boset, Meki, and Batu.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigateAndScroll("network")}
                      className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Explore Regional Network &amp; Demo Directory</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <MapPin className="w-4 h-4 text-emerald-700" />
                      <span>Referral &amp; Blood Services</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      Adama Hospital Medical College &amp; Regional Blood Bank demonstration nodes.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <MapPin className="w-4 h-4 text-emerald-700" />
                      <span>Primary &amp; District Hospitals</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      Batu Hospital and Mojo Primary Hospital demonstration coordination points.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <MapPin className="w-4 h-4 text-emerald-700" />
                      <span>Woreda Health Centers</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      Meki Health Center (Dugda) and Olenchiti Health Center (Boset) frontline
                      nodes.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Regional Oversight</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      Regional Coordination Authority verification, freshness monitoring, and audit
                      trail.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 7: INSTITUTIONAL PARTNERSHIP CALL TO ACTION */}
            <section className="py-14 sm:py-16 bg-slate-50/40">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xs">
                  <div className="max-w-2xl space-y-2">
                    <p className="text-xs font-semibold text-emerald-800">
                      Institutional Participation &amp; Demonstration Access
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Interested in Collaborating or Evaluating the CareBridge Platform?
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Hospitals, health centers, blood service units, health authorities, and
                      qualified logistics providers can submit an institutional onboarding inquiry
                      or explore the interactive demonstration portal.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => navigateAndScroll("partnerships")}
                      className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Become an Institutional Partner
                    </button>
                    <button
                      type="button"
                      onClick={onOpenPortalLogin}
                      className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Open Portal Login (Demo)
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =============================================================== */}
        {/* 2. ABOUT CAREBRIDGE PAGE                                        */}
        {/* =============================================================== */}
        {activePage === "about" && (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 space-y-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold text-emerald-800">About the Initiative</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-900 tracking-tight">
                About CareBridge Ethiopia
              </h1>
              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                CareBridge Ethiopia is a student-initiated healthcare resource coordination and
                logistics platform prototype developed to address practical communication and
                visibility gaps between healthcare institutions in East Shewa Zone, Oromia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h2 className="text-base font-bold text-slate-900">Background &amp; Origin</h2>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  The project began as an investigation into how regional hospitals and primary
                  health centers along the Adama–Mojo–Meki–Batu corridor communicate during urgent
                  shortages of blood products, medical oxygen cylinders, and maternal medications.
                </p>
                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  Rather than proposing unvalidated automated clinical triage or autonomous stock
                  deductions, CareBridge was architected around institutional accountability:
                  enabling authorized facility staff to share timely resource reports and coordinate
                  inter-facility transfers safely.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h2 className="text-base font-bold text-slate-900">
                  Transparency &amp; Prototype Status
                </h2>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  CareBridge Ethiopia is currently an engineering and operational workflow prototype.
                  All facility inventories, requests, and user profiles shown in the demonstration
                  environment represent realistic scenarios modeled on East Shewa geography, not
                  live clinical operations or official institutional endorsements.
                </p>
                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  Formal deployment requires institutional governance agreements with regional
                  health authorities, hospital boards, and national blood bank services.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* 3. VISION AND MISSION PAGE                                      */}
        {/* =============================================================== */}
        {activePage === "mission" && (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 space-y-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold text-emerald-800">Purpose &amp; Principles</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-900 tracking-tight">
                Vision, Mission &amp; Guiding Principles
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-7">
                <p className="text-xs font-mono font-bold text-emerald-800">LONG-TERM VISION</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  A connected regional healthcare ecosystem where no facility faces critical supply
                  isolation due to lack of timely coordination.
                </h2>
                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  Starting in East Shewa Zone, we envision a trusted inter-institutional network in
                  which hospitals, health centers, blood banks, and logistics teams collaborate
                  transparently to reduce preventable delays in resource mobilization.
                </p>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-7">
                <p className="text-xs font-mono font-bold text-emerald-900">PRACTICAL MISSION</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  To equip authorized healthcare staff with reliable tools for resource visibility,
                  explicit facility-to-facility request confirmation, and accountable transport
                  tracking.
                </h2>
                <p className="mt-3 text-xs text-slate-700 leading-relaxed">
                  We prioritize low-bandwidth usability, strict clinical safety boundaries, and
                  decentralized peer-to-peer facility cooperation backed by regional oversight.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-7">
              <h2 className="text-lg font-bold text-slate-900">
                Core Engineering &amp; Governance Principles
              </h2>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <h3 className="text-sm font-bold text-slate-900">01. Clinical Safety First</h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    CareBridge never replaces clinical judgment, never prescribes treatments, and
                    never authorizes blood release without qualified blood bank professionals.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <h3 className="text-sm font-bold text-slate-900">
                    02. Reported vs. Verified Stock Honesty
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Inventory counts are treated as time-stamped institutional reports that require
                    explicit supplier confirmation before dispatch.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <h3 className="text-sm font-bold text-slate-900">
                    03. Decentralized Speed, Centralized Oversight
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Facilities communicate directly to confirm requests rapidly, while the Regional
                    Coordination Authority monitors network performance and resolves escalations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* 4. HOW IT WORKS PAGE (8-STEP PROCESS DIAGRAM)                   */}
        {/* =============================================================== */}
        {activePage === "how-it-works" && (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 space-y-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold text-emerald-800">End-to-End Workflow</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-900 tracking-tight">
                How CareBridge Coordination Works
              </h1>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                CareBridge replaces ad-hoc phone trees and unsafe automatic reservations with a
                transparent 8-step institutional coordination lifecycle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  step: "01",
                  title: "Institutional Onboarding",
                  desc: "Healthcare institutions submit an application. The Regional Coordination Authority verifies credentials and activates institutional accounts.",
                  actor: "Institution & Regional Authority",
                },
                {
                  step: "02",
                  title: "Resource Reporting",
                  desc: "Verified facilities update their reported quantities and availability statuses (Available, Limited, Unavailable, Update required) with timestamps.",
                  actor: "Facility Inventory Officer",
                },
                {
                  step: "03",
                  title: "Network Resource Discovery",
                  desc: "Authorized staff search across participating East Shewa facilities by category, location, availability, and update freshness.",
                  actor: "Requesting Facility Staff",
                },
                {
                  step: "04",
                  title: "Formal Request Submission",
                  desc: "The requesting facility submits a structured request directly to a potential supplier. Stock is NOT automatically deducted on submission.",
                  actor: "Request Officer",
                },
                {
                  step: "05",
                  title: "Supplier Review",
                  desc: "The potential supplier receives the request in its Incoming Requests queue and checks actual physical stock and clinical/blood service constraints.",
                  actor: "Supplier Facility / Blood Officer",
                },
                {
                  step: "06",
                  title: "Explicit Supplier Decision",
                  desc: "The supplier explicitly Confirms Full quantity, Confirms Partial quantity, Requests Clarification, or Declines the request.",
                  actor: "Supplier Authorized Officer",
                },
                {
                  step: "07",
                  title: "Logistics Coordination",
                  desc: "Once confirmed, transport is scheduled (Facility Ground Vehicle, Authorized Ambulance, or Cold-Chain Courier) and tracked in transit.",
                  actor: "Logistics Coordinator",
                },
                {
                  step: "08",
                  title: "Delivery Acknowledgment",
                  desc: "Upon physical handover, the receiving facility verifies quantity and cold-chain condition and records formal receipt.",
                  actor: "Receiving Facility Officer",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-emerald-800 font-bold">
                      <span>STEP {item.step}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <h2 className="mt-2 text-base font-bold text-slate-900">{item.title}</h2>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-500">
                    Responsible: <span className="text-slate-800">{item.actor}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Test the Complete 8-Step Workflow in Demonstration Mode
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Sign in as Meki Health Center to submit a request, then switch to Adama Hospital
                  Medical College to review and confirm it.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenPortalLogin}
                className="px-4 py-2.5 text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Open Institutional Portal Login
              </button>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* 5. OUR NETWORK PAGE (EAST SHEWA REGIONAL COVERAGE)              */}
        {/* =============================================================== */}
        {activePage === "network" && (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-emerald-800">
                  Initial Geographical Scope · East Shewa Zone, Oromia
                </p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900 tracking-tight">
                  East Shewa Regional Coordination Network
                </h1>
              </div>
              <div className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2">
                <strong>Prototype Disclosure:</strong> Displayed facilities are demonstration
                examples modeling the East Shewa corridor.
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    East Shewa Highway Corridor Schematic (Demonstration Topology)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Illustrating inter-facility coordination nodes across Bishoftu, Mojo, Adama,
                    Boset, Meki, and Batu.
                  </p>
                </div>

                <div className="my-4 bg-white border border-slate-200 rounded-lg p-4">
                  <svg
                    viewBox="0 0 680 260"
                    className="w-full h-auto"
                    role="img"
                    aria-label="East Shewa Zone Regional Coordination Corridor Map"
                  >
                    <path
                      d="M 70 70 L 210 95 L 360 95 L 520 65"
                      stroke="#94a3b8"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="6 4"
                    />
                    <path
                      d="M 210 95 L 250 175 L 390 215"
                      stroke="#059669"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M 360 95 L 250 175"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                      fill="none"
                      strokeDasharray="4 4"
                    />

                    <circle cx="70" cy="70" r="8" fill="#64748b" />
                    <text x="35" y="48" fill="#334155" fontSize="11" fontFamily="monospace">
                      Bishoftu (Demo)
                    </text>

                    <circle cx="210" cy="95" r="9" fill="#d97706" />
                    <text x="165" y="75" fill="#92400e" fontSize="11" fontFamily="monospace">
                      Mojo Hosp (Review)
                    </text>

                    <circle cx="360" cy="95" r="13" fill="#047857" />
                    <text
                      x="295"
                      y="68"
                      fill="#0f172a"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      Adama HMC &amp; Blood Bank
                    </text>
                    <text x="310" y="122" fill="#047857" fontSize="10" fontFamily="monospace">
                      Referral &amp; Blood Hub
                    </text>

                    <circle cx="520" cy="65" r="9" fill="#ea580c" />
                    <text x="465" y="42" fill="#9a3412" fontSize="11" fontFamily="monospace">
                      Olenchiti / Boset HC
                    </text>

                    <circle cx="250" cy="175" r="10" fill="#0284c7" />
                    <text x="140" y="180" fill="#0369a1" fontSize="11" fontFamily="monospace">
                      Meki HC (Dugda)
                    </text>

                    <circle cx="390" cy="215" r="11" fill="#059669" />
                    <text x="345" y="242" fill="#065f46" fontSize="11" fontFamily="monospace">
                      Batu Hospital (Demo)
                    </text>
                  </svg>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span>Primary Route: Adama — Mojo — Meki — Batu</span>
                  <span>Eastern Branch: Adama — Olenchiti (Boset)</span>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Participating Institution Categories
                  </h2>
                  <div className="mt-4 space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="font-bold text-slate-900">
                        1. Referral &amp; Teaching Hospitals
                      </p>
                      <p className="text-slate-600 mt-0.5">
                        High-capacity facilities providing specialist care, surgical blood reserves,
                        and manifold oxygen storage.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="font-bold text-slate-900">2. Primary / District Hospitals</p>
                      <p className="text-slate-600 mt-0.5">
                        Woreda-level hospitals coordinating emergency obstetric, pediatric, and
                        trauma stabilization.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="font-bold text-slate-900">
                        3. Primary Health Centers &amp; Clinics
                      </p>
                      <p className="text-slate-600 mt-0.5">
                        Frontline facilities initiating urgent resource discovery and referral
                        transport requests.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="font-bold text-slate-900">
                        4. Regional Blood Bank Services &amp; Logistics Providers
                      </p>
                      <p className="text-slate-600 mt-0.5">
                        Specialized blood screening/release centers and authorized medical transport
                        operators.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Demonstration Network Directory ({facilities.length} Modeled Nodes)
                  </h2>
                  <p className="text-xs text-slate-500">
                    All institutions listed below are demonstration examples for prototype
                    evaluation.
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
                      <th className="py-3 px-5">Institution Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Woreda / City</th>
                      <th className="py-3 px-4">Blood Service Unit</th>
                      <th className="py-3 px-4">Verification Status</th>
                      <th className="py-3 px-5">Last Reported Sync</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {facilities.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-5 font-semibold text-slate-900">{f.name}</td>
                        <td className="py-3.5 px-4 text-slate-600">{f.facilityType}</td>
                        <td className="py-3.5 px-4 text-slate-600">{f.woredaCity}</td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {f.hasBloodService ? "Qualified Unit On-Site" : "Standard Referral Only"}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-emerald-700">
                          {f.verificationStatus} (Demo)
                        </td>
                        <td className="py-3.5 px-5 font-mono tabular-nums text-slate-500">
                          {f.lastInventorySync} · {f.freshnessStatus}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* 6. IMPACT AND REPORTS PAGE                                      */}
        {/* =============================================================== */}
        {activePage === "impact" && (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 space-y-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold text-emerald-800">
                Transparent Evaluation &amp; Reporting
              </p>
              <h1 className="mt-1 text-3xl font-bold text-slate-900 tracking-tight">
                Project Milestones, Demonstration Activity &amp; Evaluation Framework
              </h1>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                CareBridge Ethiopia strictly separates prototype simulation activity from real-world
                clinical outcomes. No unverified operational results or clinical impact claims are
                reported.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-medium text-slate-500">
                  Modeled Demo Institutions (East Shewa)
                </p>
                <p className="mt-2 text-3xl font-bold font-mono tabular-nums text-slate-900">
                  {facilities.length}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Simulated nodes across Adama, Meki, Batu &amp; Boset
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-medium text-slate-500">
                  Simulated Coordination Requests
                </p>
                <p className="mt-2 text-3xl font-bold font-mono tabular-nums text-slate-900">
                  {requests.length}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Active multi-step request workflows in demo state
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-medium text-slate-500">Database Entities Architected</p>
                <p className="mt-2 text-3xl font-bold font-mono tabular-nums text-emerald-800">
                  14 Tables
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  PostgreSQL + Row-Level Security schema blueprint
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-medium text-slate-500">Verified Clinical Field Trials</p>
                <p className="mt-2 text-3xl font-bold font-mono tabular-nums text-slate-700">
                  0 (Pre-Pilot)
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Awaiting formal institutional review &amp; pilot approval
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-base font-bold text-slate-900">
                  Engineering &amp; Architecture Milestones
                </h2>
                <ul className="mt-4 space-y-3 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Stage 1 (Completed):</strong> Initial concept prototype for East Shewa
                      emergency supply visibility and SMS shortcode simulation.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Stage 2 (Current Architecture):</strong> Full separation of Public
                      Website and Secure Institutional Platform; removal of autonomous stock
                      deductions and clinical AI diagnosis; implementation of explicit supplier
                      confirmation and blood coordination safeguards.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Stage 3 (Planned):</strong> Persistent Supabase PostgreSQL deployment,
                      institutional stakeholder consultations in East Shewa, and usability testing
                      with health center storekeepers.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-base font-bold text-slate-900">
                  Future Pilot Evaluation Metrics
                </h2>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  When evaluated in a supervised institutional pilot, CareBridge will measure
                  administrative coordination efficiency rather than making unverified clinical
                  claims:
                </p>
                <ul className="mt-3 space-y-2 text-xs text-slate-700">
                  <li>
                    · Time from request submission to explicit supplier response (target &lt; 20
                    minutes).
                  </li>
                  <li>
                    · Percentage of participating facilities updating resource reports within 24
                    hours.
                  </li>
                  <li>
                    · Reduction in unconfirmed inter-facility courier trips where stock was
                    unavailable upon arrival.
                  </li>
                  <li>
                    · Completeness of delivery handover acknowledgments and cold-chain logs.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* 7. DRONE LOGISTICS PAGE (FUTURE FEASIBILITY CAPABILITY)         */}
        {/* =============================================================== */}
        {activePage === "drone-logistics" && (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 space-y-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold text-amber-800">
                Future Capability Assessment · Not Operational
              </p>
              <h1 className="mt-1 text-3xl font-bold text-slate-900 tracking-tight">
                Future Role of Approved UAV Medical Supply Delivery
              </h1>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                CareBridge includes a simulated UAV Feasibility Assessment framework to study how
                approved Unmanned Aerial Vehicles (UAVs) could eventually complement ground
                transport for lightweight, time-critical medical supplies in rural East Shewa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-base font-bold text-slate-900">Potential Future Purpose</h2>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  During seasonal road disruptions or acute emergencies in remote kebeles, approved
                  medical UAVs could potentially transport lightweight, high-urgency items such as
                  oxytocin ampoules, antivenom vials, or diagnostic samples faster than surface
                  roads.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-base font-bold text-slate-900">
                  Strict Technical &amp; Clinical Limitations
                </h2>
                <ul className="mt-2 space-y-2 text-xs text-slate-600 leading-relaxed">
                  <li>
                    · <strong>No Heavy or Pressurized Cargo:</strong> 40L medical oxygen cylinders
                    (~55 kg pressurized steel tanks) cannot be transported by medical UAVs.
                  </li>
                  <li>
                    · <strong>Blood Product Constraints:</strong> Whole blood and packed RBCs
                    require validated active cold-chain (+2°C to +6°C), vibration/hemolysis
                    protection, and formal blood bank release.
                  </li>
                  <li>
                    · <strong>No Patient Transport:</strong> UAVs are strictly for eligible small
                    medical cargo—never for patient transport.
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-base font-bold text-slate-900">
                  Regulatory &amp; Operational Prerequisites
                </h2>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Any real-world medical UAV operation in Ethiopia requires formal airspace
                  authorization from the Ethiopian Civil Aviation Authority (ECAA), licensed BVLOS
                  flight operators, secured hospital landing zones, and regional health authority
                  approval.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* 8. PARTNERSHIPS & INSTITUTIONAL ONBOARDING INQUIRY PAGE         */}
        {/* =============================================================== */}
        {activePage === "partnerships" && (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-5">
              <div>
                <p className="text-xs font-semibold text-emerald-800">
                  Controlled Institutional Onboarding
                </p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900 tracking-tight">
                  Partner with CareBridge Ethiopia
                </h1>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  To protect data integrity and patient safety, CareBridge does not allow
                  unrestricted public self-registration. Institutions apply for verification and are
                  reviewed by the Regional Coordination Authority before receiving portal access.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 text-xs text-slate-700">
                <h2 className="text-sm font-bold text-slate-900">
                  Eligible Participating Entities
                </h2>
                <p>· Public &amp; Private Hospitals (Referral, General, Primary)</p>
                <p>· Woreda Health Centers &amp; Maternal/Child Health Clinics</p>
                <p>· Regional Blood Bank Services</p>
                <p>· Regional &amp; Zonal Health Coordination Authorities</p>
                <p>· Licensed Medical Logistics &amp; Cold-Chain Transport Providers</p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-7">
              <h2 className="text-lg font-bold text-slate-900">
                Submit Institutional Onboarding Application (Demo Queue)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Applications submitted here appear immediately in the Regional Coordination
                Authority’s <strong>Facility Verification</strong> workspace during your demo.
              </p>

              {applicationSubmitted && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">
                      Institutional Application Submitted to Verification Queue
                    </p>
                    <p className="mt-1">
                      You can inspect and approve this application by signing into the Portal as the{" "}
                      <strong>Regional authority administrator</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenPortalLogin}
                    className="px-3 py-1.5 font-semibold bg-emerald-800 text-white rounded-md whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Review in Authority Portal
                  </button>
                </div>
              )}

              <form onSubmit={handlePartnershipSubmit} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Institution Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      placeholder="e.g., Bishoftu Primary Clinic"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Institution Category *
                    </label>
                    <select
                      value={facilityType}
                      onChange={(e) => setFacilityType(e.target.value as FacilityType)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      <option value="Referral Hospital">Referral Hospital</option>
                      <option value="Primary Hospital">Primary Hospital</option>
                      <option value="Health Center">Health Center</option>
                      <option value="Blood Service Center">Blood Service Center</option>
                      <option value="Logistics Provider">Logistics Provider</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Woreda / City (East Shewa) *
                    </label>
                    <input
                      type="text"
                      required
                      value={woredaCity}
                      onChange={(e) => setWoredaCity(e.target.value)}
                      placeholder="e.g., Adama, Meki, Batu, Mojo"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registration / License Reference
                    </label>
                    <input
                      type="text"
                      value={licenseReference}
                      onChange={(e) => setLicenseReference(e.target.value)}
                      placeholder="e.g., OR-HLTH-2026-XXXX"
                      className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Applicant Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g., Dr. Almaz Bekele"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Role / Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantRole}
                      onChange={(e) => setApplicantRole(e.target.value)}
                      placeholder="e.g., Medical Director / Facility Head"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Institutional Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="director@facility.org.et"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Telephone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+251 22 ..."
                      className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Coordination Scope &amp; Notes
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Briefly describe your facility's services and coordination needs..."
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                >
                  Submit Onboarding Application for Authority Review
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* 9. CONTACT, FAQ, PRIVACY & TERMS PAGE                           */}
        {/* =============================================================== */}
        {activePage === "contact" && (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-5">
                <h1 className="text-2xl font-bold text-slate-900">
                  Frequently Asked Questions (FAQ)
                </h1>
                <div className="space-y-3">
                  {[
                    {
                      q: "Does CareBridge automatically reserve or deduct stock when a facility submits a request?",
                      a: "No. Submitting a request notifies the target supplier facility. Inventory counts are only adjusted when an authorized officer at the supplying institution explicitly confirms full or partial availability.",
                    },
                    {
                      q: "Does CareBridge make clinical compatibility decisions for blood products?",
                      a: "Never. Listing a blood type (such as O-Neg or A+) in CareBridge is solely for administrative resource discovery. Qualified blood bank professionals must perform cross-matching, infectious disease screening, and cold-chain release.",
                    },
                    {
                      q: "Should patient names or medical record numbers be entered into CareBridge?",
                      a: "No. CareBridge is a facility-to-facility supply coordination tool and prohibits entering patient-identifiable information (PII).",
                    },
                    {
                      q: "Is drone (UAV) delivery currently operational in CareBridge?",
                      a: "No. The UAV module is a simulated feasibility assessment interface demonstrating how future cargo eligibility and regulatory checks would be evaluated.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <h2 className="text-sm font-bold text-slate-900">{item.q}</h2>
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <h2 className="text-sm font-bold text-slate-900">
                      Privacy &amp; Data Protection
                    </h2>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      CareBridge is architected to process only institutional resource reports,
                      staff role credentials, and non-identifiable supply coordination requests.
                      Personal health information (PHI) is prohibited on the platform.
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <h2 className="text-sm font-bold text-slate-900">Terms of Institutional Use</h2>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      Participating institutions agree that reported resource figures are
                      informational, that clinical care remains the sole responsibility of licensed
                      clinicians, and that all portal actions are recorded in audit logs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Contact Project Coordination Team
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  East Shewa Regional Prototype Coordination Desk (Adama, Oromia, Ethiopia)
                </p>

                {contactSent && (
                  <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                    Thank you. Your inquiry has been logged in the demonstration contact queue.
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactSender}
                      onChange={(e) => setContactSender(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactSenderEmail}
                      onChange={(e) => setContactSenderEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject
                    </label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      <option value="General Coordination Inquiry">
                        General Coordination Inquiry
                      </option>
                      <option value="Institutional Pilot Discussion">
                        Institutional Pilot Discussion
                      </option>
                      <option value="Technical & Database Architecture">
                        Technical &amp; Database Architecture
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* SECTION 8: QUIET PUBLIC FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-10 mt-auto">
        <div className="max-w-[1280px] mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-md">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                  CB
                </span>
                <span className="text-sm font-bold text-slate-900">CareBridge Ethiopia</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Digital Medical Resource Coordination &amp; Logistics Platform Prototype serving
                East Shewa Zone, Oromia, Ethiopia.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-600">
              <button
                type="button"
                onClick={() => navigateAndScroll("home")}
                className="hover:text-slate-900 cursor-pointer"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => navigateAndScroll("about")}
                className="hover:text-slate-900 cursor-pointer"
              >
                About CareBridge
              </button>
              <button
                type="button"
                onClick={() => navigateAndScroll("mission")}
                className="hover:text-slate-900 cursor-pointer"
              >
                Vision &amp; Mission
              </button>
              <button
                type="button"
                onClick={() => navigateAndScroll("how-it-works")}
                className="hover:text-slate-900 cursor-pointer"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => navigateAndScroll("network")}
                className="hover:text-slate-900 cursor-pointer"
              >
                Our Network
              </button>
              <button
                type="button"
                onClick={() => navigateAndScroll("impact")}
                className="hover:text-slate-900 cursor-pointer"
              >
                Impact &amp; Reports
              </button>
              <button
                type="button"
                onClick={() => navigateAndScroll("drone-logistics")}
                className="hover:text-slate-900 cursor-pointer"
              >
                Drone Logistics
              </button>
              <button
                type="button"
                onClick={() => navigateAndScroll("partnerships")}
                className="hover:text-slate-900 cursor-pointer"
              >
                Partnerships
              </button>
              <button
                type="button"
                onClick={() => navigateAndScroll("contact")}
                className="hover:text-slate-900 cursor-pointer"
              >
                Contact &amp; FAQs
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>
              Prototype Demonstration Environment · All displayed facility data represents simulated
              East Shewa scenarios.
            </span>
            <button
              type="button"
              onClick={onOpenPortalLogin}
              className="font-semibold text-emerald-800 hover:underline cursor-pointer"
            >
              Institutional Portal Login →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
