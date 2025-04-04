import React from "react";

import { Link } from "react-router";

const LeftNavigationBar = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Garden Dashboard</h2>
      </div>
      <nav>
        <ul>
          <li className="mb-4">
            <Link
              to="/dashboard"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/gardens" className="block p-2 rounded hover:bg-gray-700">
              Gardens
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/irrigation"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Irrigation
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/statistics"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Statistics
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/settings"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default LeftNavigationBar;
