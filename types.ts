export enum Role {
  Admin = 'Administrador',
  Waiter = 'Mozo',
  Cook = 'Cocinero',
}

export interface User {
  id: string;
  username: string;
  password?: string; // Password should not always be exposed
  name: string;
  role: Role;
}

export interface Category {
  id: string;
  name: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  available: boolean;
}

export enum OrderItemStatus {
  Pending = 'Pendiente',
  InProgress = 'En Preparación',
  Ready = 'Listo',
  Delivered = 'Entregado',
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  status: OrderItemStatus;
  customerIndex: number;
}

export interface Order {
  id: string;
  table: number;
  customerCount: number;
  items: OrderItem[];
  waiterId: string;
  createdAt: string;
}