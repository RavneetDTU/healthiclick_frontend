import React from "react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-[#fee4c3] py-4 px-8 flex justify-between items-center text-[#1f1f1f]">
      {/* Left side */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="font-bold text-lg">Healthiclick</span>
        <span className="text-gray-600">© 2024 Healthiclick</span>
      </div>

      {/* Right side */}
      <div className="flex space-x-8 font-semibold text-sm">
        <Link href="/privacy" className="hover:underline">Privacy</Link>
        <Link href="/contact" className="hover:underline">Contact</Link>
        <Link href="/terms" className="hover:underline">Terms</Link>
        <Link href="/insights" className="hover:underline">Insights</Link>
      </div>
    </footer>
  );
};
