export type Role = 'ADMIN' | 'ENGINEER' | 'FINANCE';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  email: string;
}

export interface Client {
  id: string;
  name: string;
  type: 'PF' | 'PJ';
  document: string; // CPF or CNPJ
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  address: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';
  budget: number;
  spent: number;
  startDate: string;
  completionDate: string;
  progress: number; // 0-100
  image: string;
}

export interface Transaction {
  id: string;
  projectId?: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  date: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
}

export interface StockItem {
  id: string;
  projectId: string;
  name: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  lastUpdated: string;
}

export interface PurchaseOrder {
  id: string;
  projectId: string;
  requesterId: string;
  itemName: string;
  quantity: number;
  unitPriceEstimate: number;
  totalEstimate: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PURCHASED';
  date: string;
}

export interface DailyLog {
  id: string;
  projectId: string;
  authorId: string;
  content: string;
  date: string;
  weather: 'SUNNY' | 'RAINY' | 'CLOUDY';
  images: string[];
}

// Navigation Item Type
export interface NavItem {
  label: string;
  icon: any;
  view: string;
  roles: Role[];
}