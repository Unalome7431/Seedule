import React from "react";
import { Menu, User, LogOut, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  currentView: "lahan" | "rotasi" | "katalog";
  userSession: { name?: string | null; email?: string | null } | null;
  onMenuClick: () => void;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  userSession,
  onMenuClick,
  onLoginClick,
  onLogoutClick,
}) => {
  const getTitle = () => {
    switch (currentView) {
      case "lahan":
        return "Konsultasi Kesesuaian Lahan";
      case "rotasi":
        return "Penjadwalan Rotasi Tanam";
      case "katalog":
        return "Katalog Referensi Tanaman";
      default:
        return "Seedule";
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-sage-200 bg-background/95 px-4 backdrop-blur-md md:px-6">
      {/* Left side: Hamburger (mobile) + App Logo (mobile) + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-sage-100/70 focus:outline-none focus:ring-2 focus:ring-primary-500 md:hidden"
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5 text-sage-700" />
        </button>

        <div className="flex items-center gap-1.5 md:hidden">
          <div className="p-1 rounded bg-primary-100 text-primary-600">
            <Sprout className="w-4 h-4" />
          </div>
          <span className="font-sans font-bold text-sm text-sage-800">Seedule</span>
        </div>

        {/* Desktop breadcrumb / Page Title */}
        <h1 className="hidden text-lg font-bold tracking-tight text-sage-900 md:block font-sans">
          {getTitle()}
        </h1>
      </div>

      {/* Mobile Title (Centered or simple) */}
      <h1 className="text-sm font-bold text-sage-900 md:hidden absolute left-1/2 -translate-x-1/2">
        {getTitle() === "Konsultasi Kesesuaian Lahan" ? "Kesesuaian Lahan" : getTitle() === "Penjadwalan Rotasi Tanam" ? "Rotasi Tanam" : "Katalog Tanaman"}
      </h1>

      {/* Right side: User Profile / Login */}
      <div className="flex items-center gap-2">
        {userSession ? (
          <div className="flex items-center gap-3">
            <div className="hidden flex-col items-end md:flex">
              <span className="text-sm font-semibold text-sage-800">{userSession.name || "Pengguna"}</span>
              <span className="text-[10px] text-sage-500">{userSession.email}</span>
            </div>
            
            {/* User Profile Info Dropdown Trigger */}
            <div className="group relative">
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-200 hover:bg-sage-300 text-sage-700 font-bold focus:outline-none">
                {userSession.name ? userSession.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </button>
              
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white p-1 shadow-lg ring-1 ring-black/5 divide-y divide-gray-100 opacity-0 scale-95 pointer-events-none group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:pointer-events-auto transition-all duration-150">
                <div className="px-4 py-2 md:hidden">
                  <p className="text-sm font-semibold text-sage-800 truncate">{userSession.name}</p>
                  <p className="text-xs text-sage-500 truncate">{userSession.email}</p>
                </div>
                <button
                  onClick={onLogoutClick}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-1.5 rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <User className="w-4 h-4" />
            <span>Login</span>
          </button>
        )}
      </div>
    </header>
  );
};
export default Header;
