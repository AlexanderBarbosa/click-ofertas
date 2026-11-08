import React, { useState } from 'react';
import { DealOffer, Marketplace, DealCategory, AffiliateConfig } from '../lib/types';
import { buildAffiliateUrl } from '../lib/copyGenerator';
import { X, Link2, Sparkles, Plus, Image as ImageIcon, Check } from 'lucide-react';

interface ManualOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveOffer: (offer: DealOffer, andDispatchNow?: boolean) => void;
  affiliateConfig: AffiliateConfig;
}

export const ManualOfferModal: React.FC<ManualOfferModalProps> = ({
  isOpen,
  onClose,
  onSaveOffer,
  affiliateConfig,
}) => {
  const [rawUrl, setRawUrl] = useState('');
  const [title, setTitle] = useState('');
  const [originalPrice, setOriginalPrice] = useState<string>('299.90');
  const [currentPrice, setCurrentPrice] = useState<string>('179.90');
  const [couponCode, setCouponCode] = useState('');
  const [marketplace, setMarketplace] = useState<Marketplace>('amazon');
  const [category, setCategory] = useState<DealCategory>('eletronicos');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop&q=80');
  const [freeShipping, setFreeShipping] = useState<boolean>(true);
  const [isLowestPrice, setIsLowestPrice] = useState<boolean>(true);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  if (!isOpen) return null;

  // Auto-detect marketplace from pasted URL
  const handleUrlChange = (val: string) => {
    setRawUrl(val);
    const lower = val.toLowerCase();
    if (lower.includes('amazon.')) setMarketplace('amazon');
    else if (lower.includes('shopee.')) setMarketplace('shopee');
    else if (lower.includes('mercadolivre.') || lower.includes('mercadolibre.')) setMarketplace('mercadolivre');
    else if (lower.includes('magazineluiza.') || lower.includes('magalu.')) setMarketplace('magalu');
    else if (lower.includes('aliexpress.')) setMarketplace('aliexpress');
  };

  const handleSimulateExtraction = () => {
    if (!rawUrl) {
      // Pre-fill demo URL
      const demoUrl = 'https://www.amazon.com.br/dp/B0CKZDFZ';
      handleUrlChange(demoUrl);
    }
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      setTitle('Smart TV 50" Crystal UHD 4K Samsung 50DU7700 - Gaming Hub');
      setOriginalPrice('2699.00');
      setCurrentPrice('1899.00');
      setCouponCode('TV100');
      setMarketplace('amazon');
      setCategory('eletronicos');
      setImageUrl('https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80');
      setFreeShipping(true);
      setIsLowestPrice(true);
    }, 700);
  };

  const calculateDiscount = () => {
    const orig = parseFloat(originalPrice.replace(',', '.')) || 0;
    const curr = parseFloat(currentPrice.replace(',', '.')) || 0;
    if (orig <= 0 || curr <= 0 || curr >= orig) return 0;
    return Math.round(((orig - curr) / orig) * 100);
  };

  const discount = calculateDiscount();

  const handleSave = (dispatchNow: boolean = false) => {
    const orig = parseFloat(originalPrice.replace(',', '.')) || 100;
    const curr = parseFloat(currentPrice.replace(',', '.')) || 80;
    const calculatedDiscount = orig > curr ? Math.round(((orig - curr) / orig) * 100) : 0;

    const affUrl = buildAffiliateUrl(rawUrl || `https://${marketplace}.com.br/oferta-exemplo`, marketplace, affiliateConfig);

    const newOffer: DealOffer = {
      id: `deal-${Date.now()}`,
      title: title || 'Produto em Super Oferta Relâmpago',
      originalPrice: orig,
      currentPrice: curr,
      discountPercentage: calculatedDiscount,
      couponCode: couponCode.trim() ? couponCode.trim().toUpperCase() : undefined,
      marketplace,
      category,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      rawUrl: rawUrl || affUrl,
      affiliateUrl: affUrl,
      shortUrl: `https://achad.in/${marketplace}-${Math.random().toString(36).substring(2, 6)}`,
      rating: 4.8,
      reviewCount: 3200,
      freeShipping,
      isLowestPrice,
      featured: true,
      createdAt: new Date().toISOString(),
    };

    onSaveOffer(newOffer, dispatchNow);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 transition-colors max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Cadastrar Nova Oferta
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cole a URL de qualquer marketplace para conversão automática em link de afiliado
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Link Extractor Bar */}
        <div className="py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              URL do Produto (Amazon, Shopee, Mercado Livre, Magalu, AliExpress)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={rawUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://www.amazon.com.br/dp/... ou shopee.com.br/..."
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="button"
                onClick={handleSimulateExtraction}
                disabled={isExtracting}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isExtracting ? 'Buscando...' : 'Extrair Dados'}</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Título da Oferta
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Fritadeira Air Fryer Philco Gourmet 4L 1500W Inox"
              className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preço Original (De) R$
              </label>
              <input
                type="text"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="299,90"
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono tabular-nums text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preço Promocional (Por) R$
              </label>
              <input
                type="text"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="179,90"
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Desconto Calculado
              </label>
              <div className="h-[38px] px-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-lg flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                <span>{discount}% OFF</span>
                <span className="text-[10px] font-normal text-slate-400">Automático</span>
              </div>
            </div>
          </div>

          {/* Coupon and Marketplace */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Cupom de Desconto (Opcional)
              </label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Ex: PROMO20"
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Marketplace
              </label>
              <select
                value={marketplace}
                onChange={(e) => setMarketplace(e.target.value as Marketplace)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="amazon">Amazon Brasil</option>
                <option value="shopee">Shopee</option>
                <option value="mercadolivre">Mercado Livre</option>
                <option value="magalu">Magazine Luiza</option>
                <option value="aliexpress">AliExpress</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DealCategory)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="eletronicos">Eletrônicos & Áudio</option>
                <option value="smartphones">Smartphones & Wearables</option>
                <option value="casa">Casa, Cozinha & Eletro</option>
                <option value="games">Games & Consoles</option>
                <option value="moda">Moda & Acessórios</option>
                <option value="beleza">Beleza & Perfumaria</option>
                <option value="ferramentas">Ferramentas & Jardim</option>
              </select>
            </div>
          </div>

          {/* Image URL & Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              URL da Imagem do Produto
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
              />
              <img
                src={imageUrl}
                alt="Preview"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 dark:border-slate-700 shrink-0"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={freeShipping}
                onChange={(e) => setFreeShipping(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Frete Grátis</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isLowestPrice}
                onChange={(e) => setIsLowestPrice(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Menor Preço Histórico (Destaque)</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Salvar no Catálogo
            </button>

            <button
              type="button"
              onClick={() => handleSave(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar & Disparar Agora</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
