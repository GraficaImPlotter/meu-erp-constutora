import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Sun, CloudRain, Cloud, Calendar, Trash2, Plus, Edit, X } from 'lucide-react';
import { DailyLog } from '../../types';

const DailyLogsModule = () => {
  const { logs, projects, currentUser, removeLog, addLog, updateLog } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<DailyLog>>({
    weather: 'SUNNY', 
    content: '', 
    projectId: '',
    date: new Date().toISOString().split('T')[0]
  });

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'SUNNY': return <Sun className="w-5 h-5 text-amber-500" />;
      case 'RAINY': return <CloudRain className="w-5 h-5 text-blue-500" />;
      default: return <Cloud className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleDelete = (id: string) => {
      if(window.confirm("Excluir este registro do diário?")) {
          removeLog(id);
      }
  };

  const handleOpenCreate = () => {
      setFormData({
          weather: 'SUNNY', 
          content: '', 
          projectId: '',
          date: new Date().toISOString().split('T')[0]
      });
      setIsEditing(false);
      setShowForm(true);
  };

  const handleOpenEdit = (log: DailyLog) => {
      setFormData({
          ...log,
          date: log.date.split('T')[0] // Format date for input type="date"
      });
      setIsEditing(true);
      setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(formData.content && formData.projectId) {
          const logData: DailyLog = {
              id: isEditing ? formData.id! : `l-${Date.now()}`,
              projectId: formData.projectId,
              authorId: formData.authorId || currentUser?.id || 'u-unknown',
              content: formData.content,
              date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
              weather: formData.weather as any,
              images: formData.images || []
          };

          if (isEditing) {
              updateLog(logData);
          } else {
              addLog(logData);
          }
          setShowForm(false);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-2xl font-bold text-slate-800">Diário de Obra</h2>
            <p className="text-slate-500">Registro diário de atividades e intercorrências.</p>
         </div>
         <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4"/> Novo Registro
         </button>
      </div>

      <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-8">
        {logs.map(log => {
          const project = projects.find(p => p.id === log.projectId);
          
          return (
            <div key={log.id} className="relative pl-8 group">
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-slate-50"></div>
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenEdit(log)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="Editar">
                        <Edit className="w-4 h-4"/>
                    </button>
                    <button onClick={() => handleDelete(log.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Excluir">
                        <Trash2 className="w-4 h-4"/>
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2 pr-20">
                   <div>
                      <h3 className="font-bold text-slate-900">{project?.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                         <Calendar className="w-3 h-3" />
                         {new Date(log.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-sm font-medium w-fit">
                      {getWeatherIcon(log.weather)}
                      <span className="capitalize text-slate-700">{log.weather === 'SUNNY' ? 'Ensolarado' : log.weather === 'RAINY' ? 'Chuvoso' : 'Nublado'}</span>
                   </div>
                </div>

                <p className="text-slate-700 mb-4 leading-relaxed whitespace-pre-line">
                  {log.content}
                </p>

                {log.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {log.images.map((img, idx) => (
                      <img key={idx} src={img} alt="Progresso" className="w-full h-24 object-cover rounded-lg border border-slate-200 hover:scale-105 transition-transform cursor-pointer" />
                    ))}
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                  Registrado por: {currentUser?.role === 'ENGINEER' ? 'Você' : 'Engenharia'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-800">{isEditing ? 'Editar Registro' : 'Novo Registro'}</h3>
                    <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Obra</label>
                        <select 
                            className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                            required 
                            value={formData.projectId || ''}
                            onChange={e => setFormData({...formData, projectId: e.target.value})}
                        >
                            <option value="">Selecione a Obra...</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Data</label>
                            <input 
                                type="date"
                                className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.date || ''}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Clima</label>
                            <select 
                                className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={formData.weather} 
                                onChange={e => setFormData({...formData, weather: e.target.value as any})}
                            >
                                <option value="SUNNY">Ensolarado</option>
                                <option value="CLOUDY">Nublado</option>
                                <option value="RAINY">Chuvoso</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Relatório</label>
                        <textarea 
                            className="w-full border border-slate-300 rounded-lg p-3 h-32 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                            placeholder="Descreva as atividades realizadas, efetivo e ocorrências do dia..." 
                            required
                            value={formData.content || ''}
                            onChange={e => setFormData({...formData, content: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-4">
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors">
                            {isEditing ? 'Salvar Alterações' : 'Registrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default DailyLogsModule;