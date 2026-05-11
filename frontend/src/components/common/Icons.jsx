const base = "h-4 w-4";

export const BellIcon = ({ className = base }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 19a2.5 2.5 0 0 0 5 0" />
  </svg>
);

export const SearchIcon = ({ className = base }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m20 20-3.5-3.5" />
  </svg>
);

export const PrinterIcon = ({ className = base }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 8V4h10v4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17h10v3H7z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 16H5a2 2 0 0 1-2-2v-4a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v4a2 2 0 0 1-2 2h-1" />
  </svg>
);

export const ZoomIcon = ({ className = base }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m20 20-3.5-3.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 8v6M8 11h6" />
  </svg>
);

export const PlusIcon = ({ className = base }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
  </svg>
);

export const TrashIcon = ({ className = base }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7l1 13h10l1-13" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v5M14 11v5" />
  </svg>
);

export const BriefcaseIcon = ({ className = base }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6h6a2 2 0 0 1 2 2v2H7V8a2 2 0 0 1 2-2Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6" />
  </svg>
);

export const UsersIcon = ({ className = base }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />
    <circle cx="11" cy="7" r="3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 20v-1a3 3 0 0 0-2-2.82" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 4.18a3 3 0 0 1 0 5.64" />
  </svg>
);

export const FileTextIcon = ({ className = base }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6M9 17h6M9 9h2" />
  </svg>
);

export const GridIcon = ({ className = base }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
  </svg>
);

export const SettingsIcon = ({ className = base }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.9 1.9 0 0 0 .38 2.09l.06.06a2.3 2.3 0 1 1-3.25 3.25l-.06-.06a1.9 1.9 0 0 0-2.09-.38 1.9 1.9 0 0 0-1.15 1.74V22a2.3 2.3 0 1 1-4.6 0v-.2a1.9 1.9 0 0 0-1.15-1.74 1.9 1.9 0 0 0-2.09.38l-.06.06A2.3 2.3 0 1 1 4.2 16.95l.06-.06A1.9 1.9 0 0 0 4.64 15a1.9 1.9 0 0 0-1.74-1.15H2a2.3 2.3 0 1 1 0-4.6h.2A1.9 1.9 0 0 0 3.94 8.1a1.9 1.9 0 0 0-.38-2.09l-.06-.06A2.3 2.3 0 1 1 6.75 2.7l.06.06A1.9 1.9 0 0 0 8.9 3.14 1.9 1.9 0 0 0 10.05 1.4V1a2.3 2.3 0 1 1 4.6 0v.2a1.9 1.9 0 0 0 1.15 1.74 1.9 1.9 0 0 0 2.09-.38l.06-.06A2.3 2.3 0 1 1 21.3 6.75l-.06.06A1.9 1.9 0 0 0 20.86 8.9a1.9 1.9 0 0 0 1.74 1.15H23a2.3 2.3 0 1 1 0 4.6h-.2A1.9 1.9 0 0 0 21.06 15Z" />
  </svg>
);

export const Avatar = ({ className = "" }) => (
  <div className={`grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600 ${className}`}>AM</div>
);
