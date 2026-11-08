import React, { useState, useEffect } from 'react';
import { AffiliateConfig, DealCategory } from '../lib/types';
import { testFirebaseConnection, firebaseAppConfig } from '../lib/firebase';
import { testEvolutionApiConnection, formatPhoneNumber } from '../lib/evolutionApi';
import { EvolutionQrCodeModal } from './EvolutionQrCodeModal';
import { Save, Check, Database, Zap, Smartphone, Link, ShieldCheck, RefreshCw, QrCode, Server, Key } from 'lucide-react';

interface AffiliateSettingsViewProps {
  config: AffiliateConfig;
  onSaveConfig: (newConfig: Partial<AffiliateConfig>) => void;
  onResetData: () => void;
}

export const AffiliateSettingsView: React.FC<AffiliateSettingsViewProps> = ({
  config,
  onSaveConfig,
  onResetData,
}) => {
  const [formData, setFormData] = useState<AffiliateConfig>({ ...config });
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [evoTestStatus, setEvoTestStatus] = useState<{ testing: boolean; message?: string; success?: boolean }>({ testing: false });
  const [firebaseStatus, setFirebaseStatus] = useState<{ connected: boolean; message: string }>({
    connected: false,
    message: 'Verificando Firebase...',
  });
  const [checkingFirebase, setCheckingFirebase] = useState<boolean>(false);

  useEffect(() => {
    setFormData({ ...config });
    handleCheckFirebase();
  }, [config]);

  const handleCheckFirebase = async () => {
    setCheckingFirebase(true);
    const res = await testFirebaseConnection();
    setFirebaseStatus(res);
    setCheckingFirebase(false);
  };

  const handleTestEvolution = async () => {
    setEvoTestStatus({ testing: true });
    const res = await testEvolutionApiConnection(
      formData.evolutionApiUrl || 'https://api.evolution-api.com',
      formData.evolutionApiKey || '',
      formData.evolutionInstanceName || 'clickofertas-disparador'
    );
    setEvoTestStatus({ testing: false, success: res.success, message: res.message });
  };

  const handleToggleCategory = (cat: DealCategory) => {
    const list = formData.autoPilotSelectedCategories || [];
    if (list.includes(cat)) {
      setFormData({ ...formData, autoPilotSelectedCategories: list.filter(c => c !== cat) });
    } else {
      setFormData({ ...formData, autoPilotSelectedCategories: [...list, cat] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Configurações de Afiliados & Automação
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure suas tags das plataformas, parâmetros do robô automático e conexão com o Supabase
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Affiliate Tags */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Link className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Tags de Afiliado dos Marketplaces
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Todos os links colados ou capturados pelo robô serão automaticamente convertidos com suas tags para garantir suas comissões:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* Amazon Tag */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amazon Brasil (ID de Associados / Tag)
              </label>
              <input
                type="text"
                value={formData.amazonTag}
                onChange={(e) => setFormData({ ...formData, amazonTag: e.target.value })}
                placeholder="Ex: seunome-20"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">Ex: ofertaszap-20 (insere ?tag=... em links da Amazon)</span>
            </div>

            {/* Shopee Tag */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Shopee Afiliados (Sub-ID ou Link Base)
              </label>
              <input
                type="text"
                value={formData.shopeeTag}
                onChange={(e) => setFormData({ ...formData, shopeeTag: e.target.value })}
                placeholder="Ex: ofertaszap ou https://s.shopee.com.br/..."
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">Insere parâmetro de tracking ou rota de subafiliado</span>
            </div>

            {/* Mercado Livre Tag */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mercado Livre Afiliados (Matt Tool / ID)
              </label>
              <input
                type="text"
                value={formData.mercadoLivreTag}
                onChange={(e) => setFormData({ ...formData, mercadoLivreTag: e.target.value })}
                placeholder="Ex: MLAFI-AUTO998"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">Injetado automaticamente na URL do Mercado Livre</span>
            </div>

            {/* Magazine Luiza */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Magazine Luiza (Nome da sua loja Magazine Você)
              </label>
              <input
                type="text"
                value={formData.magaluTag}
                onChange={(e) => setFormData({ ...formData, magaluTag: e.target.value })}
                placeholder="Ex: magazineofertasvip"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">Converte para magazinevoce.com.br/sualoja/p/...</span>
            </div>

            {/* AliExpress */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                AliExpress Portals (Tracking Link)
              </label>
              <input
                type="text"
                value={formData.aliexpressTag}
                onChange={(e) => setFormData({ ...formData, aliexpressTag: e.target.value })}
                placeholder="Ex: https://s.click.aliexpress.com/e/_meuid"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>

            {/* Link Shortener */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Prefixo do Encurtador de Links
              </label>
              <input
                type="text"
                value={formData.shortenerPrefix}
                onChange={(e) => setFormData({ ...formData, shortenerPrefix: e.target.value })}
                placeholder="https://achad.in/"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Evolution API & WhatsApp Sender Phone */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Instância Evolution API & WhatsApp Remetente
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Gerar / Ver QR Code</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure o endpoint da Evolution API e o número de WhatsApp responsável pelo envio das mensagens nos grupos:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Sender Number */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Número de WhatsApp Remetente (DDI + DDD + Telefone)
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-2.5 w-4 h-4 text-emerald-600" />
                <input
                  type="text"
                  value={formData.whatsappSenderNumber}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    whatsappSenderNumber: e.target.value,
                    whatsappPhoneNumber: e.target.value,
                  })}
                  placeholder="+55 (11) 98765-4321"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Ex: +55 (11) 98765-4321. Este número emitirá os disparos automáticos.</span>
            </div>

            {/* Instance Name */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nome da Instância Evolution API
              </label>
              <div className="relative">
                <Server className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.evolutionInstanceName}
                  onChange={(e) => setFormData({ ...formData, evolutionInstanceName: e.target.value })}
                  placeholder="clickofertas-disparador"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Identificador único da instância no seu servidor Evolution.</span>
            </div>

            {/* Evolution API Server URL */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                URL do Servidor Evolution API
              </label>
              <input
                type="url"
                value={formData.evolutionApiUrl}
                onChange={(e) => setFormData({ ...formData, evolutionApiUrl: e.target.value })}
                placeholder="https://api.evolution-api.com"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">Endereço HTTP/HTTPS da sua instalação Evolution API.</span>
            </div>

            {/* Evolution API Key */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Chave de Autenticação Global (API Key / Token)
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={formData.evolutionApiKey}
                  onChange={(e) => setFormData({ ...formData, evolutionApiKey: e.target.value })}
                  placeholder="EVOLUTION_API_KEY_SECRET"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Chave segura passada no header apikey para autorizar requisições.</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleTestEvolution}
              disabled={evoTestStatus.testing}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${evoTestStatus.testing ? 'animate-spin' : ''}`} />
              <span>{evoTestStatus.testing ? 'Testando Conexão...' : 'Testar Conexão com a Evolution API'}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 ${
                formData.whatsappConnected
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                <span className={`w-2 h-2 rounded-full ${formData.whatsappConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {formData.whatsappConnected ? 'Sessão Ativa no WhatsApp' : 'Aguardando Pareamento QR Code'}
              </span>
            </div>
          </div>

          {evoTestStatus.message && (
            <div className={`p-2.5 rounded-lg text-[11px] font-medium ${
              evoTestStatus.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {evoTestStatus.message}
            </div>
          )}
        </div>

        {/* Section 3: Auto-Pilot Robot */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Zap className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Robô Piloto Automático de Disparos
            </h2>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Disparo 100% Automático Sem Intervenção Manual
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                O robô monitora quedas de preço e despacha sozinho para os grupos ativos
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoPilotEnabled}
                onChange={(e) => setFormData({ ...formData, autoPilotEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Intervalo Entre Envios Automáticos
              </label>
              <select
                value={formData.autoPilotIntervalMinutes}
                onChange={(e) => setFormData({ ...formData, autoPilotIntervalMinutes: parseInt(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
              >
                <option value={15}>A cada 15 minutos</option>
                <option value={25}>A cada 25 minutos (Recomendado)</option>
                <option value={40}>A cada 40 minutos</option>
                <option value={60}>A cada 1 hora</option>
                <option value={120}>A cada 2 horas</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Desconto Mínimo para Disparo Automático
              </label>
              <select
                value={formData.autoPilotMinDiscount}
                onChange={(e) => setFormData({ ...formData, autoPilotMinDiscount: parseInt(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
              >
                <option value={20}>A partir de 20% OFF</option>
                <option value={30}>A partir de 30% OFF</option>
                <option value={35}>A partir de 35% OFF (Padrão)</option>
                <option value={50}>Apenas Super Ofertas (≥ 50% OFF)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Firebase Cloud Firestore */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Banco de Dados na Nuvem: Google Firebase Firestore
              </h2>
            </div>
            <button
              type="button"
              onClick={handleCheckFirebase}
              disabled={checkingFirebase}
              className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingFirebase ? 'animate-spin' : ''}`} />
              <span>Testar Conexão Firebase</span>
            </button>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Status do Servidor Firestore:</span>
              <span className={`font-semibold flex items-center gap-1.5 ${firebaseStatus.connected ? 'text-emerald-600' : 'text-amber-500'}`}>
                <span className={`w-2 h-2 rounded-full ${firebaseStatus.connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {firebaseStatus.message}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono truncate">
              Projeto ID: <span className="font-semibold text-slate-700 dark:text-slate-300">{firebaseAppConfig.projectId}</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono truncate">
              Database ID: <span className="font-semibold text-slate-700 dark:text-slate-300">{firebaseAppConfig.firestoreDatabaseId}</span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onResetData}
            className="text-xs text-red-600 dark:text-red-400 hover:underline"
          >
            Restaurar Catálogo de Exemplo Original
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Configurações Salvas!' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </form>

      {/* Evolution API QR Code Pairing Modal */}
      {showQrModal && (
        <EvolutionQrCodeModal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          config={formData}
          onUpdateConfig={(newCfg) => {
            setFormData(prev => ({ ...prev, ...newCfg }));
            onSaveConfig(newCfg);
          }}
        />
      )}

    </div>
  );
};
