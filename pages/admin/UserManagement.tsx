import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { User, Role } from '../../types';
import Modal from '../../components/common/Modal';

const UserManagement: React.FC = () => {
  const { users, setUsers } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const openModal = (user: User | null = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingUser(null);
    setIsModalOpen(false);
  };

  const handleSave = (userFromForm: User) => {
    if (editingUser) {
      const finalUser = {
        ...userFromForm,
        // If password in form is empty string, use the original password from editingUser
        password: userFromForm.password || editingUser.password,
      };
      setUsers(users.map(u => u.id === finalUser.id ? finalUser : u));
    } else {
      // This is a new user
      setUsers([...users, { ...userFromForm, id: `user-${Date.now()}` }]);
    }
    closeModal();
  };
  
  const handleDelete = (userId: string) => {
      if(window.confirm('¿Está seguro que desea eliminar este usuario?')){
          setUsers(users.filter(u => u.id !== userId));
      }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Usuarios</h2>
        <button onClick={() => openModal()} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
          Nuevo Usuario
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-gray-700 font-semibold">Nombre</th>
              <th className="p-3 text-gray-700 font-semibold">Usuario</th>
              <th className="p-3 text-gray-700 font-semibold">Contraseña</th>
              <th className="p-3 text-gray-700 font-semibold">Rol</th>
              <th className="p-3 text-gray-700 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="p-3 text-gray-900">{user.name}</td>
                <td className="p-3 text-gray-900">{user.username}</td>
                <td className="p-3 text-gray-900">{user.password}</td>
                <td className="p-3 text-gray-900">{user.role}</td>
                <td className="p-3">
                  <button onClick={() => openModal(user)} className="text-blue-600 hover:underline mr-4">Editar</button>
                  {user.username !== '123' && (
                     <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline">Eliminar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <UserForm user={editingUser} onSave={handleSave} onClose={closeModal} />}
    </div>
  );
};

interface UserFormProps {
  user: User | null;
  onSave: (user: User) => void;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState<User>(user || { id: '', name: '', username: '', role: Role.Waiter, password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal title={user ? 'Editar Usuario' : 'Nuevo Usuario'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2 text-gray-900" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2 text-gray-900" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2 text-gray-900" placeholder={user ? 'Dejar en blanco para no cambiar' : ''} required={!user} />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <select name="role" value={formData.role} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2 text-gray-900">
                    {Object.values(Role).map(role => <option key={role} value={role}>{role}</option>)}
                </select>
            </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Guardar</button>
        </div>
      </form>
    </Modal>
  )
};

export default UserManagement;