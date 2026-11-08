import React, { useState, useMemo } from 'react';
import { DealOffer, Marketplace, DealCategory } from '../lib/types';
import { formatBrl } from '../lib/copyGenerator';
import { Search, Filter, Send, Plus, ExternalLink, Copy, Check, Trash2, Tag, ShieldCheck, Star } from 'lucide-react';

interface DealsRadarViewProps {
  offers: DealOffer[];
  onOpenPreview: (offer: DealOffer) => void;
  onOpenNewOffer: () => void;
  onDeleteOffer: (id: string) => void;
}

export const DealsRadarView: React.FC<DealsRadarViewProps> = ({
  offers,
  onOpenPreview,
  onOpenNewOffer,
  onDeleteOffer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [onlyCoupons, setOnlyCoupons] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = offer.title.toLowerCase().includes(query);
        const matchesCoupon = offer.couponCode?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCoupon) return false;
      }

      // Marketplace
      if (selectedMarketplace !== 'all' && offer.marketplace !== selectedMarketplace) {
        return false;
      }

      // Category
      if (selectedCategory !== 'all' && offer.category !== selectedCategory) {
        return false;
      }

      // Min discount
      if (minDiscount > 0 && offer.discountPercentage < minDiscount) {
        return false;
      }

      // Coupon
      if (onlyCoupons && !offer.couponCode) {
        return false;
      }

      return true;
    });
  }, [offers, searchQuery, selectedMarketplace, selectedCategory, minDiscount, onlyCoupons]);

  const handleCopyLink = (offer: DealOffer) => {
    const link = offer.shortUrl || offer.affiliateUrl || offer.rawUrl;
    navigator.clipboard.writeText(link);
    setCopiedId(offer.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* View Header with Search & New Offer Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Radar de Ofertas Monitoradas
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {offers.length} produtos em monitoramento ativo de preço com conversão de tags de afiliados
          </p>
        </div>

        <button
          onClick={onOpenNewOffer}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 active:scale-95 transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Link de Oferta</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        
        {/* Search input & Quick Discount selector */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por produto, modelo, cupom de desconto..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Discount Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
            {[
              { val: 0, label: 'Todos os Descontos' },
              { val: 30, label: '≥ 30% OFF' },
              { val: 40, label: '≥ 40% OFF' },
              { val: 50, label: '≥ 50% OFF' },
            ].map((disc) => (
              <button
                key={disc.val}
                onClick={() => setMinDiscount(disc.val)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  minDiscount === disc.val
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {disc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Marketplace & Category Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          {/* Marketplace Tabs */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs text-slate-400 mr-1">Loja:</span>
            {[
              { id: 'all', label: 'Todas' },
              { id: 'amazon', label: 'Amazon' },
              { id: 'mercadolivre', label: 'Mercado Livre' },
              { id: 'shopee', label: 'Shopee' },
              { id: 'magalu', label: 'Magalu' },
              { id: 'aliexpress', label: 'AliExpress' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMarketplace(m.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedMarketplace === m.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Toggle with coupon */}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={onlyCoupons}
              onChange={(e) => setOnlyCoupons(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Apenas com Cupom Ativo</span>
          </label>
        </div>

      </div>

      {/* Offers Grid */}
      {filteredOffers.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Tag className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Nenhuma oferta encontrada com esses filtros
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Tente redefinir a busca ou adicione uma nova oferta colando o link do produto.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedMarketplace('all');
              setMinDiscount(0);
              setOnlyCoupons(false);
            }}
            className="px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 overflow-hidden flex flex-col shadow-sm transition-all group"
            >
              
              {/* Product Image + Badges */}
              <div className="relative h-44 bg-slate-50 dark:bg-slate-950 overflow-hidden">
                <img
                  src={offer.imageUrl}
                  alt={offer.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Marketplace tag */}
                <div className="absolute top-2.5 left-2.5 bg-slate-900/90 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow uppercase tracking-wider backdrop-blur-sm">
                  {offer.marketplace}
                </div>

                {/* Discount Badge */}
                <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded shadow font-mono">
                  {offer.discountPercentage}% OFF
                </div>

                {offer.isLowestPrice && (
                  <div className="absolute bottom-2.5 left-2.5 bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow flex items-center gap-1">
                    <span>🔥 Menor Preço</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  {/* Rating & reviews */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{offer.rating}</span>
                    <span>({offer.reviewCount.toLocaleString('pt-BR')})</span>
                    {offer.freeShipping && (
                      <>
                        <span>·</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Frete Grátis</span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2 leading-relaxed mb-3">
                    {offer.title}
                  </h3>

                  {/* Coupon highlight if present */}
                  {offer.couponCode && (
                    <div className="mb-3 px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between text-[11px]">
                      <span className="text-amber-800 dark:text-amber-300 font-medium">Cupom:</span>
                      <span className="font-mono font-bold text-amber-900 dark:text-amber-200">{offer.couponCode}</span>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                      R$ {formatBrl(offer.currentPrice)}
                    </span>
                    <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                      R$ {formatBrl(offer.originalPrice)}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => onOpenPreview(offer)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Disparar para WhatsApp</span>
                  </button>

                  <div className="flex items-center justify-between gap-1 text-slate-400">
                    <button
                      onClick={() => handleCopyLink(offer)}
                      className="flex-1 flex items-center justify-center gap-1 py-1 text-[11px] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                    >
                      {copiedId === offer.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === offer.id ? 'Copiado' : 'Link Afiliado'}</span>
                    </button>

                    <a
                      href={offer.rawUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:text-slate-600 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Ver anúncio original"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => onDeleteOffer(offer.id)}
                      className="p-1 hover:text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Remover oferta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
