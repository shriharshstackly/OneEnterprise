import { useMemo, useState } from "react";
import {
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  Download,
  FolderPlus,
  KeyRound,
  RefreshCw,
  Search,
  TriangleAlert,
} from "lucide-react";

/**
 * Self-contained License Management screen.
 * No Material UI, no external CSS — Tailwind utility classes only.
 * Drop it inside your existing layout (sidebar + header stay yours).
 */

export type LicenseStatus = "Active" | "Expiring" | "Rejected";

export type LicenseRow = {
  id: number;
  key: string;
  plan: string;
  seats: string;
  organization: string;
  expiry: string;
  status: LicenseStatus;
};

const defaultRows: LicenseRow[] = [
  { id: 1, key: "LIC-4421-MNPR", plan: "Standard", seats: "50 Seats", organization: "123 Inc", expiry: "Nov 02, 2024", status: "Active" },
  { id: 2, key: "LIC-4421-MNPR", plan: "Standard", seats: "50 Seats", organization: "123 Inc", expiry: "Nov 02, 2024", status: "Expiring" },
  { id: 3, key: "LIC-4421-MNPR", plan: "Standard", seats: "50 Seats", organization: "123 Inc", expiry: "Nov 02, 2024", status: "Expiring" },
  { id: 4, key: "LIC-4421-MNPR", plan: "Standard", seats: "50 Seats", organization: "123 Inc", expiry: "Nov 02, 2024", status: "Rejected" },
];

const stats = [
  { label: "Total Licenses", value: "2,458", note: "12% vs last month", icon: KeyRound, iconClass: "bg-blue-50 text-blue-600", noteClass: "text-emerald-600" },
  { label: "Active Licenses", value: "2,104", note: "85.6% utilization rate", icon: CheckCircle2, iconClass: "bg-emerald-50 text-emerald-600", noteClass: "text-slate-400" },
  { label: "Expired licenses", value: "142", note: "Within next 30 days", icon: TriangleAlert, iconClass: "bg-amber-50 text-amber-600", noteClass: "text-slate-400" },
  { label: "Suspended licenses", value: "36", note: "Requires admin review", icon: Ban, iconClass: "bg-red-50 text-red-600", noteClass: "text-slate-400" },
] as const;

const statusStyles: Record<LicenseStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Expiring: "bg-amber-50 text-amber-700 ring-amber-200",
  Rejected: "bg-red-50 text-red-700 ring-red-200",
};

const dotStyles: Record<LicenseStatus, string> = {
  Active: "bg-emerald-500",
  Expiring: "bg-amber-500",
  Rejected: "bg-red-500",
};

export default function LicenseManagement({ rows = defaultRows }: { rows?: LicenseRow[] }) {
  const [search, setSearch] = useState("");
  const [organization, setOrganization] = useState("all");
  const [licenseType, setLicenseType] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const matchesSearch = `${row.key} ${row.organization} ${row.plan}`
          .toLowerCase()
          .includes(search.toLowerCase());
        return (
          matchesSearch &&
          (organization === "all" || row.organization === organization) &&
          (licenseType === "all" || row.plan === licenseType) &&
          (status === "all" || row.status === status)
        );
      }),
    [rows, search, organization, licenseType, status],
  );

  // const allSelected =
  //   filteredRows.length > 0 && filteredRows.every((row) => selected.includes(row.id));

  // const toggleAll = () => setSelected(allSelected ? [] : filteredRows.map((r) => r.id));
  const toggleRow = (id: number) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((i) => i !== id) : [...cur, id]));

  return (
    <div className="w-full bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
        <header>
          <h1 className="text-xl font-semibold">License Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage platform licenses across organizations and tenants
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, note, icon: Icon, iconClass, noteClass }) => (
            <article
              key={label}
              className="rounded-xl border border-slate-200 bg-[#FFFFFF] p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm text-slate-500">{label}</span>
                <span className={`grid h-8 w-8 place-items-center rounded-lg ${iconClass}`}>
                  <Icon size={16} strokeWidth={1.8} />
                </span>
              </div>
              <strong className="mt-3 block text-2xl font-semibold">{value}</strong>
              <small className={`mt-1 block text-xs ${noteClass}`}>
                {label === "Total Licenses" ? "↑ " : ""}
                {note}
              </small>
            </article>
          ))}
        </div>

        <h2 className="text-base font-semibold">License List</h2>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4">
            <label className="relative flex-1 min-w-[220px]">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                aria-label="Search licenses"
                className="h-9 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <FilterSelect label="Organization" value={organization} onChange={setOrganization} options={["123 Inc"]} />
            <FilterSelect label="License Type" value={licenseType} onChange={setLicenseType} options={["Standard"]} />
            <FilterSelect label="Status" value={status} onChange={setStatus} options={["Active", "Expiring", "Rejected"]} />

            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1976D2] px-4 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <FolderPlus size={15} />
              Create License
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#232A5C] text-xs font-medium uppercase tracking-wide text-[#FFFFFF]">
                  {/* <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      aria-label="Select all licenses"
                      className="h-4 w-4 accent-blue-600"
                    />
                  </th> */}
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3">License Key</th>
                  <th className="px-4 py-3">Organization Plan</th>
                  <th className="px-4 py-3">License Type</th>
                  <th className="px-4 py-3">Expiry Date</th>
                  <th className="px-4 py-3">License Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(row.id)}
                        onChange={() => toggleRow(row.id)}
                        aria-label={`Select ${row.key}`}
                        className="h-4 w-4 accent-blue-600"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{row.key}</td>
                    <td className="px-4 py-3">
                      <span className="block font-medium text-slate-800">{row.plan}</span>
                      <span className="block text-xs text-slate-400">{row.seats}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.organization}</td>
                    <td className="px-4 py-3 text-slate-600">{row.expiry}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[row.status]}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[row.status]}`} />
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                      No licenses match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 p-4">
            <div className="flex flex-wrap gap-2">
              <SecondaryButton icon={<RefreshCw size={15} />}>Renew</SecondaryButton>
              <SecondaryButton icon={<Ban size={15} />}>Suspend</SecondaryButton>
              <SecondaryButton icon={<CirclePlay size={15} />}>Activate</SecondaryButton>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500">Showing 1 to 5 of 2,458 entries</span>
              <Pagination page={page} count={3} onChange={setPage} />
            </div>
          </div>
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <SecondaryButton icon={<RefreshCw size={15} />}>Refresh</SecondaryButton>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1976D2] px-4 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Download size={15} />
            Export report
          </button>
        </div>
      </div>
    </div>
  );
}

function SecondaryButton({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-2 rounded-sm border border-[#1976D2]  bg-white px-3 text-sm font-medium text-[#1976D2]  transition hover:bg-slate-50"
    >
      {icon}
      {children}
    </button>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="h-9 min-w-[150px] rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    >
      <option value="all">{label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function Pagination({
  page,
  count,
  onChange,
}: {
  page: number;
  count: number;
  onChange: (page: number) => void;
}) {
  const pages = Array.from({ length: count }, (_, i) => i + 1);
  const base =
    "grid h-8 min-w-8 place-items-center rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-40";
  return (
    <nav className="flex items-center gap-1" aria-label="Pagination">
      <button type="button" className={base} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft size={15} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={
            p === page
              ? "grid h-8 min-w-8 place-items-center rounded-md border border-blue-600 bg-[#1976D2] px-2 text-sm font-medium text-white"
              : base
          }
        >
          {p}
        </button>
      ))}
      <button type="button" className={base} disabled={page === count} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRight size={15} />
      </button>
    </nav>
  );
}
