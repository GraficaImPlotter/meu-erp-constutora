import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  User, Client, Project, Transaction, StockItem, PurchaseOrder, DailyLog 
} from '../types';
import { 
  USERS, MOCK_CLIENTS, MOCK_PROJECTS, MOCK_TRANSACTIONS, MOCK_STOCK, MOCK_PO, MOCK_LOGS 
} from '../constants';

interface AppContextType {
  currentUser: User | null;
  login: (role: string) => void;
  logout: () => void;
  
  clients: Client[];
  projects: Project[];
  transactions: Transaction[];
  stock: StockItem[];
  purchaseOrders: PurchaseOrder[];
  logs: DailyLog[];

  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  removeClient: (id: string) => void;

  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  removeProject: (id: string) => void;

  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;

  approvePurchaseOrder: (poId: string) => void;
  requestPurchase: (po: PurchaseOrder) => void;
  removePurchaseOrder: (id: string) => void;

  addLog: (log: DailyLog) => void;
  updateLog: (log: DailyLog) => void;
  removeLog: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Data States
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [stock, setStock] = useState<StockItem[]>(MOCK_STOCK);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(MOCK_PO);
  const [logs, setLogs] = useState<DailyLog[]>(MOCK_LOGS);

  const login = (roleKey: string) => {
    setTimeout(() => {
      setCurrentUser(USERS[roleKey]);
    }, 600);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // --- CRUD OPERATIONS ---

  // Clients
  const addClient = (client: Client) => setClients(prev => [...prev, client]);
  const updateClient = (client: Client) => setClients(prev => prev.map(c => c.id === client.id ? client : c));
  const removeClient = (id: string) => setClients(prev => prev.filter(c => c.id !== id));

  // Projects
  const addProject = (project: Project) => setProjects(prev => [...prev, project]);
  const updateProject = (project: Project) => setProjects(prev => prev.map(p => p.id === project.id ? project : p));
  const removeProject = (id: string) => setProjects(prev => prev.filter(p => p.id !== id));

  // Transactions
  const addTransaction = (transaction: Transaction) => setTransactions(prev => [transaction, ...prev]);
  const updateTransaction = (transaction: Transaction) => setTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
  const removeTransaction = (id: string) => setTransactions(prev => prev.filter(t => t.id !== id));

  // Logs
  const addLog = (log: DailyLog) => setLogs(prev => [log, ...prev]);
  const updateLog = (log: DailyLog) => setLogs(prev => prev.map(l => l.id === log.id ? log : l));
  const removeLog = (id: string) => setLogs(prev => prev.filter(l => l.id !== id));

  // Purchase Orders & Stock
  const requestPurchase = (po: PurchaseOrder) => {
    setPurchaseOrders(prev => [po, ...prev]);
  };

  const removePurchaseOrder = (id: string) => {
      setPurchaseOrders(prev => prev.filter(p => p.id !== id));
  };

  const approvePurchaseOrder = (poId: string) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return;

    setPurchaseOrders(prev => prev.map(p => p.id === poId ? { ...p, status: 'PURCHASED' } : p));

    const newTransaction: Transaction = {
      id: `t-auto-${Date.now()}`,
      projectId: po.projectId,
      description: `Compra: ${po.itemName}`,
      amount: po.totalEstimate,
      type: 'EXPENSE',
      category: 'Material',
      date: new Date().toISOString().split('T')[0],
      status: 'PAID'
    };
    addTransaction(newTransaction);

    setStock(prev => {
      const existingItem = prev.find(s => s.projectId === po.projectId && s.name === po.itemName);
      if (existingItem) {
        return prev.map(s => s.id === existingItem.id ? { ...s, quantity: s.quantity + po.quantity } : s);
      } else {
        return [...prev, {
          id: `s-auto-${Date.now()}`,
          projectId: po.projectId,
          name: po.itemName,
          quantity: po.quantity,
          minQuantity: 10,
          unit: 'un',
          lastUpdated: new Date().toISOString()
        }];
      }
    });

    setProjects(prev => prev.map(p => {
        if (p.id === po.projectId) {
            return { ...p, spent: p.spent + po.totalEstimate };
        }
        return p;
    }));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      logout,
      clients,
      projects,
      transactions,
      stock,
      purchaseOrders,
      logs,
      addClient,
      updateClient,
      removeClient,
      addProject,
      updateProject,
      removeProject,
      addTransaction,
      updateTransaction,
      removeTransaction,
      approvePurchaseOrder,
      requestPurchase,
      removePurchaseOrder,
      addLog,
      updateLog,
      removeLog
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};