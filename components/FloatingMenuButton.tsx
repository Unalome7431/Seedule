import React from "react";
import { Menu } from "lucide-react";

interface FloatingMenuButtonProps {
  onClick: () => void;
}

export const FloatingMenuButton: React.FC<FloatingMenuButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-sage-200 hover:bg-sage-50 focus:outline-none focus:ring-2 focus:ring-primary-500 md:hidden transition-all duration-200"
      aria-label="Buka menu"
    >
      <Menu className="w-5 h-5 text-sage-700" />
    </button>
  );
};
export default FloatingMenuButton;
