import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Calendar, MapPin, TrendingUp, DollarSign, Sparkles, X, ChevronDown, ChevronUp, Edit, Trash2, Plus } from 'lucide-react';
import { getMaterialSuggestions } from '../../services/geminiService';
import { Project } from '../../types';

const ProjectsModule = () => {
  const { projects, removeProject, addProject, updateProject, clients } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Deseja realmente excluir esta obra?")) {
        removeProject(id);
    }
  };

  const handleEdit = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData(project);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCreate = () => {
      setFormData({
          status: 'PLANNING',
          progress: 0,
          spent: 0,
          budget: 0,
          name: '',
          address: '',
          image: `https://picsum.photos/800/600?random=${Date.now()}`
      });
      setIsEditing(false);
      setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(formData.name && formData.clientId) {
          const projectData: Project = {
            id: isEditing ? formData.id! : `p-${Date.now()}`,
            clientId: formData.clientId,
            name: formData.name,
            address: formData.address || '',
            status: formData.status || 'PLANNING',
            budget: Number(formData.budget),
            spent: Number(formData.spent),
            startDate: formData.startDate || new Date().toISOString(),
            completionDate: formData.completionDate || new Date().toISOString(),
            progress: Number(formData.progress),
            image: formData.image || ''
          };

          if(isEditing) updateProject(projectData);
          else addProject(projectData);
          
          setShowForm(false);
      }
  };

  // Helper class for inputs to ensure white background and consistent styling
  const inputClassName = "w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Obras & Projetos</h2>
          <p className="text-slate-500">Gerenciamento físico e financeiro das obras.</p>
        </div>
        <button onClick={handleCreate} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition-colors">
            <Plus className="w-4 h-4"/> Nova Obra
        </button>
      </div>

      <div className="grid gap-6">
        {projects.map(project => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            expanded={expandedId === project.id}
            onToggle={() => setExpandedId(expandedId === project.id ? null : project.id)}
            onDelete={(e) => handleDelete(project.id, e)}
            onEdit={(e) => handleEdit(project, e)}
          />
        ))}
      </div>

       {/* Modal Form */}
       {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <h3 className="font-bold text-lg text-slate-800">{isEditing ? 'Editar Obra' : 'Nova Obra'}</h3>
                 <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
             </div>
             
             <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nome da Obra <span className="text-red-500">*</span></label>
                    <input 
                        required 
                        className={inputClassName} 
                        value={formData.name || ''} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        placeholder="Ex: Edifício Horizon"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Cliente <span className="text-red-500">*</span></label>
                    <select 
                        required 
                        className={inputClassName} 
                        value={formData.clientId || ''} 
                        onChange={e => setFormData({...formData, clientId: e.target.value})}
                    >
                        <option value="">Selecione um Cliente</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                     <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Endereço</label>
                     <input 
                        className={inputClassName} 
                        value={formData.address || ''} 
                        onChange={e => setFormData({...formData, address: e.target.value})} 
                        placeholder="Ex: Rua Augusta, 500, SP"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Orçamento (R$)</label>
                        <input 
                            type="number" 
                            className={inputClassName} 
                            value={formData.budget} 
                            onChange={e => setFormData({...formData, budget: Number(e.target.value)})} 
                        />
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Status</label>
                        <select 
                            className={inputClassName} 
                            value={formData.status} 
                            onChange={e => setFormData({...formData, status: e.target.value as any})}
                        >
                             <option value="PLANNING">Planejamento</option>
                             <option value="IN_PROGRESS">Em Andamento</option>
                             <option value="PAUSED">Pausado</option>
                             <option value="COMPLETED">Concluído</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Data Início</label>
                        <input 
                            type="date" 
                            className={inputClassName} 
                            value={formData.startDate?.split('T')[0]} 
                            onChange={e => setFormData({...formData, startDate: e.target.value})} 
                        />
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Data Entrega</label>
                        <input 
                            type="date" 
                            className={inputClassName} 
                            value={formData.completionDate?.split('T')[0]} 
                            onChange={e => setFormData({...formData, completionDate: e.target.value})} 
                        />
                    </div>
                </div>
                 {isEditing && (
                     <div className="pt-2">
                         <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-bold text-slate-600 uppercase">Progresso (%)</label>
                            <span className="text-sm font-bold text-blue-600">{formData.progress || 0}%</span>
                         </div>
                         <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:transition-all hover:[&::-webkit-slider-thumb]:scale-110"
                            style={{
                                background: `linear-gradient(to right, #2563eb ${formData.progress || 0}%, #e2e8f0 ${formData.progress || 0}%)`
                            }}
                            value={formData.progress || 0} 
                            onChange={e => setFormData({...formData, progress: Number(e.target.value)})} 
                         />
                     </div>
                 )}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                    <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
                    <button type="submit" className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-colors">{isEditing ? 'Salvar Alterações' : 'Criar Obra'}</button>
                </div>
             </form>
          </div>
        </div>
       )}
    </div>
  );
};

const ProjectCard = ({ project, expanded, onToggle, onDelete, onEdit }: any) => {
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'bg-amber-100 text-amber-700';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700';
      case 'PLANNING': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const statusLabel: any = {
    IN_PROGRESS: 'Em Andamento',
    COMPLETED: 'Concluído',
    PLANNING: 'Planejamento',
    PAUSED: 'Pausado'
  };

  const handleAiSuggest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (aiSuggestion) return; // Already loaded

    setLoadingAi(true);
    // Determine phase based on progress
    let phase = "Fundação";
    if (project.progress > 20) phase = "Estrutura";
    if (project.progress > 60) phase = "Acabamento";
    if (project.progress > 90) phase = "Entrega";

    const suggestion = await getMaterialSuggestions(phase, project.name);
    setAiSuggestion(suggestion);
    setLoadingAi(false);
  };

  return (
    <div className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${expanded ? 'border-blue-300 shadow-lg ring-1 ring-blue-100' : 'border-slate-200 shadow-sm hover:shadow-md'} relative group`}>
      
      <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-sm">
            <button onClick={onEdit} className="p-1.5 text-slate-600 hover:text-blue-600 rounded-md" title="Editar">
                <Edit className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="p-1.5 text-slate-600 hover:text-red-600 rounded-md" title="Excluir">
                <Trash2 className="w-4 h-4" />
            </button>
      </div>

      <div className="p-6 cursor-pointer" onClick={onToggle}>
        <div className="flex flex-col md:flex-row gap-6">
          <img src={project.image} alt={project.name} className="w-full md:w-32 h-32 object-cover rounded-lg bg-slate-200" />
          
          <div className="flex-1 space-y-3">
             <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-xl font-bold text-slate-900">{project.name}</h3>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    {project.address}
                  </div>
               </div>
               <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(project.status)}`}>
                 {statusLabel[project.status]}
               </span>
             </div>

             <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600 font-medium">
                  <span>Progresso Físico</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{width: `${project.progress}%`}}></div>
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div className="text-sm">
                  <p className="text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3"/> Início</p>
                  <p className="font-medium">{new Date(project.startDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="text-sm">
                  <p className="text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3"/> Entrega</p>
                  <p className="font-medium">{new Date(project.completionDate).toLocaleDateString('pt-BR')}</p>
                </div>
             </div>
          </div>
          <div className="flex items-center justify-center md:justify-end">
             {expanded ? <ChevronUp className="text-slate-400"/> : <ChevronDown className="text-slate-400"/>}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-6 pb-6 pt-0 border-t border-slate-100 bg-slate-50/50">
          <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Finance Stats */}
            <div className="bg-white p-5 rounded-lg border border-slate-200">
               <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                 <DollarSign className="w-5 h-5 text-emerald-600" /> Financeiro
               </h4>
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <span className="text-slate-500 text-sm">Orçamento Total</span>
                   <span className="font-bold text-slate-800">
                     {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(project.budget)}
                   </span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-slate-500 text-sm">Gasto Realizado</span>
                   <span className="font-bold text-red-600">
                     {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(project.spent)}
                   </span>
                 </div>
                 <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${project.spent > project.budget ? 'bg-red-500' : 'bg-emerald-500'}`} 
                         style={{width: `${Math.min(100, (project.spent/project.budget)*100)}%`}}>
                    </div>
                 </div>
               </div>
            </div>

            {/* AI Integration */}
            <div className="bg-white p-5 rounded-lg border border-slate-200">
               <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" /> Gemini Insights
                  </h4>
                  {!aiSuggestion && (
                    <button 
                      onClick={handleAiSuggest}
                      className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded hover:bg-purple-200 transition-colors"
                      disabled={loadingAi}
                    >
                      {loadingAi ? 'Analisando...' : 'Sugerir Compras'}
                    </button>
                  )}
               </div>
               
               <div className="min-h-[100px] text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {loadingAi ? (
                    <div className="flex items-center justify-center h-full gap-2 text-purple-600 animate-pulse">
                      <Sparkles className="w-4 h-4" /> Analisando fase da obra e estoque...
                    </div>
                  ) : aiSuggestion ? (
                    <div className="prose prose-sm prose-purple">
                      <p className="font-medium text-purple-900 mb-2">Com base na fase atual:</p>
                      <div className="whitespace-pre-line">{aiSuggestion}</div>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-center pt-6">Clique em "Sugerir Compras" para usar a IA e identificar materiais críticos.</p>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsModule;