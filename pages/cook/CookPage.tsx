import React, { useEffect, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Order, OrderItemStatus } from '../../types';
import OrderCard from './OrderCard';

const CookPage: React.FC = () => {
  const { orders, updateOrderItemStatus } = useData();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Filter orders that are not fully delivered
    const filteredOrders = orders.filter(order => 
      order.items.some(item => item.status !== OrderItemStatus.Delivered)
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    setActiveOrders(filteredOrders);
  }, [orders]);

  const ordersByStatus: Record<string, Order[]> = {
    [OrderItemStatus.Pending]: [],
    [OrderItemStatus.InProgress]: [],
    [OrderItemStatus.Ready]: []
  };

  const relevantOrders = activeOrders.filter(o => o.items.some(i => i.status !== OrderItemStatus.Ready && i.status !== OrderItemStatus.Delivered));

  return (
    <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pedidos en Cocina</h2>
        {relevantOrders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow">
                <p className="text-xl text-gray-500">No hay pedidos pendientes.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {relevantOrders.map(order => (
                    <OrderCard 
                        key={order.id} 
                        order={order} 
                        onStatusChange={updateOrderItemStatus}
                    />
                ))}
            </div>
        )}
    </div>
  );
};

export default CookPage;