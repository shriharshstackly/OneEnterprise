import  { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  RotateCw,
  Download,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Check,
  X,
  History,
  Building2,
  Lock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  SlidersHorizontal,
  Pencil,
} from "lucide-react";

export type FeatureStatus = "Enabled" | "Disabled";
export type LicensePlan = "Enterprise" | "Premium" | "Standard";

export interface FeatureItem {
  id: string;
  name: string;
  module: string;
  licensePlan: LicensePlan;
  status: FeatureStatus;
}

export interface TenantOrg {
  id: string;
  name: string;
  plan: LicensePlan;
}

export interface HistoryRecord {
  id: string;
  change: string;
  prevValue: string;
  newValue: string;
  changedBy: string;
  changedOn: string;
}

const INITIAL_FEATURES: FeatureItem[] = [
  { id: "1", name: "User Management", module: "Identity", licensePlan: "Enterprise", status: "Enabled" },
  { id: "2", name: "Workflow Engine", module: "Workflow", licensePlan: "Enterprise", status: "Enabled" },
  { id: "3", name: "AI Assistant", module: "AI Services", licensePlan: "Premium", status: "Disabled" },
  { id: "4", name: "Reports", module: "Analytics", licensePlan: "Standard", status: "Enabled" },
  { id: "5", name: "API Access", module: "Integration", licensePlan: "Enterprise", status: "Enabled" },
];

const TENANTS_DATA: TenantOrg[] = [
  { id: "t1", name: "Acme Corporation", plan: "Enterprise" },
  { id: "t2", name: "Globex Industries", plan: "Enterprise" },
  { id: "t3", name: "Initech Solutions", plan: "Premium" },
  { id: "t4", name: "Umbrella Corp", plan: "Enterprise" },
  { id: "t5", name: "Soylent Corp", plan: "Standard" },
];

const INITIAL_HISTORY: HistoryRecord[] = [
  { id: "h1", change: "Status Updated", prevValue: "Disabled", newValue: "Enabled", changedBy: "Heisenberg", changedOn: "14 Aug 2026, 10:42 AM" },
  { id: "h2", change: "Status Updated", prevValue: "Disabled", newValue: "Enabled", changedBy: "Heisenberg", changedOn: "14 Aug 2026, 10:42 AM" },
  { id: "h3", change: "Status Updated", prevValue: "Disabled", newValue: "Enabled", changedBy: "Heisenberg", changedOn: "14 Aug 2026, 10:42 AM" },
  { id: "h4", change: "Status Updated", prevValue: "Disabled", newValue: "Enabled", changedBy: "Heisenberg", changedOn: "14 Aug 2026, 10:42 AM" },
  { id: "h5", change: "License Plan Updated", prevValue: "Standard", newValue: "Enterprise", changedBy: "Heisenberg", changedOn: "14 Aug 2026, 10:42 AM" },
];

export default function FeatureManagement() {
  const [features, setFeatures] = useState<FeatureItem[]>(INITIAL_FEATURES);
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All Modules");
  const [licenseFilter, setLicenseFilter] = useState("All License Plans");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dropdown States
  const [openDropdown, setOpenDropdown] = useState<"module" | "license" | "status" | null>(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  // Modal active items & toggles
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryRecord | null>(null);
console.log(selectedHistoryItem, "selectedHistoryItem");
  // Modals Visibility
  const [isDisableOpen, setIsDisableOpen] = useState(false);
  const [isEnableOpen, setIsEnableOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [isUsageOpen, setIsUsageOpen] = useState(false);
  const [isOrgAccessOpen, setIsOrgAccessOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRollbackOpen, setIsRollbackOpen] = useState(false);

  // Toast Notifications
  const [toast, setToast] = useState<{ title: string; subtitle: string } | null>(null);

  // Configure Form State
  const [configModule, setConfigModule] = useState("");
  const [configPlan, setConfigPlan] = useState<LicensePlan>("Enterprise");
  const [configStatus, setConfigStatus] = useState<FeatureStatus>("Enabled");
  const [configToggle, setConfigToggle] = useState(true);

  // Org Access State
  const [orgScope, setOrgScope] = useState<"all" | "selected">("selected");
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>(["t1", "t2", "t3", "t4"]);
  const [orgSearch, setOrgSearch] = useState("");

  // Export Modal State
  const [reportName, setReportName] = useState("Feature_Management_Report_2026-09-02");
  const [exportScope, setExportScope] = useState("All Features (65 records)");
  const [exportFormat, setExportFormat] = useState("CSV (Comma Separated)");
  const [intervalOption, setIntervalOption] = useState<"Today" | "Last 7 Days" | "Last 30 Days">("Last 30 Days");
  const [dataSections, setDataSections] = useState({
    tenantAdoption: true,
    rateLimits: false,
    licenseTier: false,
  });

  const triggerToast = (title: string, subtitle: string) => {
    setToast({ title, subtitle });
    setTimeout(() => setToast(null), 3500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerToast("Feature Table Refreshed", "Loaded latest configuration states and live metrics.");
    }, 700);
  };

  const openActionModal = (feat: FeatureItem) => {
    setSelectedFeature(feat);
    if (feat.status === "Enabled") {
      setIsDisableOpen(true);
    } else {
      setIsEnableOpen(true);
    }
  };

  const confirmToggleStatus = () => {
    if (!selectedFeature) return;
    const isCurrentlyEnabled = selectedFeature.status === "Enabled";
    const nextStatus: FeatureStatus = isCurrentlyEnabled ? "Disabled" : "Enabled";

    setFeatures((prev) =>
      prev.map((f) => (f.id === selectedFeature.id ? { ...f, status: nextStatus } : f))
    );

    if (isCurrentlyEnabled) {
      setIsDisableOpen(false);
      triggerToast("Feature Disabled", `'${selectedFeature.name}' has been deactivated across the platform.`);
    } else {
      setIsEnableOpen(false);
      triggerToast("Feature Enabled", `'${selectedFeature.name}' has been activated across the platform.`);
    }
  };

  const handleOpenConfigure = (feat: FeatureItem) => {
    setSelectedFeature(feat);
    setConfigModule(feat.module);
    setConfigPlan(feat.licensePlan);
    setConfigStatus(feat.status);
    setConfigToggle(feat.status === "Enabled");
    setIsConfigureOpen(true);
  };

  const handleSaveConfigure = () => {
    if (selectedFeature) {
      setFeatures((prev) =>
        prev.map((f) =>
          f.id === selectedFeature.id
            ? { ...f, module: configModule, licensePlan: configPlan, status: configStatus }
            : f
        )
      );
    }
    setIsConfigureOpen(false);
    triggerToast("Changes Saved", `'${selectedFeature?.name}' settings updated and recorded in the Audit Log.`);
  };

  const handleConfirmRollback = () => {
    setIsRollbackOpen(false);
    triggerToast("Configuration Rolled Back", `'${selectedFeature?.name}' has been restored to the previous configuration.`);
  };

  const filteredFeatures = useMemo(() => {
    return features.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchModule = moduleFilter === "All Modules" || item.module === moduleFilter;
      const matchLicense = licenseFilter === "All License Plans" || item.licensePlan === licenseFilter;
      const matchStatus = statusFilter === "All Status" || item.status === statusFilter;
      return matchSearch && matchModule && matchLicense && matchStatus;
    });
  }, [features, searchQuery, moduleFilter, licenseFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-8 font-sans antialiased relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-start gap-3 bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-xl max-w-md w-full animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="w-5 h-5 rounded-full border border-emerald-500 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <div className="flex-1">
            <h4 className="text-[13px] font-bold text-slate-900 leading-tight">{toast.title}</h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-normal">{toast.subtitle}</p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-7">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
          PLATFORM ADMINISTRATION
        </p>
        <h1 className="text-[28px] font-extrabold text-[#0F172A] tracking-tight">Feature Management</h1>
        <p className="text-[13px] text-slate-500 mt-1">
          Control platform feature availability, configuration, and access across the enterprise.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-7">
        {/* Total Features */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Total Features</span>
            <Sliders className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-3">
            <div className="text-[34px] font-bold text-[#0F172A] leading-none">65</div>
            <div className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-[#10B981]">
              <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+4.2%</span>
              <span className="text-slate-400 font-normal">this month</span>
            </div>
          </div>
        </div>

        {/* Enabled */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Enabled</span>
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="mt-3">
            <div className="text-[34px] font-bold text-[#0F172A] leading-none">52</div>
            <div className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-[#10B981]">
              <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+3.6%</span>
              <span className="text-slate-400 font-normal">this month</span>
            </div>
          </div>
        </div>

        {/* Disabled */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Disabled</span>
            <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="mt-3">
            <div className="text-[34px] font-bold text-[#0F172A] leading-none">13</div>
            <div className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-[#EF4444]">
              <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>-7.1%</span>
              <span className="text-slate-400 font-normal">this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 mb-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[280px] max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Module Filter */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "module" ? null : "module")}
              className="inline-flex items-center justify-between gap-3 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span>{moduleFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {openDropdown === "module" && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-30">
                {["All Modules", "AI Services", "Finance", "CRM", "Identity", "Security and Services"].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setModuleFilter(m);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs transition-colors ${
                      moduleFilter === m ? "bg-slate-50 font-semibold text-slate-900" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* License Plan Filter */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "license" ? null : "license")}
              className="inline-flex items-center justify-between gap-3 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span>{licenseFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {openDropdown === "license" && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-30">
                {["All License Plans", "Enterprise", "Premium", "Standard"].map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLicenseFilter(l);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs transition-colors ${
                      licenseFilter === l ? "bg-slate-50 font-semibold text-slate-900" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "status" ? null : "status")}
              className="inline-flex items-center justify-between gap-3 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span>{statusFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {openDropdown === "status" && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-30">
                {["All Status", "Enabled", "Disabled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs transition-colors ${
                      statusFilter === s ? "bg-slate-50 font-semibold text-slate-900" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchQuery("");
              setModuleFilter("All Modules");
              setLicenseFilter("All License Plans");
              setStatusFilter("All Status");
            }}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors px-1 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Main Feature Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-visible shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-6">
        <div className="overflow-x-auto rounded-t-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E2548] text-white text-[11px] font-bold tracking-wider uppercase">
                <th className="py-3 px-6">FEATURE NAME</th>
                <th className="py-3 px-6">MODULE</th>
                <th className="py-3 px-6">LICENSE PLAN</th>
                <th className="py-3 px-6">STATUS</th>
                <th className="py-3 px-6">CONFIGURE</th>
                <th className="py-3 px-6">USAGE</th>
                <th className="py-3 px-6">ACTION</th>
                <th className="py-3 px-3 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-normal">
              {filteredFeatures.map((item) => {
                const isEnabled = item.status === "Enabled";
                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Feature Name */}
                    <td className="py-4 px-6 font-semibold text-[#0F172A]">{item.name}</td>

                    {/* Module */}
                    <td className="py-4 px-6 text-slate-600">{item.module}</td>

                    {/* License Plan */}
                    <td className="py-4 px-6 text-slate-600">{item.licensePlan}</td>

                    {/* Status Pill Badge */}
                    <td className="py-4 px-6">
                      {isEnabled ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#ECFDF5] text-[#059669]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          Enabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FEF2F2] text-[#DC2626]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                          Disabled
                        </span>
                      )}
                    </td>

                    {/* Configure Button Pill */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleOpenConfigure(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 stroke-[1.8]" />
                        <span>Configure</span>
                      </button>
                    </td>

                    {/* Usage Link */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => {
                          setSelectedFeature(item);
                          setIsUsageOpen(true);
                        }}
                        className="text-[#4F46E5] hover:underline font-normal text-xs cursor-pointer"
                      >
                        View Usage
                      </button>
                    </td>

                    {/* Action Button: Enable / Disable */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => openActionModal(item)}
                        className={`px-3.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                          isEnabled
                            ? "border border-[#FCA5A5] text-[#EF4444] bg-white hover:bg-red-50/50"
                            : "border border-[#86EFAC] text-[#10B981] bg-white hover:bg-emerald-50/50"
                        }`}
                      >
                        {isEnabled ? "Disable" : "Enable"}
                      </button>
                    </td>

                    {/* Context Menu 3 Dots */}
                    <td className="py-4 px-3 relative text-right">
                      <button
                        onClick={() => setActiveActionMenuId(activeActionMenuId === item.id ? null : item.id)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeActionMenuId === item.id && (
                        <div className="absolute right-2 top-8 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-40 text-left">
                          <div className="px-3 pb-1 mb-1 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {item.name}
                          </div>
                          <button
                            onClick={() => {
                              setSelectedFeature(item);
                              setIsOrgAccessOpen(true);
                              setActiveActionMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Organization Access</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedFeature(item);
                              setIsHistoryOpen(true);
                              setActiveActionMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <History className="w-3.5 h-3.5 text-slate-400" />
                            <span>View History</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 rounded-b-xl">
          <span>
            Showing <strong className="text-slate-700 font-semibold">1-5</strong> of{" "}
            <strong className="text-slate-700 font-semibold">65</strong> features
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-6 h-6 rounded bg-[#1E2548] text-white font-medium flex items-center justify-center text-xs">
              1
            </button>
            <button className="w-6 h-6 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center text-xs">
              2
            </button>
            <button className="w-6 h-6 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center text-xs">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="w-6 h-6 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center text-xs">
              13
            </button>
            <button className="p-1 rounded border border-slate-200 text-slate-400 hover:bg-slate-50">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Global Action Buttons */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </button>

        <button
          onClick={() => setIsExportOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export report</span>
        </button>
      </div>

      {/* Modals & Dialogs */}
      {/* 1. Disable Feature Modal */}
      {isDisableOpen && selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative border border-slate-100">
            <button
              onClick={() => setIsDisableOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">Disable Feature</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedFeature.name}</p>
              </div>
            </div>

            <div className="mt-4 bg-[#FFF5F5] border border-rose-100 rounded-lg p-3.5 text-xs text-rose-800 leading-relaxed">
              <p className="font-bold text-rose-900 mb-1">Warning: Interruption of Service</p>
              Disabling &ldquo;{selectedFeature.name}&rdquo; will immediately revoke access across all active tenant
              workspaces. Any active API calls, background jobs, or user sessions relying on this feature will be halted.
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsDisableOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleStatus}
                className="px-4 py-2 text-xs font-medium text-white bg-[#DC2626] hover:bg-red-700 rounded-lg transition-colors"
              >
                Disable Feature
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Enable Feature Modal */}
      {isEnableOpen && selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative border border-slate-100">
            <button
              onClick={() => setIsEnableOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">Enable Feature</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedFeature.name}</p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-600 leading-relaxed">
              Are you sure you want to enable the &ldquo;{selectedFeature.name}&rdquo; feature? This will immediately make
              it accessible to all tenant organizations on the {selectedFeature.licensePlan} plan.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsEnableOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleStatus}
                className="px-4 py-2 text-xs font-medium text-white bg-[#10B981] hover:bg-emerald-600 rounded-lg transition-colors"
              >
                Enable Feature
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Export Report Modal */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative border border-slate-100">
            <button
              onClick={() => setIsExportOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900">Export Feature Management Report</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Download comprehensive feature configuration, license tier and usage metrics.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Export Report Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <Pencil className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Export Scope</label>
                  <div className="relative">
                    <select
                      value={exportScope}
                      onChange={(e) => setExportScope(e.target.value)}
                      className="w-full appearance-none pl-3 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                    >
                      <option>All Features (65 records)</option>
                      <option>Enabled Only</option>
                      <option>Disabled Only</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Document Format</label>
                  <div className="relative">
                    <select
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="w-full appearance-none pl-3 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                    >
                      <option>CSV (Comma Separated)</option>
                      <option>PDF Document</option>
                      <option>JSON Format</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Telemetry &amp; Usage Interval</label>
                <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                  {(["Today", "Last 7 Days", "Last 30 Days"] as const).map((interval) => (
                    <button
                      key={interval}
                      onClick={() => setIntervalOption(interval)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                        intervalOption === interval
                          ? "bg-[#1E2548] text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {interval}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Include Data Sections</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dataSections.tenantAdoption}
                      onChange={(e) =>
                        setDataSections({ ...dataSections, tenantAdoption: e.target.checked })
                      }
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>Include tenant adoption, daily calls &amp; latency stats</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dataSections.rateLimits}
                      onChange={(e) =>
                        setDataSections({ ...dataSections, rateLimits: e.target.checked })
                      }
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>Include rate limits, concurrency &amp; governance flags</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dataSections.licenseTier}
                      onChange={(e) =>
                        setDataSections({ ...dataSections, licenseTier: e.target.checked })
                      }
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>Include license tier requirements and feature notes</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsExportOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsExportOpen(false);
                  triggerToast("Export Started", "Your CSV report download is now generating.");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Export</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Configure Feature Modal */}
      {isConfigureOpen && selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative border border-slate-100">
            <button
              onClick={() => setIsConfigureOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900">Configure Feature</h3>
            <p className="text-xs text-slate-500 mt-0.5">Update settings and access for this feature.</p>

            <div className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Feature Name</label>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    value={selectedFeature.name}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Module *</label>
                <div className="relative">
                  <select
                    value={configModule}
                    onChange={(e) => setConfigModule(e.target.value)}
                    className="w-full appearance-none px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option>Identity</option>
                    <option>Workflow</option>
                    <option>AI Services</option>
                    <option>Analytics</option>
                    <option>Integration</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <div className="relative">
                  <select
                    value={configStatus}
                    onChange={(e) => setConfigStatus(e.target.value as FeatureStatus)}
                    className="w-full appearance-none px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="Enabled">• Enabled</option>
                    <option value="Disabled">• Disabled</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">License Plan *</label>
                <div className="relative">
                  <select
                    value={configPlan}
                    onChange={(e) => setConfigPlan(e.target.value as LicensePlan)}
                    className="w-full appearance-none px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="Premium">Premium</option>
                    <option value="Standard">Standard</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Access Scope</label>
                <div className="relative">
                  <select className="w-full appearance-none px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none">
                    <option>All Organizations</option>
                    <option>Selected Organizations</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span>12 organizations selected</span>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsConfigureOpen(false);
                      setIsOrgAccessOpen(true);
                    }}
                    className="text-indigo-600 font-medium hover:underline cursor-pointer"
                  >
                    Manage Access
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Feature Configuration</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setConfigToggle(!configToggle)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      configToggle ? "bg-slate-900" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        configToggle ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className="text-xs text-slate-700 font-medium">
                    {configToggle ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className="bg-[#EEF2FF] border border-indigo-100 rounded-lg p-3 text-[11px] text-indigo-700 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                <span>Changes are validated before saving and recorded in the Audit Log.</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsConfigureOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfigure}
                className="px-4 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Feature Usage Monitoring Modal */}
      {isUsageOpen && selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 relative border border-slate-100">
            <button
              onClick={() => setIsUsageOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900">Feature Usage Monitoring</h3>
            <p className="text-xs text-slate-500 mt-0.5">View usage and adoption details for this feature.</p>

            <div className="mt-3.5 flex flex-wrap items-center gap-4 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 text-xs text-slate-600">
              <span><strong>Feature:</strong> {selectedFeature.name}</span>
              <span><strong>Module:</strong> {selectedFeature.module}</span>
              <span><strong>Plan:</strong> {selectedFeature.licensePlan}</span>
              <span className="flex items-center gap-1.5">
                <strong>Status:</strong>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                {selectedFeature.status}
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Usage Summary</span>
              <div className="grid grid-cols-4 gap-2.5 mt-2">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
                  <span className="text-[11px] text-slate-500">Active Orgs</span>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">12</div>
                  <span className="text-[10px] text-emerald-600 font-medium">↑ +8.3%</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
                  <span className="text-[11px] text-slate-500">Active Users</span>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">1,248</div>
                  <span className="text-[10px] text-emerald-600 font-medium">↑ +12.1%</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
                  <span className="text-[11px] text-slate-500">Total Usage</span>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">3,582</div>
                  <span className="text-[10px] text-emerald-600 font-medium">↑ +5.7%</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
                  <span className="text-[11px] text-slate-500">Adoption Rate</span>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">67%</div>
                  <span className="text-[10px] text-emerald-600 font-medium">↑ +3.2%</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Usage Trend</span>
              <div className="mt-2 bg-[#FAFBFD] border border-slate-200/80 rounded-lg p-3">
                <div className="relative h-24 w-full">
                  <svg className="w-full h-full" viewBox="0 0 400 90" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="2.5"
                      points="10,60 70,50 130,55 190,30 250,25 310,38 390,15"
                    />
                    {[
                      { cx: 10, cy: 60 },
                      { cx: 70, cy: 50 },
                      { cx: 130, cy: 55 },
                      { cx: 190, cy: 30 },
                      { cx: 250, cy: 25 },
                      { cx: 310, cy: 38 },
                      { cx: 390, cy: 15 },
                    ].map((dot, idx) => (
                      <circle key={idx} cx={dot.cx} cy={dot.cy} r="3" fill="#4F46E5" />
                    ))}
                  </svg>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-2 px-1">
                  <span>Aug 21</span>
                  <span>Aug 22</span>
                  <span>Aug 23</span>
                  <span>Aug 24</span>
                  <span>Aug 25</span>
                  <span>Aug 26</span>
                  <span>Aug 27</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Recent Activity</span>
              <div className="mt-2 divide-y divide-slate-100 border border-slate-200/80 rounded-lg overflow-hidden">
                <div className="p-2.5 bg-white flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 block">Acme Corporation</span>
                    <span className="text-slate-400 text-[11px]">428 activities</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">2 min ago</span>
                </div>
                <div className="p-2.5 bg-white flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 block">Globex Industries</span>
                    <span className="text-slate-400 text-[11px]">316 activities</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">18 min ago</span>
                </div>
                <div className="p-2.5 bg-white flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 block">Initech Solutions</span>
                    <span className="text-slate-400 text-[11px]">284 activities</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">42 min ago</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setIsUsageOpen(false)}
                className="px-5 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Organization Access Modal */}
      {isOrgAccessOpen && selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOrgAccessOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900">Organization Access</h3>
            <p className="text-xs text-slate-500 mt-0.5">Control which organizations can access this feature.</p>

            <div className="mt-5">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                ORGANIZATION ACCESS
              </label>
              <div className="border border-slate-200 rounded-lg p-3 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="scope_radio"
                    checked={orgScope === "all"}
                    onChange={() => setOrgScope("all")}
                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">All Organizations</span>
                    <span className="text-[11px] text-slate-500">Enable this feature for all organizations.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer select-none border-t border-slate-100 pt-3">
                  <input
                    type="radio"
                    name="scope_radio"
                    checked={orgScope === "selected"}
                    onChange={() => setOrgScope("selected")}
                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Selected Organizations</span>
                    <span className="text-[11px] text-slate-500">
                      Enable this feature only for selected organizations.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {orgScope === "selected" && (
              <div className="mt-3 border border-slate-200 rounded-lg p-3 bg-slate-50/60">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search organizations..."
                      value={orgSearch}
                      onChange={(e) => setOrgSearch(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    onClick={() =>
                      setSelectedOrgs(
                        selectedOrgs.length === TENANTS_DATA.length ? [] : TENANTS_DATA.map((t) => t.id)
                      )
                    }
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                  >
                    {selectedOrgs.length === TENANTS_DATA.length ? "Deselect All" : "Select All"}
                  </button>
                </div>

                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {TENANTS_DATA.filter((t) =>
                    t.name.toLowerCase().includes(orgSearch.toLowerCase())
                  ).map((org) => {
                    const isChecked = selectedOrgs.includes(org.id);
                    return (
                      <div
                        key={org.id}
                        onClick={() =>
                          setSelectedOrgs((prev) =>
                            isChecked ? prev.filter((id) => id !== org.id) : [...prev, org.id]
                          )
                        }
                        className="flex items-center justify-between p-2 rounded-md hover:bg-white cursor-pointer transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isChecked
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="font-medium text-slate-800">{org.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-500">{org.plan}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="text-[11px] text-slate-500 mt-2">
                  {selectedOrgs.length} of {TENANTS_DATA.length} organizations selected
                </div>
              </div>
            )}

            <div className="mt-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                ACCESS SUMMARY
              </span>
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/60 text-xs">
                <div className="grid grid-cols-4 gap-2 font-semibold text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                  <div>FEATURE</div>
                  <div>LICENSE PLAN</div>
                  <div>SELECTED ORGANIZATIONS</div>
                  <div>LAST UPDATED</div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-slate-800 font-medium pt-1.5 border-t border-slate-200/80">
                  <div>{selectedFeature.name}</div>
                  <div>{selectedFeature.licensePlan}</div>
                  <div>{orgScope === "all" ? "All" : `${selectedOrgs.length} of 12`}</div>
                  <div className="text-slate-500 font-normal">14 Aug 2026, 10:42 AM</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                {orgScope === "all"
                  ? "All organizations on the enterprise plan will have access."
                  : "Only selected organizations will have access to this feature."}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsOrgAccessOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsOrgAccessOpen(false);
                  triggerToast("Access Rules Updated", "Tenant access configuration saved successfully.");
                }}
                className="px-4 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Change History Modal */}
      {isHistoryOpen && selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsHistoryOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900">Change History</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              View previous feature changes and restore an earlier configuration.
            </p>

            <div className="mt-4 flex items-center gap-10 text-xs border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">FEATURE</span>
                <span className="font-semibold text-slate-800">{selectedFeature.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">MODULE</span>
                <span className="text-slate-600">{selectedFeature.module}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">CURRENT STATUS</span>
                <span className="font-semibold text-emerald-600">{selectedFeature.status}</span>
              </div>
            </div>

            <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#1E2548] text-white text-[10px] font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-4">CHANGE</th>
                    <th className="py-2.5 px-4">PREVIOUS VALUE</th>
                    <th className="py-2.5 px-4">NEW VALUE</th>
                    <th className="py-2.5 px-4">CHANGED BY</th>
                    <th className="py-2.5 px-4">CHANGED ON</th>
                    <th className="py-2.5 px-4 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {INITIAL_HISTORY.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-medium text-slate-900">{item.change}</td>
                      <td className="py-3 px-4 text-slate-600">{item.prevValue}</td>
                      <td className="py-3 px-4 text-slate-600">{item.newValue}</td>
                      <td className="py-3 px-4 text-slate-600">{item.changedBy}</td>
                      <td className="py-3 px-4 text-slate-500">{item.changedOn}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedHistoryItem(item);
                            setIsRollbackOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50 text-slate-700 font-medium transition-colors cursor-pointer"
                        >
                          Rollback
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-400 mt-2.5">Changes are recorded in the Audit Log.</p>
          </div>
        </div>
      )}

      {/* 8. Rollback Feature Change Confirmation Modal */}
      {isRollbackOpen && selectedFeature && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/45 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative border border-slate-100">
            <button
              onClick={() => setIsRollbackOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">Rollback Feature Change</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedFeature.name}</p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-600 leading-relaxed">
              Are you sure you want to rollback this feature to its previous configuration?
            </p>

            <div className="mt-3 bg-[#FFF5F5] border border-rose-100 rounded-lg p-3 text-xs text-rose-800 leading-relaxed">
              <span className="font-bold text-rose-900">Warning:</span> This action will restore the previous configuration
              and may affect feature availability for organizations using this feature.
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsRollbackOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRollback}
                className="px-4 py-2 text-xs font-medium text-white bg-[#DC2626] hover:bg-red-700 rounded-lg transition-colors"
              >
                Rollback Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}