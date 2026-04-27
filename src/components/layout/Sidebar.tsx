"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/map",
    label: "Map",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
  },
  {
    href: "/volunteers",
    label: "Volunteers",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    href: "/resources",
    label: "Resources",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </svg>
    ),
  },
  {
    href: "/insights",
    label: "Insights",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
  href: "/reports",
  label: "Reports",
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </svg>
  ),
},
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[88px] flex-shrink-0 flex-col border-r border-[#243d28] bg-[#1a2e1d]">
      <div className="flex h-16 flex-shrink-0 items-center justify-center border-b border-[#243d28]">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2e5233] shadow-sage">
          <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
            <path d="M10 2L17 5.5V14.5L10 18L3 14.5V5.5L10 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="10" cy="10" r="2.5" fill="white" />
          </svg>
        </div>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-1 px-2 py-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("sidebar-item", active && "active")}
            >
              {item.icon}
              <span className="sidebar-item-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-3 border-t border-[#243d28] px-2 pb-4 pt-2">
        <Link href="/support" className="sidebar-item" title="Help & Support">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="sidebar-item-label text-center">Help</span>
        </Link>

        <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-[#6B9E73] bg-[#4d7c56] text-sm font-bold text-white transition-colors hover:border-white">
          A
        </div>
      </div>
    </aside>
  );
}