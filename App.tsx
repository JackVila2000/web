import React from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/admin/AdminPage';
import WaiterPage from './pages/waiter/WaiterPage';
import CookPage from './pages/cook/CookPage';
import { Role } from './types';
import Header from './components/common/Header';

const App: React.FC = () => {
  const { currentUser } = useAuth();

  const renderAppForRole = () => {
    if (!currentUser) {
      return <LoginPage />;
    }

    const MainContent = () => {
        switch (currentUser.role) {
            case Role.Admin:
                return <AdminPage />;
            case Role.Waiter:
                return <WaiterPage />;
            case Role.Cook:
                return <CookPage />;
            default:
                return <div className="text-center p-8">Rol no reconocido.</div>;
        }
    }
    
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <main className="flex-grow p-4 md:p-6">
                <MainContent />
            </main>
        </div>
    )
  };

  return <div className="font-sans antialiased">{renderAppForRole()}</div>;
};

export default App;