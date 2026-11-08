import React, { useState } from 'react';
import { WhatsAppGroup, AffiliateConfig } from '../lib/types';
import { EvolutionQrCodeModal } from './EvolutionQrCodeModal';
import { formatPhoneNumber } from '../lib/evolutionApi';
import { QrCode, ShieldCheck, Plus, Check, Power, RefreshCw, Users, Trash2, Smartphone, Clock, Settings2, Key, Server } from 'lucide-react';

interface GroupsManagerViewProps {
  groups: WhatsAppGroup[];
  config: AffiliateConfig;
  onToggleGroup: (id: string) => void;
  onAddGroup: (group: WhatsAppGroup) => void;
  onUpdateGroup: (id: string, updates: Partial<WhatsAppGroup>) => void;
  onDeleteGroup: (id: string) => void;
  onUpdateConfig: (config: Partial<AffiliateConfig>) => void;
}

export const GroupsManagerView: React.FC<GroupsManagerViewProps> = ({
  groups,
  config,
  onToggleGroup,
  onAddGroup,
  onUpdateGroup,
  onDeleteGroup,
  onUpdateConfig,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupParticipants, setNewGroupParticipants] = useState('850');
  const [newGroupCategory, setNewGroupCategory] = useState('Geral / Todos os Nichos');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  const activeSender = config.whatsappSenderNumber || config.whatsappPhoneNumber || '+55 (11) 98765-4321';

  const handleAddNewGroup = () => {
    if (!newGroupName.trim()) return;
    const newGroup: WhatsAppGroup = {
      id: `grp-${Date.now()}`,
      name: newGroupName.trim(),
      participantsCount: parseInt(newGroupParticipants) || 500,
      active: true,
      categoryFocus: newGroupCategory,
      antiSpamDelaySeconds: 15,
      allowedHoursStart: 8,
      allowedHoursEnd: 22,
    };
    onAddGroup(newGroup);
    setNewGroupName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & WhatsApp Connection Status */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
              config.whatsappConnected
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950/60 text-red-600 border-red-200 dark:border-red-900'
            }`}>
              <Smartphone className="w-7 h-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-base font-bold text-slate-900 dark:text-white">
                  Instância Evolution API · WhatsApp
                </h1>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  config.whatsappConnected
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                    : 'bg-red-100 dark:bg-red-950/80 text-red-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${config.whatsappConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {config.whatsappConnected ? 'Sessão Conectada & Ativa' : 'Desconectado'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span>
                  Número Remetente: <b className="font-mono text-slate-800 dark:text-slate-200">{formatPhoneNumber(activeSender)}</b>
                </span>
                <span>·</span>
                <span>
                  Instância: <code className="font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{config.evolutionInstanceName || 'clickofertas-disparador'}</code>
                </span>
                <span>·</span>
                <span>
                  Servidor: <code className="font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{config.evolutionApiUrl || 'https://api.evolution-api.com'}</code>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>{config.whatsappConnected ? 'Ver QR Code / Alterar Número' : 'Gerar QR Code WhatsApp'}</span>
            </button>

            <button
              onClick={() => onUpdateConfig({ whatsappConnected: !config.whatsappConnected })}
              className={`p-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                config.whatsappConnected
                  ? 'border-red-200 dark:border-red-900/60 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40'
                  : 'border-emerald-200 dark:border-emerald-900/60 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
              title={config.whatsappConnected ? 'Desconectar WhatsApp' : 'Conectar WhatsApp'}
            >
              <Power className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Groups List Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Grupos Cadastrados para Disparos ({groups.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Controle quais grupos recebem os envios do número remetente <b className="font-mono text-slate-700 dark:text-slate-300">{formatPhoneNumber(activeSender)}</b>
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Grupo</span>
          </button>
        </div>

        {/* Groups Grid / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((grp) => (
            <div
              key={grp.id}
              className={`p-4 rounded-xl border transition-all ${
                grp.active
                  ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  : 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {grp.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-mono tabular-nums">
                      <Users className="w-3 h-3 text-slate-400" />
                      {grp.participantsCount} membros
                    </span>
                    <span>·</span>
                    <span>{grp.categoryFocus}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleGroup(grp.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      grp.active
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {grp.active ? 'Ativo' : 'Pausado'}
                  </button>
                  <button
                    onClick={() => onDeleteGroup(grp.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                    title="Excluir grupo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Group Settings: Delay & Allowed Hours */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                    Delay Anti-Spam:
                  </span>
                  <select
                    value={grp.antiSpamDelaySeconds}
                    onChange={(e) => onUpdateGroup(grp.id, { antiSpamDelaySeconds: parseInt(e.target.value) })}
                    className="w-full text-xs p-1.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono"
                  >
                    <option value={10}>10 segundos</option>
                    <option value={15}>15 segundos (Padrão)</option>
                    <option value={20}>20 segundos</option>
                    <option value={30}>30 segundos (Seguro)</option>
                    <option value={45}>45 segundos (Ultra seguro)</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                    Horário Permitido:
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-700 dark:text-slate-300 pt-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{String(grp.allowedHoursStart).padStart(2, '0')}:00 às {String(grp.allowedHoursEnd).padStart(2, '0')}:00</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Evolution API & WhatsApp QR Code Modal */}
      {showQrModal && (
        <EvolutionQrCodeModal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          config={config}
          onUpdateConfig={onUpdateConfig}
        />
      )}

      {/* Add New Group Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Adicionar Grupo de WhatsApp
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome do Grupo no WhatsApp
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ex: 🔥 Click Ofertas & Descontos Tech VIP"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estimativa de Participantes
                </label>
                <input
                  type="number"
                  value={newGroupParticipants}
                  onChange={(e) => setNewGroupParticipants(e.target.value)}
                  placeholder="950"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nicho / Foco do Grupo
                </label>
                <input
                  type="text"
                  value={newGroupCategory}
                  onChange={(e) => setNewGroupCategory(e.target.value)}
                  placeholder="Ex: Geral, Eletrônicos, Moda, Bebês..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddNewGroup}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
              >
                Cadastrar Grupo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
