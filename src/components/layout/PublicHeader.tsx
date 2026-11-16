import React, { useState, useEffect, useRef } from "react";
import { X, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import type { PublicPageId } from "../../types/carebridge";

interface PublicHeaderProps {
  activePage: PublicPageId;
  onNavigatePage: (page: PublicPageId) => void;
  onOpenPortalLogin: () => void;
}

interface NavItem {
  id: PublicPageId;
  label: string;
  summary: string;
}

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Home",
    summary: "Platform overview and East Shewa coordination summary",
  },
  {
    id: "about",
    label: "About CareBridge",
    summary: "Project background, origin, and prototype transparency",
  },
  {
    id: "mission",
    label: "Vision & Mission",
    summary: "Long-term vision, practical mission, and safety principles",
  },
  {
    id: "how-it-works",
    label: "How It Works",
    summary: "Complete 8-step inter-facility coordination process",
  },
  {
    id: "network",
    label: "Our Network",
    summary: "East Shewa regional corridor and demonstration directory",
  },
  {
    id: "impact",
    label: "Impact & Reports",
    summary: "Project milestones, evaluation framework, and demo metrics",
  },
  {
    id: "drone-logistics",
    label: "Drone Logistics",
    summary: "Future UAV feasibility scope and regulatory requirements",
  },
  {
    id: "partnerships",
    label: "Partnerships",
    summary: "Controlled institutional onboarding application",
  },
  {
    id: "contact",
    label: "Contact & FAQs",
    summary: "Frequently asked questions, privacy policy, and terms",
  },
];

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  activePage,
  onNavigatePage,
  onOpenPortalLogin,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        toggleBtnRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  // Prevent background scrolling when navigation drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMenuOpen]);

  const handleSelectPage = (pageId: PublicPageId) => {
    onNavigatePage(pageId);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* LEFT: CareBridge Ethiopia Brand Identity */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleSelectPage("home");
            }}
            className="flex items-center gap-2.5 text-slate-900 hover:opacity-90 transition-opacity shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-md"
          >
            <span
              aria-hidden="true"
              className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-2xs"
            >
              CB
            </span>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              CareBridge Ethiopia
            </span>
          </a>

          {/* RIGHT: Institutional Portal Login Button + 3-Line Hamburger Button */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                onOpenPortalLogin();
              }}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Institutional Portal Login</span>
            </button>

            <button
              ref={toggleBtnRef}
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-controls="carebridge-public-navigation-drawer"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="w-10 h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-slate-900" />
              ) : (
                /* Clean 3-horizontal-line hamburger icon */
                <svg
                  className="w-5 h-5 text-slate-900"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-In Navigation Drawer & Backdrop Scrim */}
      <div
        id="carebridge-public-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site Navigation Menu"
        aria-hidden={!isMenuOpen}
        className={`fixed inset-0 z-50 transition-opacity duration-200 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Click-outside Backdrop */}
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-[1px]"
          aria-hidden="true"
        />

        {/* Slide-In Drawer Panel */}
        <div
          ref={drawerRef}
          className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between transition-transform duration-200 ease-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Top Bar */}
          <div className="px-6 h-16 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-md bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                CB
              </span>
              <span className="text-sm font-bold text-slate-900">CareBridge Navigation</span>
            </div>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close navigation menu"
              className="w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links List */}
          <nav
            aria-label="Primary Public Pages"
            className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
          >
            {PUBLIC_NAV_ITEMS.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectPage(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-colors flex items-start justify-between gap-3 cursor-pointer ${
                    isActive
                      ? "bg-emerald-50/90 text-emerald-950 border border-emerald-200"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                  }`}
                >
                  <div>
                    <div
                      className={`text-sm ${
                        isActive ? "font-bold text-emerald-900" : "font-semibold text-slate-900"
                      }`}
                    >
                      {item.label}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{item.summary}</p>
                  </div>
                  {isActive && (
                    <span className="text-[11px] font-semibold text-emerald-800 shrink-0 mt-0.5">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Drawer Footer: Portal Login & Partnership Quick Actions */}
          <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-2.5">
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                onOpenPortalLogin();
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open Institutional Portal Login</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectPage("partnerships")}
              className="w-full py-2 px-4 text-xs font-semibold text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Apply for Institutional Onboarding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
