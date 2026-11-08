import React, { useEffect, useState } from 'react';
import { DealOffer, WhatsAppGroup } from '../lib/types';
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2, Send, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BatchDispatchModalProps {
  isOpen: boolean;
  offer: DealOffer | null;
  groups: WhatsAppGroup[];
  targetGroupIds: string[];
  templateId: string;
  customMessage: string;
  onComplete: () => void;
  onClose: () => void;
}

export const BatchDispatchModal: React.FC<BatchDispatchModalProps> = ({
  isOpen,
  offer,
  groups,
  targetGroupIds,
  templateId,
  customMessage,
  onComplete,
  onClose,
}) => {
  const targetGroups = groups.filter(g => targetGroupIds.includes(g.id));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [dispatchedGroups, setDispatchedGroups] = useState<{ id: string; name: string; status: 'pending' | 'sending' | 'sent' | 'failed' }[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [antiSpamCountdown, setAntiSpamCountdown] = useState<number>(0);

  useEffect(() => {
    if (!isOpen || !offer) return;

    // Initialize group statuses
    setDispatchedGroups(targetGroups.map(g => ({ id: g.id, name: g.name, status: 'pending' })));
    setCurrentIndex(0);
    setIsFinished(false);

    let active = true;

    async function runBatch() {
      for (let i = 0; i < targetGroups.length; i++) {
        if (!active) break;
        setCurrentIndex(i);

        // Mark as sending
        setDispatchedGroups(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'sending' } : item));

        // Simulate network API post to WhatsApp instance
        await new Promise(r => setTimeout(r, 1200));

        if (!active) break;

        // Mark as sent
        setDispatchedGroups(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'sent' } : item));

        // If there's another group, run simulated anti-ban safe delay
        if (i < targetGroups.length - 1) {
          const delaySec = 2; // Fast safe demo delay
          for (let c = delaySec; c > 0; c--) {
            if (!active) break;
            setAntiSpamCountdown(c);
            await new Promise(r => setTimeout(r, 600));
          }
          setAntiSpamCountdown(0);
        }
      }

      if (active) {
        setIsFinished(true);
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
        onComplete();
      }
    }

    runBatch();

    return () => {
      active = false;
    };
  }, [isOpen]);

  const progressPercent = targetGroups.length > 0 
    ? Math.round(((currentIndex + (isFinished ? 1 : 0)) / targetGroups.length) * 100)
    : 100;

  if (!isOpen || !offer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isFinished ? 'Disparo Concluído com Sucesso!' : 'Disparando Mensagens nos Grupos'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isFinished ? 'Todas as ofertas foram entregues aos grupos via Evolution API' : 'Disparo via Evolution API · Proteção Anti-Ban com intervalos de segurança'}
              </p>
            </div>
          </div>
          {isFinished && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="py-4">
          <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
            <span>Progresso Geral</span>
            <span className="font-mono tabular-nums">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>
          {antiSpamCountdown > 0 && !isFinished && (
            <div className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Intervalo de segurança anti-bloqueio: aguardando {antiSpamCountdown}s...</span>
            </div>
          )}
        </div>

        {/* Group list status */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1 my-2">
          {dispatchedGroups.map((g) => (
            <div
              key={g.id}
              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-xs"
            >
              <span className="font-medium text-slate-800 dark:text-slate-200 truncate pr-2">
                {g.name}
              </span>
              <div className="shrink-0 flex items-center gap-1.5">
                {g.status === 'pending' && (
                  <span className="text-[11px] text-slate-400">Aguardando</span>
                )}
                {g.status === 'sending' && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Enviando
                  </span>
                )}
                {g.status === 'sent' && (
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-300 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Entregue
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Instância WhatsApp Segura</span>
          </div>
          {isFinished ? (
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
            >
              Concluir & Fechar
            </button>
          ) : (
            <span className="text-xs text-slate-400">Processando fila...</span>
          )}
        </div>

      </div>
    </div>
  );
};
