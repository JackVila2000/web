import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Category, MenuItem, Order, OrderItemStatus, Role } from '../types';
import { INITIAL_USERS, INITIAL_CATEGORIES, INITIAL_MENU_ITEMS, INITIAL_ORDERS } from '../constants';

interface DataContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  getCategoryName: (id: string) => string;
  getMenuItem: (id: string) => MenuItem | undefined;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderItemStatus: (orderId: string, itemId: string, status: OrderItemStatus) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Sin categoría';
  const getMenuItem = (id: string) => menuItems.find(m => m.id === id);

  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [...prev, newOrder]);
  };
  
  const updateOrderItemStatus = (orderId: string, itemId: string, status: OrderItemStatus) => {
    setOrders(prevOrders => prevOrders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          items: order.items.map(item => 
            item.id === itemId ? { ...item, status } : item
          )
        };
      }
      return order;
    }));
  };
  
  const value = {
    users, setUsers,
    categories, setCategories,
    menuItems, setMenuItems,
    orders, setOrders,
    getCategoryName, getMenuItem,
    addOrder,
    updateOrderItemStatus,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};