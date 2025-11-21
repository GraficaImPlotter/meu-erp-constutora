import React, { useState } from 'react';
import { 
  HardHat, LayoutDashboard, Users, FolderKanban, 
  DollarSign, Package, FileText, Settings, LogOut, Menu, X, Bell 
} from 'lucide-react';
import { AppProvider, useApp } from './components/AppContext';
import { NavItem, Role } from './types';

// Modules
import AuthScreen from './components/modules/Auth';
import DashboardModule from './components/modules/Dashboard';
import ClientsModule from './components/modules/Clients';
import ProjectsModule from './components/modules/Projects';
import FinanceModule from './components/modules/Finance';
import InventoryModule from './components/modules/Inventory';
import DailyLogsModule from './components/modules/DailyLogs';
import SettingsModule from './components/modules/Settings';

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard', roles: ['ADMIN', 'ENGINEER', 'FINANCE'] },
  { label: 'Obras', icon: FolderKanban, view: 'projects', roles: ['ADMIN', 'ENGINEER', 'FINANCE'] },
  { label: 'Financeiro', icon: DollarSign, view: 'finance', roles: ['ADMIN', 'FINANCE'] },
  { label: 'Clientes', icon: Users, view: 'clients', roles: ['ADMIN', 'FINANCE'] },
  { label: 'Estoque & Compras', icon: Package, view: 'inventory', roles: ['ADMIN', 'ENGINEER'] },
  { label: 'Diário de Obra', icon: FileText, view: 'logs', roles: ['ADMIN', 'ENGINEER'] },
  { label: 'Configurações', icon: Settings, view: 'settings', roles: ['ADMIN', 'ENGINEER', 'FINANCE'] },
];

const MainLayout = () => {
  const { currentUser, logout } = useApp();
  const [currentView, setCurrentView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!currentUser) return <AuthScreen />;

  const filteredNav = NAV_ITEMS.filter(item => item.roles.includes(currentUser.role));

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardModule />;
      case 'clients': return <ClientsModule />;
      case 'projects': return <ProjectsModule />;
      case 'finance': return <FinanceModule />;
      case 'inventory': return <InventoryModule />;
      case 'logs': return <DailyLogsModule />;
      case 'settings': return <SettingsModule />;
      default: return <DashboardModule />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-850 text-slate-300 border-r border-slate-800">
        <div className="flex items-center gap-3 h-16 px-6 border-b border-slate-800">
          <div className="p-2 bg-blue-600 rounded-lg">
            <HardHat className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">Construct<span className="text-blue-500">ERP</span></span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentView === item.view 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${currentView === item.view ? 'text-white' : 'text-slate-400'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 mb-4">
            <img src={currentUser.avatar} alt="User" className="w-8 h-8 rounded-full border border-slate-600" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{currentUser.role.toLowerCase()}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-slate-800 capitalize hidden sm:block">
              {NAV_ITEMS.find(i => i.view === currentView)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="absolute inset-0 z-50 md:hidden bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-64 h-full bg-slate-900 p-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-8">
                     <span className="font-bold text-white text-lg">ConstructERP</span>
                     <button onClick={() => setMobileMenuOpen(false)}><X className="text-white w-6 h-6"/></button>
                </div>
                {filteredNav.map((item) => (
                <button
                key={item.view}
                onClick={() => {
                    setCurrentView(item.view);
                    setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 mb-2 rounded-lg text-sm font-medium ${
                    currentView === item.view 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
                >
                <item.icon className="w-5 h-5" />
                {item.label}
                </button>
            ))}
            </div>
          </div>
        )}

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
             {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;