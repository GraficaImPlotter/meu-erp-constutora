import { Client, DailyLog, Project, PurchaseOrder, StockItem, Transaction, User } from './types';

export const USERS: Record<string, User> = {
  ADMIN: {
    id: 'u1',
    name: 'Carlos Admin',
    email: 'admin@constructora.com',
    role: 'ADMIN',
    avatar: 'https://i.pravatar.cc/150?u=u1',
  },
  ENGINEER: {
    id: 'u2',
    name: 'Eng. Roberto Silva',
    email: 'roberto@constructora.com',
    role: 'ENGINEER',
    avatar: 'https://i.pravatar.cc/150?u=u2',
  },
  FINANCE: {
    id: 'u3',
    name: 'Ana Souza',
    email: 'ana@constructora.com',
    role: 'FINANCE',
    avatar: 'https://i.pravatar.cc/150?u=u3',
  },
};

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Tech Solutions Ltda',
    type: 'PJ',
    document: '12.345.678/0001-90',
    email: 'contact@techsolutions.com',
    phone: '(11) 98765-4321',
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
  },
  {
    id: 'c2',
    name: 'João da Silva',
    type: 'PF',
    document: '123.456.789-00',
    email: 'joao.silva@email.com',
    phone: '(21) 99999-8888',
    address: 'Rua das Flores, 50',
    city: 'Rio de Janeiro',
    state: 'RJ',
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    clientId: 'c1',
    name: 'Edifício Horizon',
    address: 'Rua Augusta, 500, SP',
    status: 'IN_PROGRESS',
    budget: 5000000,
    spent: 2150000,
    startDate: '2023-06-01',
    completionDate: '2024-12-01',
    progress: 45,
    image: 'https://picsum.photos/800/600?random=1',
  },
  {
    id: 'p2',
    clientId: 'c2',
    name: 'Casa de Veraneio',
    address: 'Búzios, RJ',
    status: 'PLANNING',
    budget: 850000,
    spent: 25000,
    startDate: '2024-02-15',
    completionDate: '2024-10-30',
    progress: 5,
    image: 'https://picsum.photos/800/600?random=2',
  },
  {
    id: 'p3',
    clientId: 'c1',
    name: 'Reforma Galpão Logístico',
    address: 'Guarulhos, SP',
    status: 'COMPLETED',
    budget: 1200000,
    spent: 1150000,
    startDate: '2023-01-10',
    completionDate: '2023-08-20',
    progress: 100,
    image: 'https://picsum.photos/800/600?random=3',
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    projectId: 'p1',
    description: 'Pagamento 1ª Medição',
    amount: 500000,
    type: 'INCOME',
    category: 'Recebimento de Obra',
    date: '2023-07-05',
    status: 'PAID',
  },
  {
    id: 't2',
    projectId: 'p1',
    description: 'Compra de Concreto',
    amount: 45000,
    type: 'EXPENSE',
    category: 'Material',
    date: '2023-07-10',
    status: 'PAID',
  },
  {
    id: 't3',
    projectId: 'p1',
    description: 'Mão de Obra (Empreiteira A)',
    amount: 120000,
    type: 'EXPENSE',
    category: 'Mão de Obra',
    date: '2023-08-01',
    status: 'PAID',
  },
  {
    id: 't4',
    description: 'Licença de Software',
    amount: 1500,
    type: 'EXPENSE',
    category: 'Operacional',
    date: '2023-08-05',
    status: 'PENDING',
  },
  {
    id: 't5',
    projectId: 'p2',
    description: 'Entrada Projeto Arquitetônico',
    amount: 85000,
    type: 'INCOME',
    category: 'Projeto',
    date: '2024-01-20',
    status: 'PAID',
  },
];

export const MOCK_STOCK: StockItem[] = [
  {
    id: 's1',
    projectId: 'p1',
    name: 'Sacos de Cimento 50kg',
    quantity: 120,
    minQuantity: 50,
    unit: 'un',
    lastUpdated: '2023-10-25',
  },
  {
    id: 's2',
    projectId: 'p1',
    name: 'Tijolo Baiano',
    quantity: 400,
    minQuantity: 1000,
    unit: 'milheiro',
    lastUpdated: '2023-10-26',
  },
  {
    id: 's3',
    projectId: 'p2',
    name: 'Areia Média',
    quantity: 2,
    minQuantity: 5,
    unit: 'm³',
    lastUpdated: '2024-02-01',
  },
];

export const MOCK_PO: PurchaseOrder[] = [
  {
    id: 'po1',
    projectId: 'p1',
    requesterId: 'u2',
    itemName: 'Tijolo Baiano',
    quantity: 2000,
    unitPriceEstimate: 800,
    totalEstimate: 1600,
    status: 'PENDING',
    date: '2023-10-27',
  },
  {
    id: 'po2',
    projectId: 'p2',
    requesterId: 'u2',
    itemName: 'Areia Média',
    quantity: 10,
    unitPriceEstimate: 120,
    totalEstimate: 1200,
    status: 'APPROVED',
    date: '2024-02-02',
  },
];

export const MOCK_LOGS: DailyLog[] = [
  {
    id: 'l1',
    projectId: 'p1',
    authorId: 'u2',
    content: 'Hoje realizamos a concretagem da laje do segundo pavimento. Equipe completa. Nenhuma intercorrência.',
    date: '2023-09-15',
    weather: 'SUNNY',
    images: ['https://picsum.photos/200/200?random=10', 'https://picsum.photos/200/200?random=11'],
  },
  {
    id: 'l2',
    projectId: 'p1',
    authorId: 'u2',
    content: 'Chuva forte impediu trabalhos externos. Equipe realocada para reboco interno no térreo.',
    date: '2023-09-16',
    weather: 'RAINY',
    images: ['https://picsum.photos/200/200?random=12'],
  },
];

export const SQL_SCHEMA = `
-- Tabela de Usuários (RBAC)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) CHECK (role IN ('ADMIN', 'ENGINEER', 'FINANCE')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Clientes
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(2) CHECK (type IN ('PF', 'PJ')),
  document VARCHAR(20) UNIQUE NOT NULL, -- CPF ou CNPJ
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Obras/Projetos
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  name VARCHAR(255) NOT NULL,
  address TEXT,
  status VARCHAR(20) CHECK (status IN ('PLANNING', 'IN_PROGRESS', 'COMPLETED', 'PAUSED')),
  budget DECIMAL(15, 2) NOT NULL DEFAULT 0,
  start_date DATE,
  completion_date DATE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Transações Financeiras
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  type VARCHAR(10) CHECK (type IN ('INCOME', 'EXPENSE')),
  category VARCHAR(50),
  date DATE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('PENDING', 'PAID', 'OVERDUE')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualização automática de Saldo da Obra (Exemplo)
CREATE OR REPLACE FUNCTION update_project_spent() RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.type = 'EXPENSE' AND NEW.status = 'PAID' THEN
    UPDATE projects SET spent = (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE project_id = NEW.project_id AND type = 'EXPENSE' AND status = 'PAID') WHERE id = NEW.project_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`;
