import React from 'react';
import { Send, Plus, Sparkles, Moon, Sun } from 'lucide-react';

interface TopNavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenNewOffer: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  autoPilotActive: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewOffer,
  darkMode,
  onToggleDarkMode,
  autoPilotActive,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Painel Geral' },
    { id: 'radar', label: 'Radar de Ofertas' },
    { id: 'groups', label: 'Grupos WhatsApp' },
    { id: 'queue', label: 'Fila & Agendamento' },
    { id: 'settings', label: 'Afiliados & Bot' },
    { id: 'logs', label: 'Histórico' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark + Mascot Logo */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-orange-200 dark:border-orange-800/80 bg-orange-50 shrink-0">
            <img
              src="/public/assets/aistudio/Mascote_Click_Ofertas_0bad9dc5.jpg"
              alt="Mascote Click Ofertas"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap flex items-center gap-1.5">
              Click Ofertas
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Automação WhatsApp & Radar
            </span>
          </div>
        </div>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 text-sm ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Theme toggle + New Offer CTA) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleDarkMode}
            aria-label="Alternar tema"
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenNewOffer}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 active:scale-95 transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Oferta</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-100 dark:border-slate-800 gap-1 bg-slate-50/50 dark:bg-slate-900/50 scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
              currentTab === item.id
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
