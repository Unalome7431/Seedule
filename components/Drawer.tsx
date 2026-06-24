import React from "react";
import { Sprout, RefreshCw, BookOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";
import HistoryList, { HistoryItem } from "./HistoryList";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: "lahan" | "rotasi" | "katalog";
  onViewChange: (view: "lahan" | "rotasi" | "katalog") => void;
  historyItems: HistoryItem[];
  activeHistoryId?: string;
  onSelectHistory: (item: HistoryItem) => void;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  currentView,
  onViewChange,
  historyItems,
  activeHistoryId,
  onSelectHistory,
}) => {
  const menuItems = [
    {
      id: "lahan" as const,
      label: "Konsultasi Lahan",
      icon: Sprout,
      description: "Analisis kecocokan lahan",
    },
    {
      id: "rotasi" as const,
      label: "Penjadwalan Rotasi",
      icon: RefreshCw,
      description: "Rencana perputaran bibit",
    },
    {
      id: "katalog" as const,
      label: "Katalog Referensi",
      icon: BookOpen,
      description: "Informasi tanaman lengkap",
    },
  ];

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 md:hidden transition-all duration-300 pointer-events-none",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
      )}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Sliding Sheet */}
      <div
        className={cn(
          "absolute top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white border-r border-sage-200 shadow-2xl flex flex-col transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sage-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-primary-100 text-primary-600 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="font-sans font-bold text-lg text-sage-900">
              Seedule
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-sage-500 hover:bg-sage-100 hover:text-sage-900 focus:outline-none"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Navigation Content */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl p-3 transition-all duration-200 text-left",
                    isActive
                      ? "bg-primary-600 text-white font-semibold shadow-md shadow-primary-600/10"
                      : "text-sage-600 hover:bg-sage-100/50 hover:text-sage-900"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-sage-500")} />
                  <div>
                    <span className="text-sm block">{item.label}</span>
                    <span className={cn("text-[10px] block mt-0.5 font-normal", isActive ? "text-primary-100" : "text-sage-400")}>
                      {item.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* History Section */}
          <div className="border-t border-sage-200/60 pt-4">
            <HistoryList
              items={historyItems}
              onSelect={(item) => {
                onSelectHistory(item);
                onClose();
              }}
              activeId={activeHistoryId}
              compact={false}
            />
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-sage-100 bg-sage-50/50 text-center">
          <p className="text-[10px] text-sage-400 font-medium">Seedule v1.0.0 — AgriTech System</p>
        </div>
      </div>
    </div>
  );
};
export default Drawer;
