import React from 'react';
import { DealOffer, WhatsAppGroup, ScheduledDispatch, DispatchLog, AffiliateConfig } from '../lib/types';
import { formatBrl } from '../lib/copyGenerator';
import { Send, Users, MousePointerClick, Zap, Clock, ShieldCheck, ArrowUpRight, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

interface DashboardViewProps {
  offers: DealOffer[];
  groups: WhatsAppGroup[];
  schedules: ScheduledDispatch[];
  logs: DispatchLog[];
  config: AffiliateConfig;
  onOpenPreview: (offer: DealOffer) => void;
  onNavigateTab: (tab: string) => void;
  onToggleAutoPilot: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  offers,
  groups,
  schedules,
  logs,
  config,
  onOpenPreview,
  onNavigateTab,
  onToggleAutoPilot,
}) => {
  const activeGroups = groups.filter(g => g.active);
  const totalAudience = activeGroups.reduce((acc, g) => acc + g.participantsCount, 0);
  const totalClicks = logs.reduce((acc, l) => acc + (l.clicksEstimated || 0), 0);
  const pendingSchedules = schedules.filter(s => s.status === 'pending');

  // Distribution by marketplace
  const marketplaceCounts: Record<string, number> = {
    amazon: 0,
    shopee: 0,
    mercadolivre: 0,
    magalu: 0,
    aliexpress: 0,
  };

  logs.forEach(log => {
    if (marketplaceCounts[log.marketplace] !== undefined) {
      marketplaceCounts[log.marketplace] += log.clicksEstimated || 1;
    }
  });

  const maxClicks = Math.max(...Object.values(marketplaceCounts), 1);

  return (
    <div className="space-y-8">
      
      {/* Top Banner / Welcome & Auto-Pilot status with Mascot */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-md border-2 border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-950/40 shrink-0">
              <img
                src="/public/assets/aistudio/Mascote_Click_Ofertas_0bad9dc5.jpg"
                alt="Mascote Click Ofertas"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Click Ofertas
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900">
                  Radar Inteligente
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  WhatsApp Conectado
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Disparador de ofertas e cupons para grupos de WhatsApp via <b>Evolution API</b>.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span>Remetente: <b className="font-mono text-slate-800 dark:text-slate-200">{config.whatsappSenderNumber || config.whatsappPhoneNumber || '+55 (11) 98765-4321'}</b></span>
                <span>·</span>
                <span>Instância: <code className="font-mono text-slate-700 dark:text-slate-300">{config.evolutionInstanceName || 'clickofertas-disparador'}</code></span>
              </div>
            </div>
          </div>

          {/* Auto-Pilot Quick Toggle */}
          <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                config.autoPilotEnabled
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Robô Piloto Automático
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {config.autoPilotEnabled 
                    ? `Disparo a cada ${config.autoPilotIntervalMinutes}m (≥ ${config.autoPilotMinDiscount}% OFF)` 
                    : 'Pausado manualmente'}
                </div>
              </div>
            </div>

            <button
              onClick={onToggleAutoPilot}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                config.autoPilotEnabled
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
              }`}
            >
              {config.autoPilotEnabled ? 'Pausar Bot' : 'Ativar Bot'}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Disparos Realizados</span>
            <Send className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {logs.length}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>100% taxa de entrega</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Grupos Conectados</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {activeGroups.length} <span className="text-xs text-slate-400 font-normal">/ {groups.length}</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono tabular-nums">
            Alcance: ~{totalAudience.toLocaleString('pt-BR')} pessoas
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Cliques nos Links (Est.)</span>
            <MousePointerClick className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {totalClicks.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            Média de {logs.length > 0 ? Math.round(totalClicks / logs.length) : 0} cliques / disparo
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Fila de Agendamento</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {pendingSchedules.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {pendingSchedules.length > 0 ? 'Próximo envio em breve' : 'Fila livre para agendar'}
          </div>
        </div>

      </div>

      {/* 2-Column Split: Trending Deals (left) + Conversion & Quick Actions (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Trending Deals ready for 1-click dispatch (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Ofertas Quentes para Disparar
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Produtos com os maiores descontos detectados hoje pelos rastreadores
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('radar')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Catálogo Completo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {offers.slice(0, 4).map((offer) => (
              <div
                key={offer.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40 transition-colors gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={offer.imageUrl}
                    alt={offer.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover bg-white shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                      <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">{offer.marketplace}</span>
                      <span>·</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{offer.discountPercentage}% OFF</span>
                      {offer.couponCode && (
                        <>
                          <span>·</span>
                          <span className="text-amber-600 dark:text-amber-400 font-mono">Cupom: {offer.couponCode}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {offer.title}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                        R$ {formatBrl(offer.currentPrice)}
                      </span>
                      <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                        R$ {formatBrl(offer.originalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenPreview(offer)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Disparar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance by Marketplace & Anti-Ban Protection (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Marketplace Clicks Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              Engajamento por Loja
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">
              Estimativa de cliques gerados por marketplace
            </p>

            <div className="space-y-3">
              {[
                { key: 'amazon', label: 'Amazon Brasil', color: 'bg-amber-500' },
                { key: 'mercadolivre', label: 'Mercado Livre', color: 'bg-yellow-400' },
                { key: 'shopee', label: 'Shopee', color: 'bg-orange-500' },
                { key: 'magalu', label: 'Magazine Luiza', color: 'bg-blue-500' },
                { key: 'aliexpress', label: 'AliExpress', color: 'bg-red-500' },
              ].map((m) => {
                const count = marketplaceCounts[m.key] || 0;
                const percent = Math.round((count / maxClicks) * 100);
                return (
                  <div key={m.key} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                      <span>{m.label}</span>
                      <span className="font-mono tabular-nums font-semibold">{count} cliques</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${m.color} h-full rounded-full transition-all`}
                        style={{ width: `${Math.max(8, percent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WhatsApp Security Badge */}
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Proteção Anti-Bloqueio Ativa</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Delay inteligente configurado (15s–30s entre disparos), rotação de copies e respeito aos horários de descanso (08:00 às 22:00) para blindar seu número de WhatsApp.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
