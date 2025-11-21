import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Package, AlertTriangle, ShoppingCart, CheckCircle, Plus, Trash2, X } from 'lucide-react';
import { PurchaseOrder } from '../../types';

const InventoryModule = () => {
  const { stock, purchaseOrders, currentUser, approvePurchaseOrder, requestPurchase, removePurchaseOrder, projects } = useApp();
  const [activeTab, setActiveTab] = useState<'STOCK' | 'PO'>('STOCK');
  const [showPOForm, setShowPOForm] = useState(false);

  // New PO Form State
  const [poForm, setPoForm] = useState<Partial<PurchaseOrder>>({ quantity: 1, unitPriceEstimate: 0 });

  const handleCreatePO = (e: React.FormEvent) => {
      e.preventDefault();
      if(poForm.itemName && poForm.projectId) {
          requestPurchase({
              id: `po-${Date.now()}`,
              projectId: poForm.projectId,
              requesterId: currentUser?.id || 'unknown',
              itemName: poForm.itemName,
              quantity: Number(poForm.quantity),
              unitPriceEstimate: Number(poForm.unitPriceEstimate),
              totalEstimate: Number(poForm.quantity) * Number(poForm.unitPriceEstimate),
              status: 'PENDING',
              date: new Date().toISOString()
          });
          setShowPOForm(false);
          setPoForm({ quantity: 1, unitPriceEstimate: 0 });
      }
  };

  const handleDeletePO = (id: string) => {
      if(window.confirm("Deseja excluir esta requisição?")) {
          removePurchaseOrder(id);
      }
  }

  // Common input style
  const inputClass = "w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Estoque & Suprimentos</h2>
          <p className="text-slate-500">Controle de materiais e requisições de compra.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('STOCK')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'STOCK' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Almoxarifado (Estoque)
        </button>
        <button 
           onClick={() => setActiveTab('PO')}
           className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'PO' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Requisições de Compra
        </button>
      </div>

      {/* Content */}
      {activeTab === 'STOCK' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stock.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    {item.quantity <= item.minQuantity && (
                        <div className="absolute top-0 right-0 p-2 bg-amber-100 rounded-bl-xl text-amber-600 flex items-center gap-1 text-xs font-bold">
                            <AlertTriangle className="w-3 h-3" /> Baixo Estoque
                        </div>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-slate-100 rounded-lg text-slate-600">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{item.name}</h3>
                            <p className="text-xs text-slate-500">Proj: {projects.find(p => p.id === item.projectId)?.name || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-slate-900">{item.quantity}</span>
                        <span className="text-sm text-slate-500 mb-1">{item.unit}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                        <span>Min: {item.minQuantity} {item.unit}</span>
                        <span>Atualizado: {new Date(item.lastUpdated).toLocaleDateString()}</span>
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button onClick={() => setShowPOForm(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 shadow-sm">
                    <Plus className="w-4 h-4" /> Nova Requisição
                </button>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Item</th>
                            <th className="px-6 py-4">Projeto</th>
                            <th className="px-6 py-4">Qtd.</th>
                            <th className="px-6 py-4">Total Est.</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Ação</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {purchaseOrders.map(po => (
                            <tr key={po.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{po.itemName}</td>
                                <td className="px-6 py-4 text-slate-500">{projects.find(p => p.id === po.projectId)?.name}</td>
                                <td className="px-6 py-4">{po.quantity}</td>
                                <td className="px-6 py-4">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(po.totalEstimate)}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        po.status === 'PURCHASED' ? 'bg-emerald-100 text-emerald-700' :
                                        po.status === 'APPROVED' ? 'bg-blue-100 text-blue-700' :
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                        {po.status === 'PURCHASED' ? 'Comprado' : po.status === 'APPROVED' ? 'Aprovado' : 'Pendente'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {po.status === 'PENDING' && (currentUser?.role === 'ADMIN' || currentUser?.role === 'FINANCE') && (
                                        <button 
                                            onClick={() => approvePurchaseOrder(po.id)}
                                            className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800 font-medium"
                                        >
                                            <ShoppingCart className="w-4 h-4" /> Comprar
                                        </button>
                                    )}
                                    {po.status === 'PURCHASED' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleDeletePO(po.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* PO Modal */}
      {showPOForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                   <h3 className="font-bold text-lg text-slate-800">Nova Requisição</h3>
                   <button onClick={() => setShowPOForm(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
                </div>
                <form onSubmit={handleCreatePO} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Obra</label>
                        <select className={inputClass} required onChange={e => setPoForm({...poForm, projectId: e.target.value})} value={poForm.projectId || ''}>
                            <option value="">Selecione...</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nome do Material</label>
                        <input className={inputClass} placeholder="Ex: Tijolo, Cimento, Areia" required value={poForm.itemName || ''} onChange={e => setPoForm({...poForm, itemName: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Quantidade</label>
                            <input type="number" className={inputClass} required value={poForm.quantity} onChange={e => setPoForm({...poForm, quantity: Number(e.target.value)})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Preço Unit. Est. (R$)</label>
                            <input type="number" className={inputClass} required value={poForm.unitPriceEstimate} onChange={e => setPoForm({...poForm, unitPriceEstimate: Number(e.target.value)})} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                        <button type="button" onClick={() => setShowPOForm(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors">Solicitar Compra</button>
                    </div>
                </form>
            </div>
          </div>
      )}
    </div>
  );
};

export default InventoryModule;