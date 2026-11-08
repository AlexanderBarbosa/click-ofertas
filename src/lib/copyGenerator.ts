import { DealOffer, AffiliateConfig, MessageTemplate } from './types';
import { MESSAGE_TEMPLATES } from './mockData';

export function formatBrl(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Injects user's affiliate tag into a raw or existing marketplace link
 */
export function buildAffiliateUrl(rawUrl: string, marketplace: string, config: AffiliateConfig): string {
  if (!rawUrl) return '';

  try {
    const url = new URL(rawUrl);

    switch (marketplace) {
      case 'amazon': {
        const tag = config.amazonTag || 'ofertaszap-20';
        url.searchParams.set('tag', tag);
        url.searchParams.set('linkCode', 'll1');
        return url.toString();
      }
      case 'shopee': {
        const tag = config.shopeeTag || 'ofertaszap';
        if (tag.startsWith('http')) {
          return `${tag}?url=${encodeURIComponent(rawUrl)}`;
        }
        url.searchParams.set('aff_source', tag);
        return url.toString();
      }
      case 'mercadolivre': {
        const tag = config.mercadoLivreTag || 'MLAFI-AUTO998';
        url.searchParams.set('matt_tool', tag);
        return url.toString();
      }
      case 'magalu': {
        const store = config.magaluTag || 'magazineofertasvip';
        if (rawUrl.includes('magazineluiza.com.br')) {
          return rawUrl.replace('magazineluiza.com.br', `magazinevoce.com.br/${store}`);
        }
        return rawUrl;
      }
      case 'aliexpress': {
        const tag = config.aliexpressTag;
        if (tag && tag.startsWith('http')) {
          return `${tag}?targetUrl=${encodeURIComponent(rawUrl)}`;
        }
        return rawUrl;
      }
      default:
        return rawUrl;
    }
  } catch {
    // If rawUrl is not a full valid URL format, return as is
    return rawUrl;
  }
}

/**
 * Generates formatted text for WhatsApp with emojis, markdown and links
 */
export function formatWhatsAppMessage(
  offer: DealOffer,
  templateId: string = 'tpl-achadinho',
  customTemplateText?: string
): string {
  const template = customTemplateText 
    ? { templateFormat: customTemplateText }
    : (MESSAGE_TEMPLATES.find(t => t.id === templateId) || MESSAGE_TEMPLATES[0]);

  let format = template.templateFormat;

  const couponLine = offer.couponCode
    ? `🎟️ *Cupom:* \`${offer.couponCode}\``
    : '';

  const shippingText = offer.freeShipping
    ? '🚚 *Frete Grátis* para membros Prime ou compras qualificadas'
    : '📦 Consulte frete para sua região';

  const link = offer.shortUrl || offer.affiliateUrl || offer.rawUrl;

  format = format
    .replace(/\{\{TITLE\}\}/g, offer.title)
    .replace(/\{\{ORIGINAL_PRICE\}\}/g, formatBrl(offer.originalPrice))
    .replace(/\{\{CURRENT_PRICE\}\}/g, formatBrl(offer.currentPrice))
    .replace(/\{\{DISCOUNT\}\}/g, offer.discountPercentage.toString())
    .replace(/\{\{COUPON_LINE\}\}/g, couponLine)
    .replace(/\{\{COUPON_CODE\}\}/g, offer.couponCode || '')
    .replace(/\{\{SHIPPING\}\}/g, shippingText)
    .replace(/\{\{LINK\}\}/g, link)
    .replace(/\{\{RATING\}\}/g, (offer.rating || 4.8).toFixed(1))
    .replace(/\{\{REVIEWS\}\}/g, (offer.reviewCount || 1000).toLocaleString('pt-BR'));

  // Clean empty lines caused by missing coupons
  format = format.replace(/\n\s*\n\s*\n/g, '\n\n').trim();

  return format;
}

/**
 * AI-powered Copy Generator to create custom WhatsApp variations
 */
export function generateVariedCopy(offer: DealOffer, tone: 'urgente' | 'achadinho' | 'tecnico' | 'descontraido'): string {
  const price = formatBrl(offer.currentPrice);
  const oldPrice = formatBrl(offer.originalPrice);
  const link = offer.shortUrl || offer.affiliateUrl || offer.rawUrl;

  if (tone === 'urgente') {
    return `🚨 *BUG DE PREÇO OU PROMOÇÃO RELÂMPAGO?!* 🚨

🔥 *${offer.title}*
📉 Despencou de ~R$ ${oldPrice}~ para *R$ ${price}*!
⚡ São *${offer.discountPercentage}% DE DESCONTO* imediato!
${offer.couponCode ? `🎟️ Cupom obrigatório: *${offer.couponCode}*\n` : ''}📦 ${offer.freeShipping ? 'Frete Grátis disponível!' : 'Confira o frete para seu CEP'}

🏃💨 *LINK RÁPIDO PARA APROVEITAR:*
👉 ${link}

_⚠️ Dica: Preços baixos assim acabam em menos de 15 minutos!_`;
  }

  if (tone === 'tecnico') {
    return `📊 *ANÁLISE DE OFERTA: CUSTO-BENEFÍCIO*

🖥️ *${offer.title}*
⭐ Classificação: ${offer.rating} de 5.0 (${offer.reviewCount.toLocaleString('pt-BR')} avaliações reais)
💰 Preço Normal: ~R$ ${oldPrice}~
✅ Preço Promocional: *R$ ${price}* (-${offer.discountPercentage}%)
${offer.couponCode ? `🏷️ Cupom testado: ${offer.couponCode}\n` : ''}🚚 ${offer.freeShipping ? 'Entrega Rápida com Frete Grátis' : 'Envio Seguro'}

🔗 *Acessar página oficial do produto:*
${link}`;
  }

  if (tone === 'descontraido') {
    return `✨ *GENTE, OLHA ESSE ACHADO QUE ENCONTREI HOJE!* 😍

${offer.title}

Custava ~R$ ${oldPrice}~ e agora tá saindo por apenas *R$ ${price}*! Não dá pra acreditar no desconto de *${offer.discountPercentage}%* 😱

${offer.couponCode ? `🎟️ Aplica o cupom: *${offer.couponCode}*\n` : ''}👇 *O link tá aqui, corre antes que esgote:*
${link}

${offer.freeShipping ? '🚚 E o melhor: com Frete Grátis!' : ''}`;
  }

  // Default achadinho
  return formatWhatsAppMessage(offer, 'tpl-achadinho');
}
