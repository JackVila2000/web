import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Modal from '../components/common/Modal';
import { Role } from '../types';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { users, setUsers } = useData();
  
  const [role, setRole] = useState<Role | ''>('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalError, setModalError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!role) {
      setError('Por favor, seleccione un rol.');
      return;
    }

    const loggedInUser = await login(username, password, role);

    if (!loggedInUser) {
      setError('Rol, usuario o contraseña incorrectos.');
      setPassword('');
    } else if (loggedInUser.username === '123' && loggedInUser.password === '123') {
      setShowPasswordChangeModal(true);
      setError('');
    }
  };

  const handlePasswordChange = () => {
    setModalError('');
    if (newPassword !== confirmPassword) {
      setModalError('Las contraseñas no coinciden.');
      return;
    }
    if (newPassword.length < 4) {
      setModalError('La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }

    setUsers(users.map(u => u.username === '123' ? { ...u, password: newPassword } : u));
    setShowPasswordChangeModal(false);
    alert('Contraseña cambiada con éxito. Por favor, inicie sesión de nuevo.');
    // Reset form
    setUsername('');
    setPassword('');
    setRole('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
            Bohemias<span className="text-orange-600">89</span>
        </h1>
        <p className="text-center text-gray-500 mb-8">Inicio de Sesión</p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Rol
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 border-2 border-transparent focus:border-orange-500 focus:bg-white focus:outline-none transition"
              required
            >
              <option value="" disabled>Seleccione su Rol</option>
              {Object.values(Role).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 border-2 border-transparent focus:border-orange-500 focus:bg-white focus:outline-none transition"
              placeholder="Ingrese su nombre de usuario"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 border-2 border-transparent focus:border-orange-500 focus:bg-white focus:outline-none transition"
              placeholder="Ingrese su contraseña"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
          >
            Ingresar
          </button>
        </form>
      </div>

      {showPasswordChangeModal && (
        <Modal title="Cambiar Contraseña por Defecto" onClose={() => setShowPasswordChangeModal(false)}>
          <p className="mb-4 text-gray-600">Por seguridad, debe cambiar la contraseña del administrador.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Nueva Contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded text-gray-900"
              />
            </div>
            {modalError && <p className="text-red-500 text-xs italic mt-2">{modalError}</p>}
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={handlePasswordChange} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Cambiar Contraseña
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LoginPage;