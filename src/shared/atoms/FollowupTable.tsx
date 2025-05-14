import React, { useState } from 'react';
import { Followup } from '@/Components/Dashboard/type';
import NextImage from 'next/image';

interface FollowupTableProps {
  title: string;
  followups: Followup[];
}

export const FollowupTable: React.FC<FollowupTableProps> = ({ title, followups }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

  const filteredFollowups = followups.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded shadow shadow-gray-500">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>

      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 w-64"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'Daily' | 'Weekly' | 'Monthly')}
          className="border border-gray-300 rounded px-3 py-1"
        >
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm">
          <thead className="text-left border-b">
            <tr>
              <th>Avatar</th>
              <th>Customer ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone No</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredFollowups.map((f) => (
              <tr key={f.id} className="border-b hover:bg-gray-50">
                <td className='px-2 py-2'>
                  <NextImage
                    src={f.avatarImage.url}
                    alt={f.avatarImage.alt || 'avatar'}
                    height={0}
                    width={0}
                    className="w-8 h-8 rounded-full"
                  />
                </td>
                <td className='p-2'>{f.id}</td>
                <td className='p-2'>{f.name}</td>
                <td className='p-2'>{f.email}</td>
                <td className='p-2'>{f.phone}</td>
                <td className='p-2'>{f.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
