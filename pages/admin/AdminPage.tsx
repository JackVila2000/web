import React, { useState } from 'react';
import UserManagement from './UserManagement';
import MenuManagement from './MenuManagement';
import CategoryManagement from './CategoryManagement';

type AdminTab = 'users' | 'menu' | 'categories';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'menu':
        return <MenuManagement />;
      case 'categories':
        return <CategoryManagement />;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{tab: AdminTab, label: string}> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm md:text-base font-semibold rounded-lg transition ${activeTab === tab ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-orange-100'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="container mx-auto">
      <div className="mb-6 bg-white p-2 rounded-lg shadow-sm inline-flex space-x-2">
        <TabButton tab="users" label="Gestionar Usuarios" />
        <TabButton tab="menu" label="Gestionar Menú" />
        <TabButton tab="categories" label="Gestionar Categorías" />
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPage;