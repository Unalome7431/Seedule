import React from "react";
import { Sprout, RefreshCw, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HistoryItem {
  id: string;
  type: "lahan" | "rotasi";
  title: string;
  timestamp: Date;
  summary: string;
  resultData?: any;
}

interface HistoryListProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  activeId?: string;
  compact?: boolean;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  items,
  onSelect,
  activeId,
  compact = false,
}) => {
  if (items.length === 0) {
    return (
      <div className={cn("text-center py-6 px-4", compact ? "hidden" : "block")}>
        <Calendar className="w-8 h-8 text-sage-300 mx-auto mb-2" />
        <p className="text-xs text-sage-500">Belum ada riwayat konsultasi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {!compact && (
        <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-sage-400">
          Riwayat Konsultasi
        </h3>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = item.id === activeId;
          const isLahan = item.type === "lahan";

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={cn(
                "w-full text-left rounded-lg transition-all duration-205 flex items-center gap-2",
                compact ? "p-1.5 justify-center" : "py-1.5 px-2.5 hover:bg-sage-100/40",
                isActive
                  ? "bg-sage-100 text-sage-800 font-semibold border-l-4 border-primary-500 pl-1.5"
                  : "text-sage-600 hover:text-sage-900"
              )}
              title={item.title}
            >
              <div
                className={cn(
                  "p-1 rounded-md flex-shrink-0",
                  isLahan
                    ? "bg-primary-100 text-primary-700"
                    : "bg-sage-200 text-sage-700"
                )}
              >
                {isLahan ? (
                  <Sprout className="w-3.5 h-3.5" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
              </div>

              {!compact && (
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-1">
                    <p className="text-xs font-semibold truncate leading-none">
                      {item.title}
                    </p>
                    <span className="text-[9px] text-sage-400 whitespace-nowrap leading-none">
                      {item.timestamp.toLocaleDateString("id-ID", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              )}

              {!compact && (
                <ChevronRight className="w-4 h-4 text-sage-300 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default HistoryList;
