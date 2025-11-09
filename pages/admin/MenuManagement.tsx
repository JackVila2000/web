import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { MenuItem } from '../../types';
import Modal from '../../components/common/Modal';

const MenuManagement: React.FC = () => {
  const { menuItems, setMenuItems, categories, getCategoryName } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const openModal = (item: MenuItem | null = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleSave = (item: MenuItem) => {
    if (editingItem) {
      setMenuItems(menuItems.map(i => i.id === item.id ? item : i));
    } else {
      setMenuItems([...menuItems, { ...item, id: `item-${Date.now()}` }]);
    }
    closeModal();
  };

  const handleDelete = (itemId: string) => {
    if(window.confirm('¿Está seguro que desea eliminar este producto?')){
      setMenuItems(menuItems.filter(i => i.id !== itemId));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Menú</h2>
        <button onClick={() => openModal()} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
          Nuevo Producto
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-gray-700 font-semibold">Nombre</th>
              <th className="p-3 text-gray-700 font-semibold">Categoría</th>
              <th className="p-3 text-gray-700 font-semibold">Precio</th>
              <th className="p-3 text-gray-700 font-semibold">Disponibilidad</th>
              <th className="p-3 text-gray-700 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-3 text-gray-900">{item.name}</td>
                <td className="p-3 text-gray-900">{getCategoryName(item.categoryId)}</td>
                <td className="p-3 text-gray-900">S/ {item.price.toFixed(2)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.available ? 'Disponible' : 'No Disponible'}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => openModal(item)} className="text-blue-600 hover:underline mr-4">Editar</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <MenuItemForm item={editingItem} onSave={handleSave} onClose={closeModal} categories={categories} />}
    </div>
  );
};

interface MenuItemFormProps {
  item: MenuItem | null;
  onSave: (item: MenuItem) => void;
  onClose: () => void;
  categories: { id: string, name: string }[];
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ item, onSave, onClose, categories }) => {
  const [formData, setFormData] = useState<MenuItem>(item || { id: '', name: '', description: '', price: 0, categoryId: categories[0]?.id || '', available: true });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal title={item ? 'Editar Producto' : 'Nuevo Producto'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2 text-gray-900" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2 text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio (S/)</label>
          <input type="number" name="price" step="0.01" value={formData.price} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2 text-gray-900" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Categoría</label>
          <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2 text-gray-900" required>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div className="flex items-center">
            <input type="checkbox" id="available" name="available" checked={formData.available} onChange={handleChange} className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
            <label htmlFor="available" className="ml-2 block text-sm text-gray-900">Disponible</label>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Guardar</button>
        </div>
      </form>
    </Modal>
  );
};

export default MenuManagement;