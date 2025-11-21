import React, { useState } from 'react';
import { HardHat, Shield, Loader2, ArrowRight } from 'lucide-react';
import { useApp } from '../AppContext';

const AuthScreen = () => {
  const { login } = useApp();
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = (role: string) => {
    setLoading(role);
    login(role);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side - Brand & Visuals */}
      <div className="md:w-1/2 bg-slate-900 relative overflow-hidden flex flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 opacity-20">
            {/* Abstract architectural pattern simulation */}
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 L100 0 L100 100 Z" fill="#2563EB" />
            </svg>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-600 rounded-xl">
              <HardHat className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">ConstructERP</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Construindo o futuro,<br />gerenciando o presente.
          </h1>
          <p className="text-slate-400 text-lg max-w-md">
            Uma plataforma unificada para engenharia, finanças e gestão de obras. 
            Simples, rápida e inteligente.
          </p>
        </div>

        <div className="relative z-10 text-sm text-slate-500">
          © 2024 Construct SaaS. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12 bg-slate-50">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">Acesse sua conta</h2>
            <p className="mt-2 text-slate-500">Selecione um perfil para demonstração</p>
          </div>

          <div className="space-y-4">
            <RoleButton 
              role="ADMIN" 
              title="Administrador" 
              desc="Acesso total ao sistema e configurações" 
              color="bg-slate-900 hover:bg-slate-800"
              icon={Shield}
              onClick={() => handleLogin('ADMIN')}
              loading={loading === 'ADMIN'}
            />
             <RoleButton 
              role="ENGINEER" 
              title="Engenheiro Chefe" 
              desc="Gestão de obras, diário e requisições" 
              color="bg-amber-600 hover:bg-amber-700"
              icon={HardHat}
              onClick={() => handleLogin('ENGINEER')}
              loading={loading === 'ENGINEER'}
            />
             <RoleButton 
              role="FINANCE" 
              title="Financeiro" 
              desc="Fluxo de caixa, aprovações e relatórios" 
              color="bg-emerald-600 hover:bg-emerald-700"
              icon={HardHat} 
              onClick={() => handleLogin('FINANCE')}
              loading={loading === 'FINANCE'}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">ou entre com email</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Corporativo</label>
              <input 
                type="email" 
                id="email" 
                className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="nome@empresa.com"
                disabled
              />
            </div>
             <div>
              <label htmlFor="pass" className="block text-sm font-medium text-slate-700">Senha</label>
              <input 
                type="password" 
                id="pass" 
                className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
                disabled
              />
            </div>
            <button disabled className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 opacity-50 cursor-not-allowed">
              Entrar (Demo Mode)
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const RoleButton = ({ role, title, desc, color, icon: Icon, onClick, loading }: any) => (
  <button 
    onClick={onClick}
    disabled={!!loading}
    className={`w-full group relative flex items-center p-4 rounded-xl transition-all duration-200 border border-transparent hover:shadow-lg ${color} text-white text-left`}
  >
    <div className="mr-4 p-2 bg-white/10 rounded-lg backdrop-blur-sm">
      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Icon className="w-6 h-6" />}
    </div>
    <div className="flex-1">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-xs text-white/70">{desc}</p>
    </div>
    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
  </button>
);

export default AuthScreen;