import {
  ArrowDown01Icon,
  Calendar01Icon,
  GridTableIcon,
  Mail01Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface Stat {
  label: string;
  value: string;
  note: string;
}

interface SidebarItem {
  label: string;
  icon: typeof GridTableIcon;
  active?: boolean;
}

interface VelocityBar {
  total: number; // % of chart height
  done: number; // % of chart height
}

interface Activity {
  initials: string;
  text: string;
  time: string;
}

const STATS: Stat[] = [
  { label: 'Active projects', value: '08', note: '+2 this month' },
  { label: 'Team members', value: '12', note: '3 online now' },
  { label: 'Open tasks', value: '47', note: '11 due this week' },
  { label: 'Completion', value: '74%', note: '+8% from August' },
];

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Overview', icon: GridTableIcon, active: true },
  { label: 'Projects', icon: Calendar01Icon },
  { label: 'Members', icon: UserGroupIcon },
  { label: 'Invitations', icon: Mail01Icon },
];

const VELOCITY: VelocityBar[] = [
  { total: 40, done: 10 },
  { total: 54, done: 15 },
  { total: 47, done: 12 },
  { total: 68, done: 27 },
  { total: 61, done: 20 },
  { total: 82, done: 43 },
  { total: 75, done: 34 },
  { total: 100, done: 68 },
];

const ACTIVITY: Activity[] = [
  { initials: 'PN', text: 'Priya completed a task', time: '2m' },
  { initials: 'MW', text: 'Marcus added a milestone', time: '18m' },
  { initials: 'EK', text: 'Elena invited a member', time: '1h' },
];

export default function DashboardPreview() {
  return (
    <div
      className="overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-2xl shadow-black/60"
      role="img"
      aria-label="Preview of the Workspora dashboard for the Axiom Labs workspace"
    >
      {/* Window chrome */}
      <div className="relative flex items-center border-b border-white/[0.07] px-5 py-4">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 bg-white/20" />
          <span className="h-2.5 w-2.5 bg-white/20" />
          <span className="h-2.5 w-2.5 bg-accent" />
        </div>
        <p className="absolute left-1/2 -translate-x-1/2 font-mono text-xs text-gray-600">
          app.workspora.com / axiom-labs
        </p>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-white/[0.07] p-4 lg:flex">
          <div>
            <div className="mb-5 flex items-center gap-3 border border-white/10 p-2.5">
              <span className="flex h-8 w-8 items-center justify-center bg-accent/20 text-sm font-semibold text-accent">
                A
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  Axiom Labs
                </p>
                <p className="text-xs text-gray-500">12 members</p>
              </div>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={16}
                className="text-gray-400"
              />
            </div>

            <ul className="flex flex-col gap-1 list-none">
              {SIDEBAR_ITEMS.map(({ label, icon, active }) => (
                <li
                  key={label}
                  className={`flex items-center gap-3 px-3 py-3 text-sm ${
                    active
                      ? 'border-l-2 border-accent bg-accent/10 text-accent'
                      : 'border-l-2 border-transparent text-gray-500'
                  }`}
                >
                  <HugeiconsIcon icon={icon} size={18} />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 border-t border-white/[0.07] pt-4">
            <span className="flex h-8 w-8 items-center justify-center bg-accent/20 text-xs font-medium text-accent">
              EK
            </span>
            <div>
              <p className="text-sm text-gray-300">Elena Kovacs</p>
              <p className="text-xs text-gray-600">Owner</p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1 p-5 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Good morning, Elena
              </h3>
              <p className="mt-1.5 text-sm text-gray-500">
                Here&apos;s what&apos;s happening across your workspace.
              </p>
            </div>
            <span className="shrink-0 bg-accent px-4 py-2 text-xs font-semibold text-gray-950 sm:text-sm">
              + New project
            </span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {STATS.map(({ label, value, note }) => (
              <div key={label} className="border border-white/8 p-4 sm:p-5">
                <p className="text-[11px] uppercase tracking-widest text-gray-500">
                  {label}
                </p>
                <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                  {value}
                </p>
                <p className="mt-2 text-xs text-accent/80">{note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-[1.5fr_1fr]">
            {/* Velocity */}
            <div className="border border-white/8">
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
                <p className="text-sm font-medium text-white">
                  Project velocity
                </p>
                <p className="text-[11px] uppercase tracking-widest text-gray-600">
                  Last 8 weeks
                </p>
              </div>
              <div className="flex h-64 items-end gap-3 px-3 pt-6 sm:gap-4">
                {VELOCITY.map(({ total, done }, i) => (
                  <div
                    key={i}
                    className="relative flex-1 bg-white/8"
                    style={{ height: `${total}%` }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-accent/90"
                      style={{ height: `${(done / total) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div className="border border-white/8">
              <div className="border-b border-white/8 px-5 py-4">
                <p className="text-sm font-medium text-white">
                  Recent activity
                </p>
              </div>
              <ul className="flex flex-col gap-4 p-5 list-none">
                {ACTIVITY.map(({ initials, text, time }) => (
                  <li key={text} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-accent/20 text-[11px] font-medium text-accent">
                      {initials}
                    </span>
                    <p className="flex-1 truncate text-sm text-gray-400">
                      {text}
                    </p>
                    <span className="text-xs text-gray-600">{time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
