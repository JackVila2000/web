import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Bohemias<span className="text-orange-600">89</span>
        </h1>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-gray-700">{currentUser.name}</p>
            <p className="text-sm text-gray-500">{currentUser.role}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;