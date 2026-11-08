import { DealOffer, WhatsAppGroup, MessageTemplate, AffiliateConfig, DispatchLog } from './types';

export const INITIAL_OFFERS: DealOffer[] = [
  {
    id: 'deal-1',
    title: 'Echo Dot 5ª Geração com Relógio Smart Speaker com Alexa - Cor Branca',
    originalPrice: 499.00,
    currentPrice: 289.00,
    discountPercentage: 42,
    couponCode: 'ALEXA10',
    marketplace: 'amazon',
    category: 'eletronicos',
    imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop&q=80',
    rawUrl: 'https://www.amazon.com.br/dp/B09B8W5FW7',
    affiliateUrl: 'https://www.amazon.com.br/dp/B09B8W5FW7?tag=ofertaszap-20',
    shortUrl: 'https://amzn.to/3xEchoDot5',
    rating: 4.8,
    reviewCount: 14200,
    freeShipping: true,
    isLowestPrice: true,
    featured: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'deal-2',
    title: 'Fritadeira Air Fryer Philips Walita Série 3000 Digital 4.1L 1400W Preta',
    originalPrice: 589.90,
    currentPrice: 329.90,
    discountPercentage: 44,
    couponCode: 'AIRFRYER30',
    marketplace: 'magalu',
    category: 'casa',
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80',
    rawUrl: 'https://www.magazineluiza.com.br/p/air-fryer-walita-3000',
    affiliateUrl: 'https://www.magazinevoce.com.br/magazineofertasvip/p/air-fryer-walita-3000',
    shortUrl: 'https://maga.lu/3AirFryerWalita',
    rating: 4.9,
    reviewCount: 8900,
    freeShipping: true,
    isLowestPrice: true,
    featured: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'deal-3',
    title: 'Fone de Ouvido Bluetooth JBL Wave Buds TWS com Graves Profundos e Bateria 32h',
    originalPrice: 299.00,
    currentPrice: 179.90,
    discountPercentage: 40,
    couponCode: 'JBLSOUND',
    marketplace: 'shopee',
    category: 'eletronicos',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    rawUrl: 'https://shopee.com.br/product/12345/67890',
    affiliateUrl: 'https://s.shopee.com.br/7UfK92xP?aff_source=ofertaszap',
    shortUrl: 'https://shp.ee/8JBLWave',
    rating: 4.7,
    reviewCount: 3410,
    freeShipping: true,
    isLowestPrice: false,
    featured: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'deal-4',
    title: 'Console PlayStation 5 Slim Edição Digital com 1TB SSD + 2 Jogos Digitais',
    originalPrice: 3999.00,
    currentPrice: 3249.00,
    discountPercentage: 19,
    couponCode: 'GAMES150',
    marketplace: 'mercadolivre',
    category: 'games',
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
    rawUrl: 'https://www.mercadolivre.com.br/p/MLB123987',
    affiliateUrl: 'https://mercadolivre.com/sec/2aPS5SlimPromo',
    shortUrl: 'https://meli.la/PS5SlimDeal',
    rating: 4.9,
    reviewCount: 6520,
    freeShipping: true,
    isLowestPrice: true,
    featured: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
  },
  {
    id: 'deal-5',
    title: 'Smartphone Xiaomi Redmi Note 13 4G 8GB RAM 256GB Câmera Tripla 108MP',
    originalPrice: 1599.00,
    currentPrice: 998.00,
    discountPercentage: 38,
    couponCode: '',
    marketplace: 'amazon',
    category: 'smartphones',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    rawUrl: 'https://www.amazon.com.br/dp/B0CQ2WXYZ',
    affiliateUrl: 'https://www.amazon.com.br/dp/B0CQ2WXYZ?tag=ofertaszap-20',
    shortUrl: 'https://amzn.to/RedmiNote13',
    rating: 4.6,
    reviewCount: 4210,
    freeShipping: true,
    isLowestPrice: true,
    featured: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'deal-6',
    title: 'Robô Aspirador de Pó Inteligente WAP Robot W100 Varre, Aspira e Passa Pano Bivolt',
    originalPrice: 479.90,
    currentPrice: 289.00,
    discountPercentage: 40,
    couponCode: 'LIMPEZA20',
    marketplace: 'aliexpress',
    category: 'casa',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    rawUrl: 'https://pt.aliexpress.com/item/100500123.html',
    affiliateUrl: 'https://s.click.aliexpress.com/e/_DkXWapRobot',
    shortUrl: 'https://ali.ski/WapRobot',
    rating: 4.5,
    reviewCount: 1980,
    freeShipping: true,
    isLowestPrice: false,
    featured: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
  {
    id: 'deal-7',
    title: 'Parafusadeira e Furadeira de Impacto Bosch GSB 180-LI 18V com 2 Baterias e Maleta',
    originalPrice: 899.00,
    currentPrice: 539.00,
    discountPercentage: 40,
    couponCode: 'BOSCH50',
    marketplace: 'mercadolivre',
    category: 'ferramentas',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    rawUrl: 'https://www.mercadolivre.com.br/p/MLB554433',
    affiliateUrl: 'https://mercadolivre.com/sec/BoschGSB180',
    shortUrl: 'https://meli.la/Bosch18V',
    rating: 4.9,
    reviewCount: 3120,
    freeShipping: true,
    isLowestPrice: true,
    featured: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
  {
    id: 'deal-8',
    title: 'Kindle 11ª Geração Tela de 6" Alta Resolução 300 ppi com Luz Embutida 16GB',
    originalPrice: 499.00,
    currentPrice: 389.00,
    discountPercentage: 22,
    couponCode: 'KINDLE10',
    marketplace: 'amazon',
    category: 'eletronicos',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    rawUrl: 'https://www.amazon.com.br/dp/B09SWW583J',
    affiliateUrl: 'https://www.amazon.com.br/dp/B09SWW583J?tag=ofertaszap-20',
    shortUrl: 'https://amzn.to/Kindle11Gen',
    rating: 4.9,
    reviewCount: 18450,
    freeShipping: true,
    isLowestPrice: true,
    featured: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  }
];

export const INITIAL_GROUPS: WhatsAppGroup[] = [
  {
    id: 'grp-1',
    name: '🔥 Click Ofertas & Cupons VIP #1',
    participantsCount: 980,
    active: true,
    categoryFocus: 'Todos os nichos',
    antiSpamDelaySeconds: 15,
    allowedHoursStart: 8,
    allowedHoursEnd: 22,
  },
  {
    id: 'grp-2',
    name: '⚡ Ofertas Tech & Games Brasil #2',
    participantsCount: 1024,
    active: true,
    categoryFocus: 'Eletrônicos & Games',
    antiSpamDelaySeconds: 20,
    allowedHoursStart: 9,
    allowedHoursEnd: 23,
  },
  {
    id: 'grp-3',
    name: '🛒 Promoções Casa, Cozinha & Air Fryer #3',
    participantsCount: 740,
    active: true,
    categoryFocus: 'Casa & Decoração',
    antiSpamDelaySeconds: 15,
    allowedHoursStart: 8,
    allowedHoursEnd: 21,
  },
  {
    id: 'grp-4',
    name: '🚨 Erros de Preço & Bugs Relâmpago #4',
    participantsCount: 1010,
    active: true,
    categoryFocus: 'Descontos > 50%',
    antiSpamDelaySeconds: 10,
    allowedHoursStart: 7,
    allowedHoursEnd: 23,
  },
  {
    id: 'grp-5',
    name: '📱 Smartphones & Acessórios Baratos #5',
    participantsCount: 520,
    active: false,
    categoryFocus: 'Smartphones',
    antiSpamDelaySeconds: 25,
    allowedHoursStart: 9,
    allowedHoursEnd: 22,
  }
];

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'tpl-achadinho',
    name: 'Achadinho Clássico (Alta Conversão)',
    description: 'Estilo tradicional de grupos de ofertas, claro e convidativo com chamada direta.',
    templateFormat: `🚨 *ACHADINHO DO DIA! BAIXOU MUITO!* 🚨

📦 *{{TITLE}}*

❌ De: ~R$ {{ORIGINAL_PRICE}}~
🔥 *Por apenas: R$ {{CURRENT_PRICE}}* ({{DISCOUNT}}% OFF!)
{{COUPON_LINE}}
🚚 {{SHIPPING}}
⭐ Avaliação {{RATING}}/5.0 ({{REVIEWS}} opiniões)

🛒 *COMPRE AQUI COM DESCONTO:*
👉 {{LINK}}

⚠️ _Corre que esse valor pode subir a qualquer instante!_`,
  },
  {
    id: 'tpl-urgencia',
    name: 'Urgência Máxima / Menor Preço',
    description: 'Focado em gatilhos de escassez e histórico de menor preço já registrado.',
    templateFormat: `⚡ *MENOR PREÇO HISTÓRICO DETECTADO!* ⚡

🔥 *{{TITLE}}*

📉 Caiu de ~R$ {{ORIGINAL_PRICE}}~ para *R$ {{CURRENT_PRICE}}* no Pix/Boleto!
🎟️ {{DISCOUNT}}% de desconto imediato!
{{COUPON_LINE}}
📦 {{SHIPPING}}

🏃‍♂️ *LINK DIRETO DA PROMOÇÃO:*
🔗 {{LINK}}

🔔 *Ative as notificações do grupo para não perder bugs como esse!*`,
  },
  {
    id: 'tpl-cupom',
    name: 'Cupom Secreto & Economia',
    description: 'Destaque gigante no código do cupom para quem busca pechincha.',
    templateFormat: `🎟️ *CUPOM DE DESCONTO EXCLUSIVO LIBERADO!*

Item: *{{TITLE}}*

💰 De ~R$ {{ORIGINAL_PRICE}}~ por apenas *R$ {{CURRENT_PRICE}}*
🏷️ Use o cupom na finalização:
👉 *{{COUPON_CODE}}*

🛒 *PEGUE O SEU ANTES DE ESGOTAR O CUPOM:*
👇 {{LINK}}

{{SHIPPING}}`,
  },
  {
    id: 'tpl-direto',
    name: 'Direto ao Ponto (Minimalista)',
    description: 'Rápido de ler, sem enrolação, excelente para membros que gostam de objetividade.',
    templateFormat: `💥 *{{TITLE}}*

*R$ {{CURRENT_PRICE}}* ({{DISCOUNT}}% OFF)
{{COUPON_LINE}}
{{SHIPPING}}

👉 {{LINK}}`,
  }
];

export const DEFAULT_AFFILIATE_CONFIG: AffiliateConfig = {
  amazonTag: 'ofertaszap-20',
  shopeeTag: 'https://s.shopee.com.br/meu-subid',
  mercadoLivreTag: 'MLAFI-AUTO998',
  magaluTag: 'magazineofertasvip',
  aliexpressTag: 'https://s.click.aliexpress.com/e/_meuid',
  shortenerPrefix: 'https://achad.in/',
  autoPilotEnabled: true,
  autoPilotIntervalMinutes: 25,
  autoPilotMinDiscount: 35,
  autoPilotSelectedCategories: ['eletronicos', 'casa', 'smartphones', 'games'],
  whatsappConnected: true,
  whatsappPhoneNumber: '+55 (11) 98765-4321',
  whatsappInstanceName: 'Click-Ofertas',
  evolutionApiUrl: 'http://localhost:8080',
  evolutionApiKey: 'sua-chave-segura-aqui',
  evolutionInstanceName: 'Click-Ofertas',
  evolutionConnectionState: 'open',
  whatsappSenderNumber: '+55 (11) 98765-4321',
  whatsappPairingMethod: 'qrcode',
  whatsappWebhookUrl: 'https://ais-dev-vyvhtr7zm3xyhqdvy4lzgh-910477903968.us-east1.run.app/api/webhook/whatsapp',
  lastConnectedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
};

export const INITIAL_LOGS: DispatchLog[] = [
  {
    id: 'log-1',
    offerTitle: 'Echo Dot 5ª Geração com Relógio Smart Speaker',
    marketplace: 'amazon',
    groupName: '🔥 Achadinhos & Cupons VIP #1',
    groupId: 'grp-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    status: 'success',
    clicksEstimated: 47,
    messageText: '🚨 ACHADINHO DO DIA! BAIXOU MUITO! 🚨...',
  },
  {
    id: 'log-2',
    offerTitle: 'Echo Dot 5ª Geração com Relógio Smart Speaker',
    marketplace: 'amazon',
    groupName: '⚡ Ofertas Tech & Games Brasil #2',
    groupId: 'grp-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 17).toISOString(),
    status: 'success',
    clicksEstimated: 62,
    messageText: '🚨 ACHADINHO DO DIA! BAIXOU MUITO! 🚨...',
  },
  {
    id: 'log-3',
    offerTitle: 'Fritadeira Air Fryer Philips Walita Série 3000',
    marketplace: 'magalu',
    groupName: '🛒 Promoções Casa, Cozinha & Air Fryer #3',
    groupId: 'grp-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    status: 'success',
    clicksEstimated: 84,
    messageText: '🚨 ACHADINHO DO DIA! BAIXOU MUITO! 🚨...',
  },
  {
    id: 'log-4',
    offerTitle: 'Console PlayStation 5 Slim Edição Digital',
    marketplace: 'mercadolivre',
    groupName: '⚡ Ofertas Tech & Games Brasil #2',
    groupId: 'grp-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 135).toISOString(),
    status: 'success',
    clicksEstimated: 115,
    messageText: '⚡ MENOR PREÇO HISTÓRICO DETECTADO! ⚡...',
  },
  {
    id: 'log-5',
    offerTitle: 'Smartphone Xiaomi Redmi Note 13 4G',
    marketplace: 'amazon',
    groupName: '🚨 Erros de Preço & Bugs Relâmpago #4',
    groupId: 'grp-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
    status: 'success',
    clicksEstimated: 93,
    messageText: '⚡ MENOR PREÇO HISTÓRICO DETECTADO! ⚡...',
  }
];
