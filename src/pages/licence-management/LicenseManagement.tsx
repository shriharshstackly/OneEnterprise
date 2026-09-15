import React, { useState, useMemo, useRef, useEffect } from 'react';

// --- Types & Data Contracts ---
export type LicenseStatus = 'Active' | 'Expiring' | 'Rejected';

export interface LicenseItem {
  id: string;
  key: string;
  plan: string;
  seats: number;
  type: string;
  organization: string;
  expiryDate: string;
  status: LicenseStatus;
}

// Table Main Data
const INITIAL_LICENSES: LicenseItem[] = [
  {
    id: '1',
    key: 'LIC-4421-MNPR',
    plan: 'Standard',
    seats: 50,
    type: 'Enterprise',
    organization: '123 Inc',
    expiryDate: '2024-11-02',
    status: 'Active',
  },
  {
    id: '2',
    key: 'LIC-4421-MNPR',
    plan: 'Standard',
    seats: 50,
    type: 'Enterprise',
    organization: '123 Inc',
    expiryDate: '2024-11-02',
    status: 'Expiring',
  },
  {
    id: '3',
    key: 'LIC-4421-MNPR',
    plan: 'Standard',
    seats: 50,
    type: 'Trial',
    organization: 'Acme Corp',
    expiryDate: '2024-11-02',
    status: 'Expiring',
  },
  {
    id: '4',
    key: 'LIC-4421-MNPR',
    plan: 'Standard',
    seats: 50,
    type: 'Enterprise',
    organization: '123 Inc',
    expiryDate: '2024-11-02',
    status: 'Rejected',
  },
  {
    id: '5',
    key: 'LIC-1221-ACPR',
    plan: 'Premium',
    seats: 100,
    type: 'Enterprise',
    organization: 'GlobalTech',
    expiryDate: '2025-01-15',
    status: 'Active',
  },
];

// Contextual sample datasets matching your Figma frames
const SAMPLE_RENEW_LICENSES: LicenseItem[] = [
  {
    id: 'ren-1',
    key: 'LIC-4421-ACPR',
    plan: 'Standard',
    seats: 50,
    type: 'Enterprise',
    organization: '123 Inc',
    expiryDate: '2024-11-02',
    status: 'Expiring',
  },
  {
    id: 'ren-2',
    key: 'LIC-4421-ACPR',
    plan: 'Standard',
    seats: 50,
    type: 'Enterprise',
    organization: '123 Inc',
    expiryDate: '2024-11-02',
    status: 'Expiring',
  },
  {
    id: 'ren-3',
    key: 'LIC-1221-ACPR',
    plan: 'Standard',
    seats: 50,
    type: 'Enterprise',
    organization: 'GlobalTech',
    expiryDate: '2024-11-02',
    status: 'Expiring',
  },
];

const SAMPLE_SUSPEND_LICENSES: LicenseItem[] = [
  {
    id: 'sus-1',
    key: 'LIC-4421-ACPR',
    plan: 'Standard',
    seats: 50,
    type: 'Enterprise',
    organization: '123 Inc',
    expiryDate: '2024-11-02',
    status: 'Active',
  },
  {
    id: 'sus-2',
    key: 'LIC-4421-ACPR',
    plan: 'Standard',
    seats: 50,
    type: 'Enterprise',
    organization: '123 Inc',
    expiryDate: '2024-11-02',
    status: 'Active',
  },
  {
    id: 'sus-3',
    key: 'LIC-1221-ACPR',
    plan: 'Standard',
    seats: 50,
    type: 'Enterprise',
    organization: 'GlobalTech',
    expiryDate: '2024-11-02',
    status: 'Active',
  },
];

const SAMPLE_ACTIVATE_LICENSES: LicenseItem[] = [
  {
    id: 'act-1',
    key: 'LIC-4421-ACPR',
    plan: 'Standard',
    seats: 50,
    type: 'Enterprise',
    organization: '123 Inc',
    expiryDate: '2024-11-02',
    status: 'Rejected',
  },
  {
    id: 'act-2',
    key: 'LIC-4421-ACPR',
    plan: 'Standard',
    seats: 50,
    type: 'Enterprise',
    organization: '123 Inc',
    expiryDate: '2024-11-02',
    status: 'Rejected',
  },
  {
    id: 'act-3',
    key: 'LIC-1221-ACPR',
    plan: 'Standard',
    seats: 50,
    type: 'Enterprise',
    organization: 'GlobalTech',
    expiryDate: '2024-11-02',
    status: 'Rejected',
  },
];

type ModalType = 'export' | 'create' | 'renew' | 'suspend' | 'activate' | null;

export const LicenseManagement: React.FC = () => {
  // --- Core States ---
  const [licenses, setLicenses] = useState<LicenseItem[]>(INITIAL_LICENSES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // --- Modal Selection Trackers ---
  const [renewSelectedIds, setRenewSelectedIds] = useState<string[]>([]);
  const [suspendSelectedIds, setSuspendSelectedIds] = useState<string[]>([]);
  const [activateSelectedIds, setActivateSelectedIds] = useState<string[]>([]);

  // --- Filter Dropdown States ---
  const [selectedOrg, setSelectedOrg] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const [orgOpen, setOrgOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const orgRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (orgRef.current && !orgRef.current.contains(event.target as Node)) setOrgOpen(false);
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) setTypeOpen(false);
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) setStatusOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Modal Form Inputs
  const [createForm, setCreateForm] = useState({
    organization: '123 Inc',
    plan: 'Standard',
    type: 'Enterprise',
    seats: 50,
    status: 'Active' as LicenseStatus,
    startDate: '2026-09-01',
    expiryDate: '2027-09-01',
    autoRenewal: true,
  });

  const [exportForm, setExportForm] = useState({
    specificData: {
      licenseKey: true,
      organizationPlan: true,
      licenseType: true,
      expiryDate: true,
      licenseStatus: true,
    },
    startDate: '2026-09-01',
    endDate: '2027-09-01',
    format: 'XLSX' as 'CSV' | 'PDF' | 'XLSX',
  });

  const [renewForm, setRenewForm] = useState({
    period: '1 Year',
    newExpiry: '2026-11-02',
    reason: '',
  });

  const [suspendReason, setSuspendReason] = useState('');
  const [activateDate, setActivateDate] = useState('2026-11-02');
  const [activateReason, setActivateReason] = useState('');

  // Open Handlers prefilling either table-selected items or the frame mock data
  const handleOpenRenew = () => {
    const defaultIds = selectedIds.length > 0 ? selectedIds : SAMPLE_RENEW_LICENSES.map((l) => l.id);
    setRenewSelectedIds(defaultIds);
    setActiveModal('renew');
  };

  const handleOpenSuspend = () => {
    const defaultIds = selectedIds.length > 0 ? selectedIds : SAMPLE_SUSPEND_LICENSES.map((l) => l.id);
    setSuspendSelectedIds(defaultIds);
    setActiveModal('suspend');
  };

  const handleOpenActivate = () => {
    const defaultIds = selectedIds.length > 0 ? selectedIds : SAMPLE_ACTIVATE_LICENSES.map((l) => l.id);
    setActivateSelectedIds(defaultIds);
    setActiveModal('activate');
  };

  // Determine active modal items
  const activeRenewItems = useMemo(() => {
    if (selectedIds.length > 0) {
      return licenses.filter((l) => selectedIds.includes(l.id));
    }
    return SAMPLE_RENEW_LICENSES;
  }, [licenses, selectedIds]);

  const activeSuspendItems = useMemo(() => {
    if (selectedIds.length > 0) {
      return licenses.filter((l) => selectedIds.includes(l.id));
    }
    return SAMPLE_SUSPEND_LICENSES;
  }, [licenses, selectedIds]);

  const activeActivateItems = useMemo(() => {
    if (selectedIds.length > 0) {
      return licenses.filter((l) => selectedIds.includes(l.id));
    }
    return SAMPLE_ACTIVATE_LICENSES;
  }, [licenses, selectedIds]);

  // Main table selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredLicenses.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredLicenses = useMemo(() => {
    return licenses.filter((item) => {
      const matchSearch =
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.organization.toLowerCase().includes(searchQuery.toLowerCase());

      const matchOrg = selectedOrg === 'All' || item.organization === selectedOrg;
      const matchType = selectedType === 'All' || item.type === selectedType;
      const matchStatus = selectedStatus === 'All' || item.status === selectedStatus;

      return matchSearch && matchOrg && matchType && matchStatus;
    });
  }, [licenses, searchQuery, selectedOrg, selectedType, selectedStatus]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: LicenseItem = {
      id: String(Date.now()),
      key: `LIC-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      plan: createForm.plan,
      seats: Number(createForm.seats),
      type: createForm.type,
      organization: createForm.organization,
      expiryDate: createForm.expiryDate,
      status: createForm.status,
    };
    setLicenses([newEntry, ...licenses]);
    setActiveModal(null);
  };

  const closeModal = () => setActiveModal(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  return (
    <div className="flex-1 min-h-screen bg-[#f8fafc] text-slate-800 font-sans p-6 sm:p-8 flex flex-col justify-between select-none">
      <div className="max-w-[1400px] w-full mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900">
            License Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage platform licenses across organizations and tenants
          </p>
        </div>

        {/* Top 4 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between h-[130px]">
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium font-mono text-slate-600 tracking-wider">
                Total Licenses
              </span>
              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#1877f2] flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">2,458</div>
              <div className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                <span>↑ 12%</span>
                <span className="text-slate-400 font-normal">vs last month</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between h-[130px]">
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium font-mono text-slate-600 tracking-wider">
                Active Licenses
              </span>
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">2,104</div>
              <div className="text-xs text-slate-400 font-normal mt-1">85.6% utilization rate</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between h-[130px]">
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium font-mono text-slate-600 tracking-wider">
                Expired licenses
              </span>
              <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">142</div>
              <div className="text-xs text-slate-400 font-normal mt-1">Within next 30 days</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between h-[130px]">
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium font-mono text-slate-600 tracking-wider">
                Suspended licenses
              </span>
              <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">36</div>
              <div className="text-xs text-slate-400 font-normal mt-1">Requires admin review</div>
            </div>
          </div>
        </div>

        {/* Section: License List */}
        <div className="space-y-4 pt-2">
          <h2 className="text-base font-semibold text-slate-900">License List</h2>

          {/* Table Controls & Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1">
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 placeholder:text-slate-400 select-text"
                />
              </div>

              {/* Organization Filter Dropdown */}
              <div className="relative" ref={orgRef}>
                <button
                  type="button"
                  onClick={() => setOrgOpen(!orgOpen)}
                  className="flex items-center gap-3 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm"
                >
                  <span>{selectedOrg === 'All' ? 'Organization' : selectedOrg}</span>
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
                {orgOpen && (
                  <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1 text-xs">
                    {['All', '123 Inc', 'Acme Corp', 'GlobalTech'].map((org) => (
                      <div
                        key={org}
                        onClick={() => {
                          setSelectedOrg(org);
                          setOrgOpen(false);
                        }}
                        className={`px-3 py-2 cursor-pointer hover:bg-slate-50 flex items-center justify-between ${
                          selectedOrg === org ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span>{org === 'All' ? 'All Organizations' : org}</span>
                        {selectedOrg === org && <span>✓</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* License Type Filter Dropdown */}
              <div className="relative" ref={typeRef}>
                <button
                  type="button"
                  onClick={() => setTypeOpen(!typeOpen)}
                  className="flex items-center gap-3 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm"
                >
                  <span>{selectedType === 'All' ? 'License Type' : selectedType}</span>
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
                {typeOpen && (
                  <div className="absolute left-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1 text-xs">
                    {['All', 'Enterprise', 'Trial'].map((t) => (
                      <div
                        key={t}
                        onClick={() => {
                          setSelectedType(t);
                          setTypeOpen(false);
                        }}
                        className={`px-3 py-2 cursor-pointer hover:bg-slate-50 flex items-center justify-between ${
                          selectedType === t ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span>{t === 'All' ? 'All Types' : t}</span>
                        {selectedType === t && <span>✓</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative" ref={statusRef}>
                <button
                  type="button"
                  onClick={() => setStatusOpen(!statusOpen)}
                  className="flex items-center gap-3 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm"
                >
                  <span>{selectedStatus === 'All' ? 'Status' : selectedStatus}</span>
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
                {statusOpen && (
                  <div className="absolute left-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1 text-xs">
                    {['All', 'Active', 'Expiring', 'Rejected'].map((s) => (
                      <div
                        key={s}
                        onClick={() => {
                          setSelectedStatus(s);
                          setStatusOpen(false);
                        }}
                        className={`px-3 py-2 cursor-pointer hover:bg-slate-50 flex items-center justify-between ${
                          selectedStatus === s ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span>{s === 'All' ? 'All Statuses' : s}</span>
                        {selectedStatus === s && <span>✓</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Create License Button */}
            <button
              type="button"
              onClick={() => setActiveModal('create')}
              className="flex items-center gap-2 bg-[#1877f2] hover:bg-[#1664d9] text-white px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer shadow-sm ml-auto sm:ml-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Create License</span>
            </button>
          </div>

          {/* Main Table Container */}
          <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-[#1b253b] text-white text-[11px] font-mono tracking-wider">
                    <th className="py-3.5 px-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredLicenses.length && filteredLicenses.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-slate-400 text-blue-600 focus:ring-0 w-3.5 h-3.5 cursor-pointer accent-blue-600"
                      />
                    </th>
                    <th className="py-3.5 px-4 font-semibold uppercase">License Key</th>
                    <th className="py-3.5 px-4 font-semibold uppercase">Organization Plan</th>
                    <th className="py-3.5 px-4 font-semibold uppercase">License Type</th>
                    <th className="py-3.5 px-4 font-semibold uppercase">Expiry Date</th>
                    <th className="py-3.5 px-4 font-semibold uppercase text-center">License Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredLicenses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        No licenses found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLicenses.map((item) => {
                      const isSelected = selectedIds.includes(item.id);
                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-slate-50/70 transition-colors cursor-default ${
                            isSelected ? 'bg-blue-50/20' : ''
                          }`}
                        >
                          <td className="py-4 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectItem(item.id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5 cursor-pointer accent-blue-600"
                            />
                          </td>
                          <td className="py-4 px-4 font-mono text-slate-800 font-medium">
                            {item.key}
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-slate-900">{item.plan}</div>
                            <div className="text-[11px] text-slate-400">{item.seats} Seats</div>
                          </td>
                          <td className="py-4 px-4 text-slate-700 font-medium">{item.organization}</td>
                          <td className="py-4 px-4 font-mono text-slate-700">{formatDate(item.expiryDate)}</td>
                          <td className="py-4 px-4 text-center">
                            {item.status === 'Active' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#eafaf1] text-[#1e9a59]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#1e9a59]"></span>
                                Active
                              </span>
                            )}
                            {item.status === 'Expiring' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#fef7e8] text-[#d97706]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]"></span>
                                Expiring
                              </span>
                            )}
                            {item.status === 'Rejected' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#fef1f2] text-[#e11d48]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]"></span>
                                Rejected
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Bottom Action Toolbar & Pagination */}
            <div className="p-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenRenew}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-[#1877f2] border border-[#1877f2] rounded-lg hover:bg-blue-50 transition cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Renew
                </button>
                <button
                  type="button"
                  onClick={handleOpenSuspend}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-[#1877f2] border border-[#1877f2] rounded-lg hover:bg-blue-50 transition cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="10" y1="15" x2="10" y2="9" />
                    <line x1="14" y1="15" x2="14" y2="9" />
                  </svg>
                  Suspand
                </button>
                <button
                  type="button"
                  onClick={handleOpenActivate}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-[#1877f2] border border-[#1877f2] rounded-lg hover:bg-blue-50 transition cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                  </svg>
                  Activite
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                <span>Showing 1 to {filteredLicenses.length} of 2,458 entries</span>
                <div className="flex items-center gap-1 font-sans">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 cursor-pointer"
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    className={`w-7 h-7 flex items-center justify-center rounded font-medium cursor-pointer ${
                      currentPage === 1 ? 'bg-[#1877f2] text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    1
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(2)}
                    className={`w-7 h-7 flex items-center justify-center rounded font-medium cursor-pointer ${
                      currentPage === 2 ? 'bg-[#1877f2] text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    2
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(3)}
                    className={`w-7 h-7 flex items-center justify-center rounded font-medium cursor-pointer ${
                      currentPage === 3 ? 'bg-[#1877f2] text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    3
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                    className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 cursor-pointer"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setSearchQuery('');
            setSelectedOrg('All');
            setSelectedType('All');
            setSelectedStatus('All');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
        <button
          type="button"
          onClick={() => setActiveModal('export')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1877f2] hover:bg-[#1664d9] rounded-lg text-xs font-medium text-white shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export report
        </button>
      </div>

      {/* ========================================================================= */}
      {/* =============================== MODALS ================================== */}
      {/* ========================================================================= */}

      {/* --- MODAL 1: EXPORT OPTIONS --- */}
      {activeModal === 'export' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-4">
          <div className="bg-white rounded-2xl w-full max-w-[460px] p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-lg font-bold text-slate-900">Export Options</h3>
              <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600 rounded-full p-1 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 pt-1 text-xs">
              <div>
                <label className="font-semibold text-slate-800 block mb-2">Specific Data</label>
                <div className="space-y-2">
                  {[
                    { key: 'licenseKey', label: 'License Key' },
                    { key: 'organizationPlan', label: 'Organization Plan' },
                    { key: 'licenseType', label: 'License Type' },
                    { key: 'expiryDate', label: 'Expiry Date' },
                    { key: 'licenseStatus', label: 'License Status' },
                  ].map((field) => (
                    <label key={field.key} className="flex items-center gap-2.5 text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exportForm.specificData[field.key as keyof typeof exportForm.specificData]}
                        onChange={(e) =>
                          setExportForm({
                            ...exportForm,
                            specificData: {
                              ...exportForm.specificData,
                              [field.key]: e.target.checked,
                            },
                          })
                        }
                        className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5 accent-blue-600"
                      />
                      <span>{field.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">Date Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1 font-medium">Start Date</span>
                    <input
                      type="date"
                      value={exportForm.startDate}
                      onChange={(e) => setExportForm({ ...exportForm, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 text-xs focus:outline-none focus:border-blue-500 bg-white cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1 font-medium">End Date</span>
                    <input
                      type="date"
                      value={exportForm.endDate}
                      onChange={(e) => setExportForm({ ...exportForm, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 text-xs focus:outline-none focus:border-blue-500 bg-white cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-2">Select Format</label>
                <div className="space-y-2.5">
                  {[
                    { id: 'CSV', label: 'CSV (Comma-Separated Values)', iconText: 'CSV' },
                    { id: 'PDF', label: 'PDF', iconText: 'PDF' },
                    { id: 'XLSX', label: 'Excel (XLSX)', iconText: 'XLS' },
                  ].map((fmt) => (
                    <label key={fmt.id} className="flex items-center gap-3 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="exportFormat"
                        checked={exportForm.format === fmt.id}
                        onChange={() => setExportForm({ ...exportForm, format: fmt.id as any })}
                        className="text-blue-600 focus:ring-0 accent-blue-600 cursor-pointer"
                      />
                      <span className="text-[10px] font-bold border border-slate-300 rounded px-1 text-slate-600">
                        {fmt.iconText}
                      </span>
                      <span>{fmt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-6 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1877f2] hover:bg-[#1664d9] rounded-lg text-xs font-medium text-white shadow-sm cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: CREATE LICENSE --- */}
      {activeModal === 'create' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-white rounded-2xl w-full max-w-[460px] p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create License</h3>
                <p className="text-xs text-slate-400 mt-0.5">Create a new platform license</p>
              </div>
              <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600 rounded-full p-1 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </button>
            </div>

            <div className="space-y-3.5 pt-1 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Organization</label>
                <select
                  value={createForm.organization}
                  onChange={(e) => setCreateForm({ ...createForm, organization: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="123 Inc">123 Inc</option>
                  <option value="Acme Corp">Acme Corp</option>
                  <option value="GlobalTech">GlobalTech</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Organization Plan</label>
                  <select
                    value={createForm.plan}
                    onChange={(e) => setCreateForm({ ...createForm, plan: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">License Type</label>
                  <select
                    value={createForm.type}
                    onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="Trial">Trial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Number of Seats</label>
                  <input
                    type="number"
                    min="1"
                    value={createForm.seats}
                    onChange={(e) => setCreateForm({ ...createForm, seats: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none select-text"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">License Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as LicenseStatus })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Expiring">Expiring</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={createForm.startDate}
                    onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none bg-white cursor-pointer"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Expiry Date</label>
                  <input
                    type="date"
                    value={createForm.expiryDate}
                    onChange={(e) => setCreateForm({ ...createForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none bg-white cursor-pointer"
                  />
                </div>
              </div>

              {/* Auto Renewal Switch */}
              <div className="flex items-center justify-between pt-2">
                <span className="font-semibold text-slate-800">Auto Renewal</span>
                <button
                  type="button"
                  onClick={() => setCreateForm({ ...createForm, autoRenewal: !createForm.autoRenewal })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    createForm.autoRenewal ? 'bg-[#1877f2]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      createForm.autoRenewal ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-6 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1877f2] hover:bg-[#1664d9] rounded-lg text-xs font-medium text-white shadow-sm cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL 3: RENEW LICENSE --- */}
      {activeModal === 'renew' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-4">
          <div className="bg-white rounded-2xl w-full max-w-[490px] p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Renew License</h3>
                <p className="text-xs text-slate-500 mt-0.5">Extend the selected license validity period</p>
              </div>
              <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600 rounded-full p-1 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </button>
            </div>

            <div className="space-y-3.5 pt-1 text-xs">
              <div className="font-semibold text-slate-800">
                Selected License ({renewSelectedIds.length})
              </div>

              {/* Selected List Box */}
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 p-1 max-h-48 overflow-y-auto">
                {activeRenewItems.map((item) => {
                  const isChecked = renewSelectedIds.includes(item.id);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-2.5">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setRenewSelectedIds((prev) =>
                              prev.includes(item.id) ? prev.filter((i) => i !== item.id) : [...prev, item.id]
                            )
                          }
                          className="rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
                        />
                        <span className="font-mono text-slate-800 font-medium">{item.key}</span>
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] text-slate-400">Current Expiry</div>
                        <div className="font-mono font-medium text-slate-700">{formatDate(item.expiryDate)}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{item.plan}</div>
                        <div className="text-[10px] text-slate-400">{item.seats} Seats</div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#fef7e8] text-[#d97706]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]"></span>
                        {item.status}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Alert Info note */}
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                <span className="w-4 h-4 rounded-full bg-amber-400 text-white flex items-center justify-center text-[10px] font-bold">
                  !
                </span>
                <span>{renewSelectedIds.length} licenses selected for renewal</span>
              </div>

              {/* Period & New Expiry Date */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Renew Period</label>
                  <select
                    value={renewForm.period}
                    onChange={(e) => setRenewForm({ ...renewForm, period: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="6 Months">6 Months</option>
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">New Expiry Date</label>
                  <input
                    type="date"
                    value={renewForm.newExpiry}
                    onChange={(e) => setRenewForm({ ...renewForm, newExpiry: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none bg-white cursor-pointer"
                  />
                </div>
              </div>

              {/* Renew Reason */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Renew Reason</label>
                <input
                  type="text"
                  placeholder="Enter the reason"
                  value={renewForm.reason}
                  onChange={(e) => setRenewForm({ ...renewForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none select-text"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-5 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2 bg-[#1877f2] hover:bg-[#1664d9] rounded-lg text-xs font-medium text-white shadow-sm cursor-pointer"
              >
                Renew
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: SUSPEND LICENSE --- */}
      {activeModal === 'suspend' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-4">
          <div className="bg-white rounded-2xl w-full max-w-[490px] p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Suspend License</h3>
                <p className="text-xs text-slate-500 mt-0.5">You are about to suspend the selected license</p>
              </div>
              <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600 rounded-full p-1 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </button>
            </div>

            <div className="space-y-3.5 pt-1 text-xs">
              <div className="font-semibold text-slate-800">
                Selected License ({suspendSelectedIds.length})
              </div>

              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 p-1 max-h-48 overflow-y-auto">
                {activeSuspendItems.map((item) => {
                  const isChecked = suspendSelectedIds.includes(item.id);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-2.5">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setSuspendSelectedIds((prev) =>
                              prev.includes(item.id) ? prev.filter((i) => i !== item.id) : [...prev, item.id]
                            )
                          }
                          className="rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
                        />
                        <span className="font-mono text-slate-800 font-medium">{item.key}</span>
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] text-slate-400">Expiry Date</div>
                        <div className="font-mono font-medium text-slate-700">{formatDate(item.expiryDate)}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{item.plan}</div>
                        <div className="text-[10px] text-slate-400">{item.seats} Seats</div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#eafaf1] text-[#1e9a59]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1e9a59]"></span>
                        {item.status}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                <span className="w-4 h-4 rounded-full bg-amber-400 text-white flex items-center justify-center text-[10px] font-bold">
                  !
                </span>
                <span>{suspendSelectedIds.length} licenses selected for suspension</span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Suspend Reason</label>
                <input
                  type="text"
                  placeholder="Enter the reason"
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none select-text"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-5 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2 bg-[#1877f2] hover:bg-[#1664d9] rounded-lg text-xs font-medium text-white shadow-sm cursor-pointer"
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 5: ACTIVE LICENSE --- */}
      {activeModal === 'activate' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-4">
          <div className="bg-white rounded-2xl w-full max-w-[490px] p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Activate License</h3>
                <p className="text-xs text-slate-500 mt-0.5">The license will become available for the organization</p>
              </div>
              <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600 rounded-full p-1 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </button>
            </div>

            <div className="space-y-3.5 pt-1 text-xs">
              <div className="font-semibold text-slate-800">
                Selected License ({activateSelectedIds.length})
              </div>

              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 p-1 max-h-48 overflow-y-auto">
                {activeActivateItems.map((item) => {
                  const isChecked = activateSelectedIds.includes(item.id);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-2.5">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setActivateSelectedIds((prev) =>
                              prev.includes(item.id) ? prev.filter((i) => i !== item.id) : [...prev, item.id]
                            )
                          }
                          className="rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
                        />
                        <span className="font-mono text-slate-800 font-medium">{item.key}</span>
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] text-slate-400">Current Expiry</div>
                        <div className="font-mono font-medium text-slate-700">{formatDate(item.expiryDate)}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{item.plan}</div>
                        <div className="text-[10px] text-slate-400">{item.seats} Seats</div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#fef1f2] text-[#e11d48]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]"></span>
                        {item.status}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                <span className="w-4 h-4 rounded-full bg-amber-400 text-white flex items-center justify-center text-[10px] font-bold">
                  !
                </span>
                <span>{activateSelectedIds.length} licenses selected for activation</span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Activation Date</label>
                <input
                  type="date"
                  value={activateDate}
                  onChange={(e) => setActivateDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none bg-white cursor-pointer"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Activation Reason</label>
                <input
                  type="text"
                  placeholder="Enter the reason"
                  value={activateReason}
                  onChange={(e) => setActivateReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none select-text"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-5 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2 bg-[#1877f2] hover:bg-[#1664d9] rounded-lg text-xs font-medium text-white shadow-sm cursor-pointer"
              >
                Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicenseManagement;