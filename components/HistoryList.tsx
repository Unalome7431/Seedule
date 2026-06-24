import React from "react";
import { Sprout, RefreshCw, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HistoryItem {
  id: string;
  type: "lahan" | "rotasi";
  title: string;
  timestamp: Date;
  summary: string;
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
                "w-full text-left rounded-lg transition-all duration-200 flex items-center gap-3",
                compact ? "p-2 justify-center" : "p-3 hover:bg-sage-100/50",
                isActive
                  ? "bg-sage-100 text-sage-800 font-medium border-l-4 border-primary-500 pl-2"
                  : "text-sage-600 hover:text-sage-900"
              )}
              title={`${item.title} - ${item.summary}`}
            >
              <div
                className={cn(
                  "p-1.5 rounded-md flex-shrink-0",
                  isLahan
                    ? "bg-primary-100 text-primary-700"
                    : "bg-sage-200 text-sage-700"
                )}
              >
                {isLahan ? (
                  <Sprout className="w-4 h-4" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </div>

              {!compact && (
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <p className="text-sm font-semibold truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-sage-400 whitespace-nowrap">
                      {item.timestamp.toLocaleDateString("id-ID", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-sage-500 truncate mt-0.5">
                    {item.summary}
                  </p>
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
