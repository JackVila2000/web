import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Category } from '../../types';
import Modal from '../../components/common/Modal';

const CategoryManagement: React.FC = () => {
  const { categories, setCategories } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const openModal = (category: Category | null = null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingCategory(null);
    setIsModalOpen(false);
  };

  const handleSave = (category: Category) => {
    if (editingCategory) {
      setCategories(categories.map(c => c.id === category.id ? category : c));
    } else {
      setCategories([...categories, { ...category, id: `cat-${Date.now()}` }]);
    }
    closeModal();
  };

  const handleDelete = (categoryId: string) => {
    if(window.confirm('¿Está seguro que desea eliminar esta categoría? Esto podría afectar a los productos existentes.')){
      setCategories(categories.filter(c => c.id !== categoryId));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Categorías</h2>
        <button onClick={() => openModal()} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
          Nueva Categoría
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-gray-700 font-semibold">Nombre</th>
              <th className="p-3 text-gray-700 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id} className="border-b">
                <td className="p-3 text-gray-900">{category.name}</td>
                <td className="p-3">
                  <button onClick={() => openModal(category)} className="text-blue-600 hover:underline mr-4">Editar</button>
                  <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <CategoryForm category={editingCategory} onSave={handleSave} onClose={closeModal} />}
    </div>
  );
};

interface CategoryFormProps {
  category: Category | null;
  onSave: (category: Category) => void;
  onClose: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onClose }) => {
  const [name, setName] = useState(category ? category.name : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: category ? category.id : '', name });
  };

  return (
    <Modal title={category ? 'Editar Categoría' : 'Nueva Categoría'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre de la Categoría</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2 text-gray-900"
            required
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Guardar</button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryManagement;