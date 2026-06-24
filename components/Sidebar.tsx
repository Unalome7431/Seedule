import React from "react";
import { Sprout, RefreshCw, BookOpen, ChevronLeft, ChevronRight, History, LogOut, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import HistoryList, { HistoryItem } from "./HistoryList";

interface SidebarProps {
  currentView: "lahan" | "rotasi" | "katalog";
  onViewChange: (view: "lahan" | "rotasi" | "katalog") => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  historyItems: HistoryItem[];
  activeHistoryId?: string;
  onSelectHistory: (item: HistoryItem) => void;
  userSession: { name?: string | null; email?: string | null } | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isCollapsed,
  onToggleCollapse,
  historyItems,
  activeHistoryId,
  onSelectHistory,
  userSession,
  onLoginClick,
  onLogoutClick,
}) => {
  const menuItems = [
    {
      id: "lahan" as const,
      label: "Konsultasi Lahan",
      icon: Sprout,
      description: "Analisis kecocokan tanaman berdasarkan kondisi tanah.",
    },
    {
      id: "rotasi" as const,
      label: "Penjadwalan Rotasi",
      icon: RefreshCw,
      description: "Rencana perputaran jenis bibit & evaluasi risiko.",
    },
    {
      id: "katalog" as const,
      label: "Katalog Referensi",
      icon: BookOpen,
      description: "Informasi detail kriteria & varietas tanaman.",
    },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 border-r border-sage-200 bg-sage-50/40 transition-all duration-300 z-20 flex-shrink-0",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sage-200">
        <div className={cn("flex items-center gap-2", isCollapsed && "justify-center w-full")}>
          <div className="p-2 rounded bg-primary-100 text-primary-600 flex items-center justify-center">
            <Sprout className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="font-sans font-bold text-lg text-sage-900 tracking-tight">
              Seedule
            </span>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl p-3 transition-all duration-200 text-left group",
                  isActive
                    ? "bg-primary-600 text-white shadow-md shadow-primary-600/10 font-semibold"
                    : "text-sage-600 hover:bg-sage-100/50 hover:text-sage-900"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "text-sage-500 group-hover:text-sage-700")} />
                {!isCollapsed && (
                  <div>
                    <span className="text-sm block">{item.label}</span>
                    <span className={cn("text-[10px] block mt-0.5 line-clamp-1 font-normal", isActive ? "text-primary-100" : "text-sage-400")}>
                      {item.description}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* History Section */}
        <div className="border-t border-sage-200/60 pt-4">
          {isCollapsed ? (
            <div className="flex justify-center" title="Riwayat Konsultasi">
              <History className="w-5 h-5 text-sage-400" />
            </div>
          ) : (
            <HistoryList
              items={historyItems}
              onSelect={onSelectHistory}
              activeId={activeHistoryId}
              compact={false}
            />
          )}
        </div>
      </div>

      {/* Sidebar Footer / Profile & Auth */}
      <div className="border-t border-sage-200 bg-sage-50/20 p-3 space-y-3">
        {/* Profile Card / Login Button */}
        {userSession ? (
          <div className={cn("flex items-center gap-2", isCollapsed ? "justify-center" : "px-1")}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white font-bold text-sm flex-shrink-0">
              {userSession.name ? userSession.name.charAt(0).toUpperCase() : "U"}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-sage-800 truncate leading-tight">
                  {userSession.name}
                </p>
                <p className="text-[10px] text-sage-505 truncate mt-0.5">
                  {userSession.email}
                </p>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={onLogoutClick}
                className="p-1.5 text-sage-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors focus:outline-none cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 py-2.5 text-xs cursor-pointer shadow-sm",
              isCollapsed && "px-0"
            )}
            title={isCollapsed ? "Login" : undefined}
          >
            <UserIcon className="w-4 h-4" />
            {!isCollapsed && <span>Login / Daftar</span>}
          </button>
        )}

        {/* Collapse Trigger */}
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2.5 rounded-lg border border-sage-200 text-sage-500 hover:text-sage-900 hover:bg-sage-100/50 transition-all duration-200 cursor-pointer"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Sembunyikan Menu</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
