import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Plus, Search, MapPin, Building2, User as UserIcon, MessageCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { Client } from '../../types';

const ClientsModule = () => {
  const { clients, addClient, updateClient, removeClient } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Client>>({ type: 'PJ' });
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenCreate = () => {
    setFormData({ type: 'PJ', name: '', document: '', email: '', phone: '', address: '', city: '', state: '' });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleOpenEdit = (client: Client) => {
    setFormData({ ...client });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      removeClient(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.name && formData.document) {
      const clientData: Client = {
        id: isEditing ? formData.id! : `c-${Date.now()}`,
        name: formData.name,
        document: formData.document,
        type: formData.type as 'PF'|'PJ' || 'PJ',
        email: formData.email || '',
        phone: formData.phone || '',
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
      };

      if (isEditing) {
        updateClient(clientData);
      } else {
        addClient(clientData);
      }
      setShowForm(false);
    }
  };

  // --- API INTEGRATIONS ---

  const fetchAddressByCEP = async () => {
    // Detect blur on address field.
    // If the user typed a CEP (8 digits), we fetch.
    const cepClean = formData.address?.replace(/\D/g, '');
    if (cepClean && cepClean.length === 8) {
        setIsLoadingAPI(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`);
            const data = await response.json();
            if (!data.erro) {
                setFormData(prev => ({
                    ...prev,
                    address: `${data.logradouro}, ${data.bairro}`,
                    city: data.localidade,
                    state: data.uf
                }));
            }
        } catch (error) {
            console.error("Erro ao buscar CEP", error);
        } finally {
            setIsLoadingAPI(false);
        }
    }
  };

  const fetchCNPJData = async () => {
      if (formData.type === 'PJ') {
          const cnpjClean = formData.document?.replace(/\D/g, '');
          if (cnpjClean && cnpjClean.length === 14) {
              setIsLoadingAPI(true);
              try {
                  const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjClean}`);
                  const data = await response.json();
                  if (data.cnpj) {
                      setFormData(prev => ({
                          ...prev,
                          name: data.razao_social,
                          email: data.email || prev.email,
                          phone: data.ddd_telefone_1 || prev.phone,
                          address: `${data.logradouro}, ${data.numero} - ${data.bairro}`, 
                          city: data.municipio,
                          state: data.uf
                      }));
                  }
              } catch (error) {
                  console.error("Erro ao buscar CNPJ", error);
              } finally {
                  setIsLoadingAPI(false);
              }
          }
      }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.document.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Clientes</h2>
          <p className="text-slate-500">Gerencie sua base de PF e PJ.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Buscar por nome ou CPF/CNPJ..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 text-slate-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Client List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
          <div key={client.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group">
            
            {/* Action Buttons (Visible on Hover) - Absolute Positioned */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => handleOpenEdit(client)} className="p-1.5 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm rounded-lg transition-all" title="Editar">
                    <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(client.id)} className="p-1.5 bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-200 shadow-sm rounded-lg transition-all" title="Excluir">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Header with Icon and Badge aligned LEFT to avoid overlap with buttons */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${client.type === 'PJ' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                {client.type === 'PJ' ? <Building2 className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded">
                {client.type}
              </span>
            </div>
            
            <h3 className="font-bold text-lg text-slate-800 mb-1 truncate pr-2">{client.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{client.document}</p>

            <div className="space-y-2 text-sm text-slate-600">
               <div className="flex items-center gap-2">
                 <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                 <span className="truncate">{client.city}, {client.state}</span>
               </div>
               {client.phone && (
                   <a 
                    href={`https://wa.me/55${client.phone.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-emerald-600 hover:underline"
                   >
                     <MessageCircle className="w-4 h-4" />
                     Whatsapp
                   </a>
               )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
               <h3 className="font-bold text-lg text-slate-800">{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</h3>
               {isLoadingAPI && <div className="flex items-center gap-2 text-xs text-blue-600"><Loader2 className="w-4 h-4 animate-spin"/> Buscando dados...</div>}
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Radio Group */}
                <div className="flex gap-6">
                    <label className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border transition-colors ${formData.type === 'PJ' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:bg-slate-50'}`}>
                        <input 
                            type="radio" 
                            name="type" 
                            className="text-blue-600 focus:ring-blue-500"
                            checked={formData.type === 'PJ'} 
                            onChange={() => setFormData({...formData, type: 'PJ'})} 
                        />
                        <span className="text-sm font-medium text-slate-700">Pessoa Jurídica</span>
                    </label>
                    <label className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border transition-colors ${formData.type === 'PF' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:bg-slate-50'}`}>
                        <input 
                            type="radio" 
                            name="type" 
                            className="text-blue-600 focus:ring-blue-500"
                            checked={formData.type === 'PF'} 
                            onChange={() => setFormData({...formData, type: 'PF'})} 
                        />
                        <span className="text-sm font-medium text-slate-700">Pessoa Física</span>
                    </label>
                </div>

                {/* Document & Name Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                            {formData.type === 'PJ' ? 'CNPJ' : 'CPF'} <span className="text-red-500">*</span>
                        </label>
                        <input 
                            required 
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-slate-900 placeholder-slate-400" 
                            placeholder={formData.type === 'PJ' ? '00.000.000/0000-00' : '000.000.000-00'}
                            value={formData.document || ''} 
                            onChange={e => setFormData({...formData, document: e.target.value})}
                            onBlur={fetchCNPJData}
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Digite apenas números para auto-completar (PJ).</p>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                             {formData.type === 'PJ' ? 'Razão Social' : 'Nome Completo'} <span className="text-red-500">*</span>
                        </label>
                        <input 
                            required 
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-slate-900 placeholder-slate-400" 
                            placeholder="Digite o nome"
                            value={formData.name || ''} 
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                        />
                    </div>
                </div>

                {/* Address Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                         <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                            Endereço (CEP)
                        </label>
                        <div className="relative">
                            <input 
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-slate-900 placeholder-slate-400" 
                                placeholder="Digite o CEP para buscar..."
                                value={formData.address || ''} 
                                onChange={e => setFormData({...formData, address: e.target.value})} 
                                onBlur={fetchAddressByCEP}
                            />
                             <MapPin className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Ex: 01001000 (Busca automática ViaCEP)</p>
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Celular / Whatsapp</label>
                        <input 
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-slate-900 placeholder-slate-400" 
                            placeholder="(00) 00000-0000"
                            value={formData.phone || ''} 
                            onChange={e => setFormData({...formData, phone: e.target.value})} 
                        />
                    </div>
                </div>

                {/* City State Email */}
                 <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-3 md:col-span-2">
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Cidade</label>
                        <input 
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-slate-900 placeholder-slate-400" 
                            value={formData.city || ''} 
                            onChange={e => setFormData({...formData, city: e.target.value})} 
                        />
                    </div>
                     <div className="col-span-3 md:col-span-1">
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Estado</label>
                        <input 
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-slate-900 placeholder-slate-400" 
                            placeholder="UF"
                            maxLength={2}
                            value={formData.state || ''} 
                            onChange={e => setFormData({...formData, state: e.target.value})} 
                        />
                    </div>
                     <div className="col-span-6 md:col-span-3">
                         <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email</label>
                        <input 
                            type="email"
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-900 placeholder-slate-400" 
                            placeholder="email@exemplo.com"
                            value={formData.email || ''} 
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                        />
                    </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-colors">
                        {isEditing ? 'Atualizar Cliente' : 'Salvar Cliente'}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsModule;