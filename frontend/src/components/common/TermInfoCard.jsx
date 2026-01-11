import React from 'react'

const TermInfoCard = ({ session, term, status }) => {
  return (
    <div className="bg-white rounded shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">Current Academic Period</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Session</p>
          <p className="font-medium">{session}</p>
        </div>

        <div>
          <p className="text-gray-500">Term</p>
          <p className="font-medium">{term}</p>
        </div>

        <div>
          <p className="text-gray-500">Status</p>
          <span className="inline-block px-3 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TermInfoCard;


