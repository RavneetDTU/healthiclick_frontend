import React from 'react';

export const Header = () => (
  <header className="w-full flex justify-between items-center px-6 py-4 border-b bg-white">
    <h1 className="text-xl font-bold">Healthiclick</h1>
    <div className="flex gap-6">
      <button className="font-medium">Alerts</button>
      <button className="font-medium">Profile</button>
    </div>
  </header>
);