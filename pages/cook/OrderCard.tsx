import React from 'react';
import { Order, OrderItem, OrderItemStatus } from '../../types';
import { useData } from '../../contexts/DataContext';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, itemId: string, newStatus: OrderItemStatus) => void;
}

const statusConfig = {
    [OrderItemStatus.Pending]: { text: 'Pendiente', bg: 'bg-red-100', text_color: 'text-red-800' },
    [OrderItemStatus.InProgress]: { text: 'En Preparación', bg: 'bg-yellow-100', text_color: 'text-yellow-800' },
    [OrderItemStatus.Ready]: { text: 'Listo', bg: 'bg-green-100', text_color: 'text-green-800' },
    [OrderItemStatus.Delivered]: { text: 'Entregado', bg: 'bg-gray-100', text_color: 'text-gray-800' },
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusChange }) => {
    const { getMenuItem } = useData();

    const handleStatusClick = (item: OrderItem) => {
        if (item.status === OrderItemStatus.Pending) {
            onStatusChange(order.id, item.id, OrderItemStatus.InProgress);
        } else if (item.status === OrderItemStatus.InProgress) {
            onStatusChange(order.id, item.id, OrderItemStatus.Ready);
        }
    };

    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " años";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " meses";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " días";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " horas";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutos";
        return Math.floor(seconds) + " segundos";
    }

    const relevantItems = order.items.filter(item => item.status !== OrderItemStatus.Ready && item.status !== OrderItemStatus.Delivered);

    return (
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full">
            <div className="border-b pb-2 mb-2">
                <h3 className="text-xl font-bold text-gray-800">Mesa {order.table}</h3>
                <p className="text-sm text-gray-500">Hace {timeSince(order.createdAt)}</p>
            </div>
            <div className="space-y-3 flex-grow">
                {relevantItems.map(item => {
                    const menuItem = getMenuItem(item.menuItemId);
                    if (!menuItem) return null;
                    const statusInfo = statusConfig[item.status];
                    const isClickable = item.status === OrderItemStatus.Pending || item.status === OrderItemStatus.InProgress;

                    return (
                        <div key={item.id} className="flex justify-between items-start">
                           <div>
                                <p className="font-semibold text-gray-900">{item.quantity}x {menuItem.name}</p>
                           </div>
                           <button 
                                onClick={() => isClickable && handleStatusClick(item)} 
                                className={`text-xs font-bold px-2 py-1 rounded-full ${statusInfo.bg} ${statusInfo.text_color} ${isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                            >
                                {statusInfo.text}
                           </button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default OrderCard;