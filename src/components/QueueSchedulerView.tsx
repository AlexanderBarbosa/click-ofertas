import React from 'react';
import { ScheduledDispatch, WhatsAppGroup, DealOffer } from '../lib/types';
import { formatBrl } from '../lib/copyGenerator';
import { Clock, Send, XCircle, Trash2, Calendar, Sparkles, AlertCircle } from 'lucide-react';

interface QueueSchedulerViewProps {
  schedules: ScheduledDispatch[];
  groups: WhatsAppGroup[];
  offers: DealOffer[];
  onExecuteNow: (schedule: ScheduledDispatch) => void;
  onCancelSchedule: (id: string) => void;
  onDeleteSchedule: (id: string) => void;
  onGenerateQuickQueue: () => void;
}

export const QueueSchedulerView: React.FC<QueueSchedulerViewProps> = ({
  schedules,
  groups,
  offers,
  onExecuteNow,
  onCancelSchedule,
  onDeleteSchedule,
  onGenerateQuickQueue,
}) => {
  const pendingList = schedules.filter(s => s.status === 'pending');
  const finishedList = schedules.filter(s => s.status === 'sent' || s.status === 'cancelled');

  const getGroupName = (id: string) => {
    return groups.find(g => g.id === id)?.name || id;
  };

  const formatScheduledTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Quick Queue generator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Fila de Envios & Agendamentos
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cronograma automático de disparos programados para os grupos de WhatsApp
          </p>
        </div>

        <button
          onClick={onGenerateQuickQueue}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Preencher Fila Automática de Hoje (3 Horários de Pico)</span>
        </button>
      </div>

      {/* Pending Queue */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Próximos Envios Programados ({pendingList.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Horário de Brasília (BRT)
          </span>
        </div>

        {pendingList.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <Calendar className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Nenhuma oferta na fila de agendamento no momento
            </p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Selecione qualquer produto no Radar de Ofertas e clique em "Agendar para Depois", ou clique no botão acima para preencher horários de pico.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingList.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={item.offer.imageUrl}
                    alt={item.offer.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover bg-white shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatScheduledTime(item.scheduledTime)}
                      </span>
                      <span>·</span>
                      <span className="uppercase font-semibold">{item.offer.marketplace}</span>
                      <span>·</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.offer.discountPercentage}% OFF</span>
                    </div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {item.offer.title}
                    </h3>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      Destino: {item.targetGroupIds.map(getGroupName).join(', ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onExecuteNow(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Disparar Agora</span>
                  </button>
                  <button
                    onClick={() => onCancelSchedule(item.id)}
                    className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Cancelar agendamento"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteSchedule(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History of Past Schedules */}
      {finishedList.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Agendamentos Concluídos / Cancelados
          </h2>
          <div className="space-y-2">
            {finishedList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 text-xs text-slate-500"
              >
                <div className="truncate pr-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.offer.title}</span>
                  <span className="ml-2 text-[11px]">({formatScheduledTime(item.scheduledTime)})</span>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    item.status === 'sent'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {item.status === 'sent' ? 'Enviado' : 'Cancelado'}
                  </span>
                  <button
                    onClick={() => onDeleteSchedule(item.id)}
                    className="p-1 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
