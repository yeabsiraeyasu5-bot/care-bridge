import React, { useState } from "react";
import { ShieldCheck, Lock, ArrowLeft, Building2, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { DemoUserAccount } from "../../types/carebridge";

interface LoginProps {
  accounts: DemoUserAccount[];
  onSelectAccount: (account: DemoUserAccount) => void;
  onBackToPublic: () => void;
  onGoToOnboarding: () => void;
}

export const Login: React.FC<LoginProps> = ({
  accounts,
  onSelectAccount,
  onBackToPublic,
  onGoToOnboarding,
}) => {
  const [selectedId, setSelectedId] = useState<string>(accounts[0]?.id || "");
  const selectedAccount = accounts.find((a) => a.id === selectedId) || accounts[0];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccount) {
      onSelectAccount(selectedAccount);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Bar Contract: 3 zones */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">
          <a
            href="#public"
            onClick={(e) => {
              e.preventDefault();
              onBackToPublic();
            }}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            CareBridge Ethiopia
          </a>

          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={onBackToPublic}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Public Website
            </button>
            <button
              type="button"
              onClick={onGoToOnboarding}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Institutional Onboarding Application
            </button>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onBackToPublic}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Website</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1140px] w-full mx-auto px-6 py-10">
        {/* Explicit Prototype Demonstration Mode Notice */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-950">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">
              Demonstration Mode Authentication (Role-Based Access Control Simulator)
            </p>
            <p className="mt-1 leading-relaxed">
              This prototype is not connected to a live authentication server. Select any of the 7
              institutional roles below to inspect how CareBridge routes authorized staff, enforces
              facility-scoped permissions, and coordinates requests between Meki Health Center,
              Adama Hospital Medical College, Batu Hospital, and the Regional Coordination
              Authority. In production, authentication is enforced via Supabase Auth and PostgreSQL
              Row-Level Security (RLS).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Role Selection Cards */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6">
            <h1 className="text-xl font-bold text-slate-900">
              Select Institutional Role to Enter Secure Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Unrestricted public registration is disabled. Only verified institutional accounts
              may access operational workspaces.
            </p>

            <div className="mt-5 space-y-2.5">
              {accounts.map((acc) => {
                const isSelected = acc.id === selectedAccount?.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setSelectedId(acc.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50/60 border-emerald-700"
                        : "bg-slate-50/70 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-slate-900">{acc.role}</span>
                      <span className="text-xs font-mono text-emerald-800 font-semibold">
                        {acc.facilityName}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span>Officer: {acc.fullName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{acc.email}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {acc.permissionsSummary}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Role Summary & Sign-In Confirmation */}
          <div className="lg:col-span-5 bg-slate-900 text-white border border-slate-800 rounded-xl p-6 sticky top-24">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <Lock className="w-4 h-4" />
              <span>INSTITUTIONAL PORTAL SESSION</span>
            </div>

            {selectedAccount && (
              <form onSubmit={handleLoginSubmit} className="mt-4 space-y-4">
                <div className="p-4 bg-slate-800/90 border border-slate-700 rounded-lg space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400">Selected Officer:</span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {selectedAccount.fullName}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Assigned Role:</span>
                    <p className="font-semibold text-emerald-400 mt-0.5">{selectedAccount.role}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Institution / Scope:</span>
                    <p className="font-medium text-slate-200 mt-0.5">
                      {selectedAccount.facilityName}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Access Policy:</span>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">
                      {selectedAccount.permissionsSummary}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
                >
                  Enter CareBridge Portal as {selectedAccount.role}
                </button>

                <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
                  <p className="font-semibold text-slate-300">
                    Not yet a verified CareBridge institution?
                  </p>
                  <p>
                    Healthcare facilities must submit an onboarding application for verification by
                    the Regional Coordination Authority.
                  </p>
                  <button
                    type="button"
                    onClick={onGoToOnboarding}
                    className="text-emerald-400 hover:underline font-semibold cursor-pointer"
                  >
                    Submit Institutional Onboarding Application →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
