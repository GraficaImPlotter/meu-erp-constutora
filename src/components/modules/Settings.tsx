import React from 'react';
import { useApp } from '../AppContext';
import { Database, User, Bell, Cloud, Server, Code } from 'lucide-react';
import { SQL_SCHEMA } from '../../constants';

const SettingsModule = () => {
  const { currentUser } = useApp();

  return (
    <div className="space-y-6">
      <div>
         <h2 className="text-2xl font-bold text-slate-800">Configurações</h2>
         <p className="text-slate-500">Gerencie seu perfil e infraestrutura.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Profile Card */}
         <div className="lg:col-span-1 space-y-6">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" /> Meu Perfil
                </h3>
                <div className="flex flex-col items-center py-4">
                    <img src={currentUser?.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-slate-100 mb-4" />
                    <h4 className="font-bold text-xl">{currentUser?.name}</h4>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 mt-2">{currentUser?.role}</span>
                    <p className="text-slate-500 text-sm mt-1">{currentUser?.email}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                     <div className="flex justify-between items-center text-sm">
                         <span className="flex items-center gap-2 text-slate-600"><Bell className="w-4 h-4"/> Notificações</span>
                         <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                             <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                         </div>
                     </div>
                </div>
             </div>

             <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <Cloud className="w-5 h-5" /> Status do Sistema
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                    O sistema está rodando atualmente em modo: <strong>Demonstração (Mock Data)</strong>.
                </p>
                <div className="text-xs text-blue-600 space-y-1">
                    <div className="flex items-center gap-2"><Server className="w-3 h-3"/> Banco de Dados: Local Memory</div>
                    <div className="flex items-center gap-2"><Code className="w-3 h-3"/> Versão: v1.0.0-beta</div>
                </div>
             </div>
         </div>

         {/* SQL Viewer */}
         <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-lg flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-600" /> Instalação do Banco de Dados
                </h3>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-medium">PostgreSQL Ready</span>
            </div>
            <p className="text-sm text-slate-500 mb-4">
                Para colocar este sistema online, crie um projeto no <strong>Supabase</strong>, vá até o "SQL Editor" e execute o script abaixo.
                Isso criará todas as tabelas e relacionamentos necessários automaticamente.
            </p>
            
            <div className="relative bg-slate-900 rounded-lg p-4 overflow-hidden flex-1 group min-h-[400px]">
                 <div className="absolute top-0 left-0 w-full h-8 bg-slate-800 flex items-center gap-2 px-3">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                     <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                     <span className="text-xs text-slate-400 ml-2">schema.sql</span>
                 </div>
                 <pre className="mt-6 text-xs sm:text-sm text-blue-300 font-mono overflow-auto h-[350px] custom-scrollbar">
                    <code>{SQL_SCHEMA}</code>
                 </pre>
            </div>
            <div className="mt-4 flex justify-end">
                 <button 
                    onClick={() => navigator.clipboard.writeText(SQL_SCHEMA)}
                    className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors"
                 >
                     Copiar SQL para Área de Transferência
                 </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SettingsModule;