import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { OrderItem, OrderItemStatus } from '../../types';
import Modal from '../../components/common/Modal';

interface OrderModalProps {
  tableNumber: number;
  onClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ tableNumber, onClose }) => {
  const { categories, menuItems, addOrder } = useData();
  const { currentUser } = useAuth();
  const [customerCount, setCustomerCount] = useState(1);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id || '');
  
  const availableMenuItems = menuItems.filter(item => item.available && item.categoryId === selectedCategory);

  const addItemToOrder = (menuItemId: string) => {
    setOrderItems(prev => {
      const existingItem = prev.find(item => item.menuItemId === menuItemId);
      if (existingItem) {
        return prev.map(item => item.menuItemId === menuItemId ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prev, {
          id: `item-${Date.now()}`,
          menuItemId,
          quantity: 1,
          status: OrderItemStatus.Pending,
          customerIndex: 1, // Default to customer 1
        }];
      }
    });
  };

  const removeItem = (orderItemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== orderItemId));
  };
  
  const updateItemQuantity = (orderItemId: string, change: number) => {
    setOrderItems(prev => prev.map(item => {
      if (item.id === orderItemId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean) as OrderItem[]);
  };

  const handleSubmitOrder = () => {
    if (!currentUser) return;
    if (orderItems.length === 0) {
        alert("Agregue al menos un producto al pedido.");
        return;
    }
    addOrder({
      table: tableNumber,
      customerCount,
      items: orderItems,
      waiterId: currentUser.id
    });
    onClose();
  };

  const getMenuItemDetails = (id: string) => menuItems.find(m => m.id === id);

  const total = orderItems.reduce((acc, item) => {
    const menuItem = getMenuItemDetails(item.menuItemId);
    return acc + (menuItem ? menuItem.price * item.quantity : 0);
  }, 0);

  return (
    <Modal title={`Nuevo Pedido - Mesa ${tableNumber}`} onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{minHeight: '60vh', maxHeight: '80vh'}}>
        {/* Left Side: Menu */}
        <div className="flex flex-col bg-gray-50 p-4 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Categorías</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex-grow overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-3">
              {availableMenuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => addItemToOrder(item.id)}
                  className="bg-white p-3 rounded-lg shadow hover:bg-orange-50 transition text-left"
                >
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-orange-600 font-bold">S/ {item.price.toFixed(2)}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="flex flex-col bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen del Pedido</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Clientes en la mesa</label>
            <input
              type="number"
              min="1"
              value={customerCount}
              onChange={(e) => setCustomerCount(parseInt(e.target.value, 10))}
              className="mt-1 w-20 text-center py-2 border-gray-300 rounded-md text-gray-900"
            />
          </div>
          <div className="flex-grow overflow-y-auto border-t border-b py-2 mb-2">
            {orderItems.length > 0 ? (
              orderItems.map(item => {
                const details = getMenuItemDetails(item.menuItemId);
                if (!details) return null;
                return (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-semibold text-gray-900">{details.name}</p>
                      <p className="text-sm text-gray-500">S/ {details.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateItemQuantity(item.id, -1)} className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800">-</button>
                      <span className="font-bold text-gray-900">{item.quantity}</span>
                      <button onClick={() => updateItemQuantity(item.id, 1)} className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800">+</button>
                      <button onClick={() => removeItem(item.id)} className="ml-2 text-red-500 hover:text-red-700">✕</button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-10">Agregue productos al pedido.</p>
            )}
          </div>
          <div className="flex justify-between items-center font-bold text-xl mt-auto">
            <span>Total:</span>
            <span>S/ {total.toFixed(2)}</span>
          </div>
           <button
            onClick={handleSubmitOrder}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
          >
            Enviar a Cocina
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default OrderModal;