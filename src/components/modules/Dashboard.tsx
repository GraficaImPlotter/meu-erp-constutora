import React from 'react';
import { useApp } from '../AppContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, Wallet, Activity } from 'lucide-react';

const DashboardModule = () => {
  const { transactions, projects } = useApp();

  // Calculations
  const income = transactions.filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = income - expense;

  // Chart Data Preparation
  const dataPie = [
    { name: 'Planejamento', value: projects.filter(p => p.status === 'PLANNING').length },
    { name: 'Em Andamento', value: projects.filter(p => p.status === 'IN_PROGRESS').length },
    { name: 'Concluído', value: projects.filter(p => p.status === 'COMPLETED').length },
  ];
  const COLORS = ['#94a3b8', '#3b82f6', '#10b981'];

  const dataBar = [
    { name: 'Entradas', amount: income },
    { name: 'Saídas', amount: expense },
  ];

  // Dummy monthly data for Area Chart
  const dataArea = [
    { name: 'Jan', saldo: 4000 },
    { name: 'Fev', saldo: 3000 },
    { name: 'Mar', saldo: 2000 },
    { name: 'Abr', saldo: 2780 },
    { name: 'Mai', saldo: 1890 },
    { name: 'Jun', saldo: 2390 },
    { name: 'Jul', saldo: 3490 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
        <p className="text-slate-500">Acompanhe os principais indicadores da construtora.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard title="Saldo Atual" value={balance} icon={Wallet} color="text-blue-600" bg="bg-blue-50" />
        <KPICard title="Receita Total" value={income} icon={ArrowUpCircle} color="text-emerald-600" bg="bg-emerald-50" />
        <KPICard title="Despesa Total" value={expense} icon={ArrowDownCircle} color="text-red-600" bg="bg-red-50" />
        <KPICard title="Obras Ativas" value={projects.filter(p => p.status === 'IN_PROGRESS').length} icon={Activity} isCurrency={false} color="text-amber-600" bg="bg-amber-50" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Receitas vs Despesas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataBar}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {dataBar.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Status das Obras</h3>
          <div className="h-64 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm text-slate-500">
            {dataPie.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Tendência de Fluxo de Caixa (6 Meses)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataArea}>
              <defs>
                <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="saldo" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSaldo)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon: Icon, color, bg, isCurrency = true }: any) => {
  const formattedValue = isCurrency 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    : value;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-4 rounded-full ${bg}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{formattedValue}</p>
      </div>
    </div>
  );
};

export default DashboardModule;