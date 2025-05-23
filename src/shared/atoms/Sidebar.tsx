import React from 'react';
import Link from 'next/link';

const navItems = [
  { label: 'Customers', href: '/feature/allCustomer' },
  { label: 'All Leads', href: '#' },
  { label: 'Tasks', href: '#' },
  { label: 'Dashboard', href: '/feature/dashboard' },
  { label: 'Sessions', href: '/feature/session' },
  { label: 'Diet Plan', href: '/feature/dietPlan' },
  { label: 'Exercise', href: '/feature/exercise' },
  { label: 'Reports', href: '/feature/reports' },
];

export const Sidebar = () => {
  return (
    <aside className="w-56 h-full flex flex-col items-center bg-white shadow-md shadow-gray-500 p-4">
      <div className="mb-8">
        <h2 className="text-xs text-gray-500 mb-2">YOU</h2>
        {navItems.slice(0, 3).map((item) => (
          <Link href={item.href} key={item.label}>
            <div className="mb-4 font-semibold cursor-pointer hover:text-orange-600 transition-colors">
              {item.label}
            </div>
          </Link>
        ))}
      </div>
      <div>
        <h2 className="text-xs text-gray-500 mb-2">COMPANY</h2>
        {navItems.slice(3).map((item) => (
          <Link href={item.href} key={item.label}>
            <div className="mb-4 font-semibold cursor-pointer hover:text-orange-600 transition-colors">
              {item.label}
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
};
