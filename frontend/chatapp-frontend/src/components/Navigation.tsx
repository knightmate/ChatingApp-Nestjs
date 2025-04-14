import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <nav className="mt-4">
      <Link
        to="/messages"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
      >
        Messages
      </Link>
      <Link
        to="/friends"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
      >
        Friends
      </Link>
      <Link
        to="/profile"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
      >
        Profile
      </Link>
    </nav>
  );
};

export default Navigation; 