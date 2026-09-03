import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';

export default function UserProfileModal({ isOpen, onClose }) {
  const { user, logout } = useAuth() || {};
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  const role = user?.role || 'FLEET_MANAGER';

  const getRoleDetails = () => {
    switch (role) {
      case 'DRIVER':
        return {
          title: 'Commercial Fleet Operator',
          badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          phone: '+91 98765 43210',
          licenseNumber: 'DL-142024001928',
          licenseCategory: 'Heavy Commercial Vehicle (HMV)',
          licenseExpiry: '2026-12-15',
          safetyScore: 98,
          rating: '🌟 5-Star Elite Operator',
          completedTrips: 150,
          onTimeRate: '96.4%',
          assignedVehicle: 'Volvo FH16 Globetrotter (MH-12-AB-1234)',
          operatingZone: 'West Zone Hub (Mumbai ↔ Pune)',
        };
      case 'SAFETY_OFFICER':
        return {
          title: 'Fleet Safety & Compliance Officer',
          badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          phone: '+91 98765 43211',
          department: 'Fleet Safety, OSHA & Telematics Compliance',
          clearanceId: 'SEC-SAFE-2024-09',
          inspectionScope: 'Active Workshop Logs & Preventive Overhauls',
          auditTier: 'Tier-1 Certified Safety Inspector',
          emergencyOverride: 'Enabled (24/7 Response)',
          managedAssets: '150 Fleet Units Monitored',
        };
      case 'FINANCIAL_ANALYST':
        return {
          title: 'Corporate Financial & P&L Analyst',
          badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
          phone: '+91 98765 43212',
          department: 'Logistics Accounting, Cost Control & Audit',
          signoffKey: 'FIN-AUDIT-9921',
          accountingTier: 'Tier-1 Ledger Signoff & ROI Analytics',
          fiscalScope: 'Fuel Intelligence, Toll Expenses & Asset Leases',
          reportingRegion: 'Enterprise Global Accounts',
        };
      case 'ADMIN':
      case 'FLEET_MANAGER':
      default:
        return {
          title: 'Enterprise Fleet Commander & Super Admin',
          badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
          phone: '+91 98765 43200',
          department: 'Executive Fleet Operations & Dispatch Command',
          authorityScope: 'Full System Command (150+ Vehicles, 150 Drivers, 150 Trips)',
          systemAccess: 'All 7 Real-Time Cinematic Dashboards Authorized',
          rbacTier: 'Level-4 Super Administrator (Unrestricted)',
          tenantId: 'public / Enterprise Primary',
        };
    }
  };

  const roleMeta = getRoleDetails();

  const copyEmail = () => {
    navigator.clipboard.writeText(user?.email || 'admin@transitops.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal title="👤 User Profile & Role Credentials" onClose={onClose}>
      <div className="space-y-5 text-slate-200 text-xs">
        {/* ── PROFILE HEADER ── */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-xl text-slate-950 shadow-lg shadow-cyan-500/20">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'TO'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100 truncate">{user?.name || 'Authorized User'}</h2>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${roleMeta.badgeColor}`}>
                {role}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">{roleMeta.title}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] text-slate-500 font-mono">{user?.email || 'user@transitops.com'}</span>
              <button
                onClick={copyEmail}
                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* ── TAB NAV ── */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'overview'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📋 Overview & Contact
          </button>
          <button
            onClick={() => setActiveTab('roleSpecific')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'roleSpecific'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🛡️ Role Credentials
          </button>
        </div>

        {/* ── TAB CONTENT: OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-850/80 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Contact Phone</span>
                <p className="text-xs font-mono font-semibold text-slate-200 mt-1">{roleMeta.phone}</p>
              </div>
              <div className="p-3 bg-slate-850/80 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Account Status</span>
                <p className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active & Verified
                </p>
              </div>
              <div className="p-3 bg-slate-850/80 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Tenant Scope</span>
                <p className="text-xs font-mono text-slate-200 mt-1">public (Default Multi-Tenant)</p>
              </div>
              <div className="p-3 bg-slate-850/80 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Security Clearance</span>
                <p className="text-xs font-semibold text-cyan-400 mt-1">JWT 256-Bit TLS 1.3</p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB CONTENT: ROLE SPECIFIC ── */}
        {activeTab === 'roleSpecific' && (
          <div className="space-y-3">
            {role === 'DRIVER' && (
              <div className="space-y-2.5">
                <div className="p-3 bg-slate-850/80 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Safety Index Score</span>
                    <div className="text-lg font-black text-emerald-400 mt-0.5">{roleMeta.safetyScore} / 100</div>
                  </div>
                  <span className="text-xs font-bold text-amber-400">{roleMeta.rating}</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500">Commercial License #</span>
                    <p className="text-xs font-mono font-bold text-slate-200 mt-0.5">{roleMeta.licenseNumber}</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500">License Category</span>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5">{roleMeta.licenseCategory}</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500">License Expiry Date</span>
                    <p className="text-xs font-mono text-emerald-400 mt-0.5">{roleMeta.licenseExpiry} (Valid)</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500">On-Time Delivery Rate</span>
                    <p className="text-xs font-bold text-cyan-400 mt-0.5">{roleMeta.onTimeRate}</p>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500">Assigned Asset Telematics</span>
                  <p className="text-xs font-semibold text-slate-200 mt-0.5">🚚 {roleMeta.assignedVehicle}</p>
                </div>
              </div>
            )}

            {role === 'SAFETY_OFFICER' && (
              <div className="space-y-2.5">
                <div className="p-3 bg-slate-850/80 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Safety Compliance Department</span>
                  <p className="text-xs font-semibold text-slate-200 mt-0.5">{roleMeta.department}</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500">Inspector Clearance ID</span>
                    <p className="text-xs font-mono font-bold text-amber-400 mt-0.5">{roleMeta.clearanceId}</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500">Audit Authority Level</span>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5">{roleMeta.auditTier}</p>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500">Active Workshop Oversight</span>
                  <p className="text-xs font-semibold text-cyan-400 mt-0.5">{roleMeta.managedAssets}</p>
                </div>
              </div>
            )}

            {role === 'FINANCIAL_ANALYST' && (
              <div className="space-y-2.5">
                <div className="p-3 bg-slate-850/80 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Corporate Finance Division</span>
                  <p className="text-xs font-semibold text-slate-200 mt-0.5">{roleMeta.department}</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500">Audit Authorization Key</span>
                    <p className="text-xs font-mono font-bold text-purple-400 mt-0.5">{roleMeta.signoffKey}</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500">Accounting Level</span>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5">{roleMeta.accountingTier}</p>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500">Audit Fiscal Scope</span>
                  <p className="text-xs font-semibold text-emerald-400 mt-0.5">{roleMeta.fiscalScope}</p>
                </div>
              </div>
            )}

            {(role === 'ADMIN' || role === 'FLEET_MANAGER') && (
              <div className="space-y-2.5">
                <div className="p-3 bg-slate-850/80 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Command Jurisdiction</span>
                  <p className="text-xs font-semibold text-cyan-400 mt-0.5">{roleMeta.authorityScope}</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500">Administration Level</span>
                    <p className="text-xs font-bold text-red-400 mt-0.5">{roleMeta.rbacTier}</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500">Platform Coverage</span>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5">7 Dashboards Full Access</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── FOOTER ACTIONS ── */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              if (logout) logout();
              onClose();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition"
          >
            🚪 Sign Out of Workspace
          </button>
          <button
            onClick={onClose}
            className="btn-secondary px-4 py-1.5 text-xs font-bold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
