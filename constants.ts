import { Role, User, Category, MenuItem, Order } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'user-1', username: '123', password: '123', name: 'Admin Principal', role: Role.Admin },
  { id: 'user-2', username: 'mozo1', password: '123', name: 'Carlos Mozo', role: Role.Waiter },
  { id: 'user-3', username: 'cocina1', password: '123', name: 'Ana Cocina', role: Role.Cook },
];

export const INITIAL_CATEGORIES: Category[] = [];

export const INITIAL_MENU_ITEMS: MenuItem[] = [];

export const INITIAL_ORDERS: Order[] = [];