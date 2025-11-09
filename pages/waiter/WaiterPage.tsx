import React, { useState, useEffect } from 'react';
import OrderModal from './OrderModal';
import { useData } from '../../contexts/DataContext';
import { Order, OrderItemStatus } from '../../types';

const ReadyOrdersNotification: React.FC = () => {
    const { orders, getMenuItem, updateOrderItemStatus } = useData();
    const [readyOrders, setReadyOrders] = useState<Order[]>([]);

    useEffect(() => {
        const ready = orders.filter(order =>
            order.items.some(item => item.status === OrderItemStatus.Ready)
        ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setReadyOrders(ready);
    }, [orders]);

    if (readyOrders.length === 0) {
        return null;
    }
    
    const handleDeliver = (orderId: string, itemId: string) => {
        updateOrderItemStatus(orderId, itemId, OrderItemStatus.Delivered);
    };

    return (
        <div className="mb-8 p-4 bg-green-100 border-l-4 border-green-500 rounded-r-lg shadow-lg">
            <h3 className="text-xl font-bold text-green-800 mb-2">Pedidos Listos para Recoger!</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {readyOrders.map(order => (
                    <div key={order.id} className="bg-white p-3 rounded-md shadow-sm">
                        <p className="font-bold text-lg text-gray-800">Mesa {order.table}</p>
                        <ul className="mt-2 space-y-2">
                            {order.items.filter(item => item.status === OrderItemStatus.Ready).map(item => {
                                const menuItem = getMenuItem(item.menuItemId);
                                return (
                                    <li key={item.id} className="flex justify-between items-center text-gray-700">
                                        <span>{item.quantity}x {menuItem?.name}</span>
                                        <button 
                                            onClick={() => handleDeliver(order.id, item.id)}
                                            className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1 px-3 rounded-full transition"
                                        >
                                            Entregar
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WaiterPage: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  const tables = Array.from({ length: 12 }, (_, i) => i + 1);

  const openOrderModal = (tableNumber: number) => {
    setSelectedTable(tableNumber);
  };

  const closeOrderModal = () => {
    setSelectedTable(null);
  };

  return (
    <div className="container mx-auto">
      <ReadyOrdersNotification />

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Seleccionar Mesa</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {tables.map((tableNumber) => (
          <button
            key={tableNumber}
            onClick={() => openOrderModal(tableNumber)}
            className="aspect-square bg-white rounded-xl shadow-lg hover:shadow-2xl hover:bg-orange-100 transition-all duration-300 flex flex-col justify-center items-center transform hover:-translate-y-1"
          >
            <span className="text-gray-500 text-sm">Mesa</span>
            <span className="text-4xl font-extrabold text-orange-600">{tableNumber}</span>
          </button>
        ))}
      </div>
      {selectedTable !== null && (
        <OrderModal tableNumber={selectedTable} onClose={closeOrderModal} />
      )}
    </div>
  );
};

export default WaiterPage;