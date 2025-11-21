import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { ArrowUpCircle, ArrowDownCircle, Filter, Trash2, Plus, X } from 'lucide-react';
import { Transaction } from '../../types';

const FinanceModule = () => {
  const { transactions, removeTransaction, addTransaction, projects } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Transaction>>({ type: 'EXPENSE' });

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'ALL') return true;
    return t.type === filter;
  });

  const handleDelete = (id: string) => {
    if(window.confirm("Deseja excluir esta transação?")) {
        removeTransaction(id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if(formData.description && formData.amount) {
          addTransaction({
              id: `t-${Date.now()}`,
              description: formData.description,
              amount: Number(formData.amount),
              type: formData.type || 'EXPENSE',
              status: 'PAID',
              category: 'Geral',
              date: new Date().toISOString(),
              projectId: formData.projectId
          });
          setShowForm(false);
          setFormData({ type: 'EXPENSE' }); // Reset form
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Financeiro</h2>
          <p className="text-slate-500">Fluxo de caixa, contas a pagar e receber.</p>
        </div>
        <div className="flex gap-2">
             <button onClick={() => { setFormData({type: 'EXPENSE'}); setShowForm(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition-colors">
                 <Plus className="w-4 h-4"/> Nova
             </button>
            <button 
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
              Todos
            </button>
             <button 
              onClick={() => setFilter('INCOME')}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${filter === 'INCOME' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
              <ArrowUpCircle className="w-4 h-4" /> Entradas
            </button>
             <button 
              onClick={() => setFilter('EXPENSE')}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${filter === 'EXPENSE' ? 'bg-red-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
              <ArrowDownCircle className="w-4 h-4" /> Saídas
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      {t.type === 'INCOME' 
                        ? <div className="p-1 bg-emerald-100 rounded text-emerald-600"><ArrowUpCircle className="w-4 h-4"/></div> 
                        : <div className="p-1 bg-red-100 rounded text-red-600"><ArrowDownCircle className="w-4 h-4"/></div>
                      }
                      {t.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{t.category}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      t.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                      t.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {t.status === 'PAID' ? 'Pago/Recebido' : t.status === 'PENDING' ? 'Pendente' : 'Atrasado'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {t.type === 'EXPENSE' && '- '}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                      <button onClick={() => handleDelete(t.id)} className="text-slate-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showForm && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
               <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                   <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                       <h3 className="font-bold text-lg text-slate-800">Nova Movimentação</h3>
                       <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
                   </div>
                   
                   <form onSubmit={handleSave} className="p-6 space-y-4">
                       <div className="flex gap-4">
                           <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 rounded-lg border transition-colors ${formData.type === 'INCOME' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>
                               <input type="radio" name="ftype" className="hidden" checked={formData.type === 'INCOME'} onChange={() => setFormData({...formData, type: 'INCOME'})} />
                               <ArrowUpCircle className="w-4 h-4"/> Receita
                           </label>
                           <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 rounded-lg border transition-colors ${formData.type === 'EXPENSE' ? 'border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>
                               <input type="radio" name="ftype" className="hidden" checked={formData.type === 'EXPENSE'} onChange={() => setFormData({...formData, type: 'EXPENSE'})} />
                               <ArrowDownCircle className="w-4 h-4"/> Despesa
                           </label>
                       </div>
                       
                       <div>
                           <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Descrição</label>
                           <input 
                                placeholder="Ex: Pagamento Fornecedor" 
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none" 
                                required 
                                value={formData.description || ''} 
                                onChange={e => setFormData({...formData, description: e.target.value})} 
                            />
                       </div>

                       <div>
                           <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Valor (R$)</label>
                           <input 
                                placeholder="0,00" 
                                type="number" 
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none" 
                                required 
                                value={formData.amount || ''} 
                                onChange={e => setFormData({...formData, amount: Number(e.target.value)})} 
                            />
                       </div>
                        
                       <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Projeto (Opcional)</label>
                            <select 
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                                onChange={e => setFormData({...formData, projectId: e.target.value})}
                                value={formData.projectId || ''}
                            >
                                <option value="">Sem projeto vinculado</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                       </div>

                       <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                           <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
                           <button type="submit" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors">Salvar</button>
                       </div>
                   </form>
               </div>
           </div>
      )}
    </div>
  );
};

export default FinanceModule;