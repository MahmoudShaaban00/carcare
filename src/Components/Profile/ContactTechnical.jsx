import React, { useEffect, useState } from 'react';
import { useContact } from '../../Context/ContactContext';

export default function ContactTechnical() {
  const { getContactMessagesTechnical, contactMessageTechnical } = useContact();
  const [filter, setFilter] = useState('All'); // State for the filter
  
  useEffect(() => {
    getContactMessagesTechnical();
  }, []);

  // Filter messages based on selected filter
  const filteredMessages = contactMessageTechnical.filter((msg) => 
    filter === 'All' || msg.messageFor === filter
  );

  return (
    <div className="px-6 py-10">
      <h3 className="text-2xl font-bold mb-6 text-center text-blue-600">
        📨 Recent Contact Messages
      </h3>

      {/* Filter Options */}
      <div className="mb-4 flex justify-center space-x-4">
        <button
          className={`px-4 py-2 rounded-full ${filter === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('All')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-full ${filter === 'Technical' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('Technical')}
        >
          Technical
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.isArray(filteredMessages) && filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300"
            >
              <p className="text-blue-700 font-semibold text-lg mb-2">📩 {msg.message}</p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">🎯 For:</span> {msg.messageFor}
              </p>
              <p className="text-gray-400 text-sm">
                <span className="font-medium">🕒 Sent:</span>{' '}
                {new Date(msg.createdOn).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No messages found.</p>
        )}
      </div>
    </div>
  );
}
