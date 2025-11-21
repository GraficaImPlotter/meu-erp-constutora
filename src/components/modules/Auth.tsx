import React, { useState } from 'react';
import { HardHat, Shield, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../AppContext';

const AuthScreen = () => {
  const { login } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err: any) {
      console.error(err);
      setError('Email ou senha incorretos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side - Brand & Visuals */}
      <div className="md:w-1/2 bg-slate-900 relative overflow-hidden flex flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 opacity-20">
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
            <p className="mt-2 text-slate-500">Entre com suas credenciais corporativas.</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Corporativo</label>
              <input 
                type="email" 
                id="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900"
                placeholder="nome@empresa.com"
              />
            </div>
             <div>
              <label htmlFor="pass" className="block text-sm font-medium text-slate-700">Senha</label>
              <input 
                type="password" 
                id="pass" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {isLoading ? 'Entrando...' : 'Entrar no Sistema'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Esqueceu a senha? Contate o suporte de TI.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;