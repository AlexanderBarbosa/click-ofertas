import React, { useState } from 'react';
import { DispatchLog } from '../lib/types';
import { CheckCircle2, AlertCircle, Search, Trash2, RotateCcw, Eye, MessageSquare, MousePointerClick } from 'lucide-react';

interface DispatchLogsViewProps {
  logs: DispatchLog[];
  onClearLogs: () => void;
  onResendLog: (log: DispatchLog) => void;
}

export const DispatchLogsView: React.FC<DispatchLogsViewProps> = ({
  logs,
  onClearLogs,
  onResendLog,
}) => {
  const [search, setSearch] = useState('');
  const [selectedLogMessage, setSelectedLogMessage] = useState<DispatchLog | null>(null);

  const filteredLogs = logs.filter(l => 
    l.offerTitle.toLowerCase().includes(search.toLowerCase()) ||
    l.groupName.toLowerCase().includes(search.toLowerCase())
  );

  const formatLogTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Histórico & Logs de Envios
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Registro de todas as mensagens entregues aos grupos com contagem de engajamento
          </p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={onClearLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors border border-red-200 dark:border-red-900/50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar Histórico</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar histórico por nome da oferta ou grupo de destino..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Nenhum disparo registrado no histórico.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Status & Horário</th>
                  <th className="py-3 px-4">Oferta</th>
                  <th className="py-3 px-4">Grupo Destino</th>
                  <th className="py-3 px-4 text-right">Cliques Est.</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    
                    {/* Status & Timestamp */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                            Entregue
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {formatLogTime(log.timestamp)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Offer */}
                    <td className="py-3 px-4 max-w-xs truncate">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {log.offerTitle}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {log.marketplace}
                      </span>
                    </td>

                    {/* Group */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300 font-medium">
                      {log.groupName}
                    </td>

                    {/* Clicks */}
                    <td className="py-3 px-4 text-right whitespace-nowrap font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                      <div className="flex items-center justify-end gap-1">
                        <MousePointerClick className="w-3.5 h-3.5 text-slate-400" />
                        <span>{log.clicksEstimated}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedLogMessage(log)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Ver texto disparado"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onResendLog(log)}
                          className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 transition-colors"
                          title="Reenviar agora"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reenviar</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Viewer Modal */}
      {selectedLogMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  Mensagem Enviada
                </h3>
              </div>
              <button
                onClick={() => setSelectedLogMessage(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Fechar
              </button>
            </div>

            <div className="text-xs text-slate-500">
              Enviado para <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedLogMessage.groupName}</span> em {formatLogTime(selectedLogMessage.timestamp)}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap max-h-72 overflow-y-auto">
              {selectedLogMessage.messageText}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedLogMessage.messageText);
                  setSelectedLogMessage(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
              >
                Copiar Texto
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
