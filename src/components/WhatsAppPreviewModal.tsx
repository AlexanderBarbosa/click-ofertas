import React, { useState } from 'react';
import { DealOffer, WhatsAppGroup } from '../lib/types';
import { MESSAGE_TEMPLATES } from '../lib/mockData';
import { formatWhatsAppMessage, generateVariedCopy, formatBrl } from '../lib/copyGenerator';
import { X, Send, Sparkles, Clock, Check, Copy, CheckCheck, Smartphone, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WhatsAppPreviewModalProps {
  offer: DealOffer | null;
  groups: WhatsAppGroup[];
  isOpen: boolean;
  onClose: () => void;
  onDispatchNow: (offer: DealOffer, groupIds: string[], templateId: string, customMessage: string) => void;
  onScheduleOffer: (offer: DealOffer, groupIds: string[], templateId: string, scheduledTime: string, customMessage: string) => void;
}

export const WhatsAppPreviewModal: React.FC<WhatsAppPreviewModalProps> = ({
  offer,
  groups,
  isOpen,
  onClose,
  onDispatchNow,
  onScheduleOffer,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-achadinho');
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(() =>
    groups.filter(g => g.active).map(g => g.id)
  );
  const [messageText, setMessageText] = useState<string>(() =>
    offer ? formatWhatsAppMessage(offer, 'tpl-achadinho') : ''
  );
  const [scheduleMode, setScheduleMode] = useState<boolean>(false);
  const [scheduledDateTime, setScheduledDateTime] = useState<string>(() => {
    const d = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes in future
    return d.toISOString().slice(0, 16);
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  if (!isOpen || !offer) return null;

  const handleTemplateChange = (tplId: string) => {
    setSelectedTemplateId(tplId);
    setMessageText(formatWhatsAppMessage(offer, tplId));
  };

  const handleAiTone = (tone: 'urgente' | 'achadinho' | 'tecnico' | 'descontraido') => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      const generated = generateVariedCopy(offer, tone);
      setMessageText(generated);
      setIsGeneratingAi(false);
    }, 300);
  };

  const handleToggleGroup = (id: string) => {
    if (selectedGroupIds.includes(id)) {
      setSelectedGroupIds(selectedGroupIds.filter(g => g !== id));
    } else {
      setSelectedGroupIds([...selectedGroupIds, id]);
    }
  };

  const handleSelectAllGroups = () => {
    if (selectedGroupIds.length === groups.length) {
      setSelectedGroupIds([]);
    } else {
      setSelectedGroupIds(groups.map(g => g.id));
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerDispatch = () => {
    if (selectedGroupIds.length === 0) return;
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 }
    });
    onDispatchNow(offer, selectedGroupIds, selectedTemplateId, messageText);
    onClose();
  };

  const handleTriggerSchedule = () => {
    if (selectedGroupIds.length === 0) return;
    onScheduleOffer(offer, selectedGroupIds, selectedTemplateId, scheduledDateTime, messageText);
    onClose();
  };

  const activeGroupCount = selectedGroupIds.length;
  const targetGroupNames = groups
    .filter(g => selectedGroupIds.includes(g.id))
    .map(g => g.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden transition-colors">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Disparador de Oferta WhatsApp
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalize a copy, selecione os grupos e envie com tags de afiliado ativas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Left Configuration Panel (7 cols) */}
          <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col gap-6">
            
            {/* Offer Summary Kicker */}
            <div className="flex items-start gap-4 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <img
                src={offer.imageUrl}
                alt={offer.title}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-lg object-cover bg-white shrink-0 border border-slate-200 dark:border-slate-700"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">{offer.marketplace}</span>
                  <span>·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{offer.discountPercentage}% OFF</span>
                  {offer.couponCode && (
                    <>
                      <span>·</span>
                      <span className="text-amber-600 dark:text-amber-400 font-mono">Cupom: {offer.couponCode}</span>
                    </>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                  {offer.title}
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                    R$ {formatBrl(offer.currentPrice)}
                  </span>
                  <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                    R$ {formatBrl(offer.originalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Template Selector & AI Tones */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Formato de Copy / Template
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-400">Tom com IA:</span>
                  <button
                    onClick={() => handleAiTone('urgente')}
                    disabled={isGeneratingAi}
                    className="px-2 py-0.5 text-[11px] font-medium bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded hover:bg-red-100 transition-colors"
                  >
                    ⚡ Urgente
                  </button>
                  <button
                    onClick={() => handleAiTone('descontraido')}
                    disabled={isGeneratingAi}
                    className="px-2 py-0.5 text-[11px] font-medium bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-100 transition-colors"
                  >
                    ✨ Achadinho
                  </button>
                  <button
                    onClick={() => handleAiTone('tecnico')}
                    disabled={isGeneratingAi}
                    className="px-2 py-0.5 text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100 transition-colors"
                  >
                    📊 Técnico
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                {MESSAGE_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => handleTemplateChange(tpl.id)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      selectedTemplateId === tpl.id
                        ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-semibold">{tpl.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {tpl.description}
                    </div>
                  </button>
                ))}
              </div>

              {/* Editable Message Box */}
              <div className="relative">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={6}
                  className="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                  placeholder="Mensagem formatada para o WhatsApp..."
                />
                <button
                  onClick={handleCopyText}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Copy'}</span>
                </button>
              </div>
            </div>

            {/* Target Groups Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Grupos de Destino ({activeGroupCount} selecionado{activeGroupCount !== 1 ? 's' : ''})
                </label>
                <button
                  onClick={handleSelectAllGroups}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                >
                  {selectedGroupIds.length === groups.length ? 'Desmarcar todos' : 'Marcar todos'}
                </button>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {groups.map((grp) => {
                  const isChecked = selectedGroupIds.includes(grp.id);
                  return (
                    <label
                      key={grp.id}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer border transition-colors ${
                        isChecked
                          ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleGroup(grp.id)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700"
                        />
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                          {grp.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono tabular-nums shrink-0 ml-2">
                        {grp.participantsCount} membros
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Schedule Switcher */}
            {scheduleMode && (
              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg">
                <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">
                  Definir Data e Horário de Disparo:
                </label>
                <input
                  type="datetime-local"
                  value={scheduledDateTime}
                  onChange={(e) => setScheduledDateTime(e.target.value)}
                  className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>
            )}
          </div>

          {/* Right Preview Panel: WhatsApp Phone Simulation (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center">
            
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <span>Preview Real do WhatsApp</span>
              <span className="text-emerald-600 font-bold">● Ao vivo</span>
            </div>

            {/* Phone Container Mockup */}
            <div className="w-full max-w-[340px] rounded-3xl bg-slate-900 p-2.5 shadow-xl border border-slate-700/50">
              
              {/* Phone Screen */}
              <div className="rounded-[22px] bg-[#0b141a] overflow-hidden flex flex-col h-[480px]">
                
                {/* WhatsApp Chat Bar */}
                <div className="bg-[#202c33] px-3 py-2 flex items-center gap-2.5 border-b border-[#2a3942]">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#2a3942] bg-orange-100 flex items-center justify-center shrink-0">
                    <img
                      src="/public/assets/aistudio/Mascote_Click_Ofertas_0bad9dc5.jpg"
                      alt="Click Ofertas"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      {targetGroupNames[0] || '🔥 Click Ofertas VIP #1'}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {activeGroupCount > 1 ? `e mais ${activeGroupCount - 1} grupos selecionados` : 'online no grupo'}
                    </div>
                  </div>
                </div>

                {/* WhatsApp Chat Wall with Background Pattern */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
                  
                  {/* WhatsApp Message Bubble */}
                  <div className="max-w-[95%] bg-[#005c4b] text-[#e9edef] rounded-lg rounded-tl-none p-2.5 text-xs shadow-md space-y-2 relative border border-[#00705a]">
                    
                    {/* Image Banner */}
                    <div className="relative rounded-md overflow-hidden bg-black/40">
                      <img
                        src={offer.imageUrl}
                        alt={offer.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-36 object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow">
                        {offer.discountPercentage}% OFF
                      </div>
                      {offer.freeShipping && (
                        <div className="absolute bottom-2 right-2 bg-emerald-700 text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow">
                          FRETE GRÁTIS
                        </div>
                      )}
                    </div>

                    {/* WhatsApp Formatted Text */}
                    <div className="whitespace-pre-wrap font-sans text-[11px] leading-relaxed break-words">
                      {messageText}
                    </div>

                    {/* Time & Double Check status */}
                    <div className="flex items-center justify-end gap-1 text-[10px] text-[#8696a0] pt-1">
                      <span>Agora</span>
                      <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                    </div>
                  </div>

                </div>

                {/* WhatsApp Input Mockup Bottom */}
                <div className="bg-[#202c33] px-3 py-2 flex items-center gap-2 border-t border-[#2a3942]">
                  <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 text-[11px] text-slate-400">
                    Mensagem de oferta
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>
            </div>

            {/* Affiliate Tag & Evolution API confirmation */}
            <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between w-full max-w-[340px] px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Evolution API · Sessão Ativa</span>
              </span>
              <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Anti-Ban Ativo</span>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScheduleMode(!scheduleMode)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                scheduleMode
                  ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 text-amber-900 dark:text-amber-200'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{scheduleMode ? 'Agendamento Ativo' : 'Agendar para Depois'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cancelar
            </button>

            {scheduleMode ? (
              <button
                onClick={handleTriggerSchedule}
                disabled={activeGroupCount === 0}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 disabled:opacity-50 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>Programar Envio ({activeGroupCount} Grupos)</span>
              </button>
            ) : (
              <button
                onClick={handleTriggerDispatch}
                disabled={activeGroupCount === 0}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Disparar Agora para {activeGroupCount} Grupo{activeGroupCount !== 1 ? 's' : ''}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
