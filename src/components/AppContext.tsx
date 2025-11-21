import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  User, Client, Project, Transaction, StockItem, PurchaseOrder, DailyLog 
} from '../types';
import { 
  MOCK_CLIENTS, MOCK_PROJECTS, MOCK_TRANSACTIONS, MOCK_STOCK, MOCK_PO, MOCK_LOGS 
} from '../constants';
import { supabase } from '../services/supabase';

interface AppContextType {
  currentUser: User | null;
  login: (email: string, pass: string) => Promise<void>;
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

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Data States
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [stock, setStock] = useState<StockItem[]>(MOCK_STOCK);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(MOCK_PO);
  const [logs, setLogs] = useState<DailyLog[]>(MOCK_LOGS);

  // Check if Supabase is configured and active
  const online = !!supabase;

  // 1. Listen for Auth Changes (Supabase)
  useEffect(() => {
    if (!online || !supabase) return;

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchUserProfile(session.user.id);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [online]);

  // 2. Fetch Data if Logged In
  useEffect(() => {
    if (online && supabase && currentUser) {
      fetchData();
    }
  }, [currentUser, online]);

  const fetchUserProfile = async (userId: string) => {
    if (!supabase) return;
    
    // Try to fetch user role from 'public.users' table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setCurrentUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role, // ADMIN, ENGINEER, FINANCE
        avatar: data.avatar_url || 'https://i.pravatar.cc/150?u=default'
      });
    } else {
      // Fallback if user exists in Auth but not in public table (should trigger SQL script)
      console.warn("User found in Auth but not in public.users table", error);
    }
  };

  const fetchData = async () => {
    if (!supabase) return;

    const { data: dbClients } = await supabase.from('clients').select('*');
    if (dbClients) setClients(dbClients.map((c: any) => ({
        id: c.id, name: c.name, type: c.type, document: c.document,
        email: c.email, phone: c.phone, address: c.address, city: c.city, state: c.state
    })));

    const { data: dbProjects } = await supabase.from('projects').select('*');
    if (dbProjects) setProjects(dbProjects.map((p: any) => ({
        id: p.id, clientId: p.client_id, name: p.name, address: p.address,
        status: p.status, budget: p.budget, spent: p.spent, startDate: p.start_date,
        completionDate: p.completion_date, progress: p.progress, image: p.image_url || ''
    })));

    const { data: dbTrans } = await supabase.from('transactions').select('*').order('date', { ascending: false });
    if (dbTrans) setTransactions(dbTrans.map((t: any) => ({
        id: t.id, projectId: t.project_id, description: t.description, amount: t.amount,
        type: t.type, category: t.category, date: t.date, status: t.status
    })));

    const { data: dbStock } = await supabase.from('stock_items').select('*');
    if (dbStock) setStock(dbStock.map((s: any) => ({
        id: s.id, projectId: s.project_id, name: s.name, quantity: s.quantity,
        minQuantity: s.min_quantity, unit: s.unit, lastUpdated: s.last_updated
    })));

    const { data: dbPO } = await supabase.from('purchase_orders').select('*');
    if (dbPO) setPurchaseOrders(dbPO.map((p: any) => ({
        id: p.id, projectId: p.project_id, requesterId: p.requester_id,
        itemName: p.item_name, quantity: p.quantity, unitPriceEstimate: p.unit_price_estimate,
        totalEstimate: p.total_estimate, status: p.status, date: p.created_at
    })));

    const { data: dbLogs } = await supabase.from('daily_logs').select('*');
    if (dbLogs) setLogs(dbLogs.map((l: any) => ({
        id: l.id, projectId: l.project_id, authorId: l.author_id, content: l.content,
        date: l.date, weather: l.weather, images: l.images || []
    })));
  };

  const login = async (email: string, pass: string) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setCurrentUser(null);
  };

  // --- CRUD OPERATIONS ---
  // (Mantendo a lógica híbrida existente para operações)

  const addClient = async (client: Client) => {
    if (online && supabase) {
      const { data } = await supabase.from('clients').insert([{
        name: client.name, type: client.type, document: client.document,
        email: client.email, phone: client.phone, address: client.address,
        city: client.city, state: client.state
      }]).select().single();
      if (data) setClients(prev => [...prev, { ...client, id: data.id }]);
    } else setClients(prev => [...prev, client]);
  };

  const updateClient = async (client: Client) => {
    if (online && supabase) {
      await supabase.from('clients').update({
        name: client.name, type: client.type, document: client.document,
        email: client.email, phone: client.phone, address: client.address,
        city: client.city, state: client.state
      }).eq('id', client.id);
    }
    setClients(prev => prev.map(c => c.id === client.id ? client : c));
  };

  const removeClient = async (id: string) => {
    if (online && supabase) await supabase.from('clients').delete().eq('id', id);
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const addProject = async (project: Project) => {
    if (online && supabase) {
      const { data } = await supabase.from('projects').insert([{
        client_id: project.clientId, name: project.name, address: project.address,
        status: project.status, budget: project.budget, spent: project.spent,
        start_date: project.startDate, completion_date: project.completionDate,
        progress: project.progress, image_url: project.image
      }]).select().single();
      if (data) setProjects(prev => [...prev, { ...project, id: data.id }]);
    } else setProjects(prev => [...prev, project]);
  };

  const updateProject = async (project: Project) => {
    if (online && supabase) {
      await supabase.from('projects').update({
        client_id: project.clientId, name: project.name, address: project.address,
        status: project.status, budget: project.budget,
        start_date: project.startDate, completion_date: project.completionDate,
        progress: project.progress, image_url: project.image
      }).eq('id', project.id);
    }
    setProjects(prev => prev.map(p => p.id === project.id ? project : p));
  };

  const removeProject = async (id: string) => {
    if (online && supabase) await supabase.from('projects').delete().eq('id', id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const addTransaction = async (transaction: Transaction) => {
    if (online && supabase) {
      const { data } = await supabase.from('transactions').insert([{
        project_id: transaction.projectId || null, description: transaction.description,
        amount: transaction.amount, type: transaction.type, category: transaction.category,
        date: transaction.date, status: transaction.status
      }]).select().single();
      if (data) setTransactions(prev => [{ ...transaction, id: data.id }, ...prev]);
      
      if (transaction.projectId && transaction.type === 'EXPENSE' && transaction.status === 'PAID') {
         setProjects(prev => prev.map(p => p.id === transaction.projectId ? { ...p, spent: p.spent + transaction.amount } : p));
      }
    } else setTransactions(prev => [transaction, ...prev]);
  };

  const updateTransaction = async (transaction: Transaction) => {
      setTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
  };

  const removeTransaction = async (id: string) => {
    if (online && supabase) await supabase.from('transactions').delete().eq('id', id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addLog = async (log: DailyLog) => {
    if (online && supabase) {
      const { data } = await supabase.from('daily_logs').insert([{
        project_id: log.projectId, author_id: currentUser?.id,
        content: log.content, weather: log.weather, date: log.date, images: log.images
      }]).select().single();
      if(data) setLogs(prev => [{...log, id: data.id}, ...prev]);
    } else setLogs(prev => [log, ...prev]);
  };

  const updateLog = async (log: DailyLog) => {
      if (online && supabase) {
        await supabase.from('daily_logs').update({
            content: log.content, weather: log.weather, date: log.date, images: log.images
        }).eq('id', log.id);
      }
      setLogs(prev => prev.map(l => l.id === log.id ? log : l));
  };

  const removeLog = async (id: string) => {
      if (online && supabase) await supabase.from('daily_logs').delete().eq('id', id);
      setLogs(prev => prev.filter(l => l.id !== id));
  };

  const requestPurchase = async (po: PurchaseOrder) => {
    if (online && supabase) {
        const { data } = await supabase.from('purchase_orders').insert([{
            project_id: po.projectId, requester_id: currentUser?.id, item_name: po.itemName,
            quantity: po.quantity, unit_price_estimate: po.unitPriceEstimate,
            total_estimate: po.totalEstimate, status: 'PENDING'
        }]).select().single();
        if(data) setPurchaseOrders(prev => [{...po, id: data.id}, ...prev]);
    } else setPurchaseOrders(prev => [po, ...prev]);
  };

  const removePurchaseOrder = async (id: string) => {
      if (online && supabase) await supabase.from('purchase_orders').delete().eq('id', id);
      setPurchaseOrders(prev => prev.filter(p => p.id !== id));
  };

  const approvePurchaseOrder = async (poId: string) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return;

    if (online && supabase) {
        await supabase.from('purchase_orders').update({ status: 'PURCHASED' }).eq('id', poId);
    }
    setPurchaseOrders(prev => prev.map(p => p.id === poId ? { ...p, status: 'PURCHASED' } : p));

    const newTransaction: Transaction = {
      id: online ? '' : `t-auto-${Date.now()}`,
      projectId: po.projectId,
      description: `Compra: ${po.itemName}`,
      amount: po.totalEstimate,
      type: 'EXPENSE',
      category: 'Material',
      date: new Date().toISOString().split('T')[0],
      status: 'PAID'
    };
    await addTransaction(newTransaction);

    if (online && supabase) {
       const { data: existing } = await supabase.from('stock_items')
        .select('*').eq('project_id', po.projectId).eq('name', po.itemName).single();
       
       if (existing) {
         await supabase.from('stock_items').update({ quantity: existing.quantity + po.quantity }).eq('id', existing.id);
         setStock(prev => prev.map(s => s.id === existing.id ? { ...s, quantity: s.quantity + po.quantity } : s));
       } else {
         const { data: newItem } = await supabase.from('stock_items').insert([{
             project_id: po.projectId, name: po.itemName, quantity: po.quantity,
             min_quantity: 10, unit: 'un'
         }]).select().single();
         if (newItem) {
             setStock(prev => [...prev, {
                 id: newItem.id, projectId: po.projectId, name: po.itemName,
                 quantity: po.quantity, minQuantity: 10, unit: 'un', lastUpdated: newItem.last_updated
             }]);
         }
       }
    } else {
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
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      clients, projects, transactions, stock, purchaseOrders, logs,
      addClient, updateClient, removeClient,
      addProject, updateProject, removeProject,
      addTransaction, updateTransaction, removeTransaction,
      approvePurchaseOrder, requestPurchase, removePurchaseOrder,
      addLog, updateLog, removeLog
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