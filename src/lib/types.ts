export type Marketplace = 'amazon' | 'shopee' | 'mercadolivre' | 'magalu' | 'aliexpress';

export type DealCategory = 
  | 'eletronicos'
  | 'smartphones'
  | 'casa'
  | 'games'
  | 'moda'
  | 'beleza'
  | 'ferramentas';

export interface DealOffer {
  id: string;
  title: string;
  originalPrice: number;
  currentPrice: number;
  discountPercentage: number;
  couponCode?: string;
  marketplace: Marketplace;
  category: DealCategory;
  imageUrl: string;
  rawUrl: string;
  affiliateUrl: string;
  shortUrl: string;
  rating: number;
  reviewCount: number;
  freeShipping: boolean;
  isLowestPrice: boolean;
  featured: boolean;
  createdAt: string;
}

export interface WhatsAppGroup {
  id: string;
  name: string;
  participantsCount: number;
  active: boolean;
  categoryFocus: string;
  antiSpamDelaySeconds: number;
  allowedHoursStart: number; // e.g. 8 (08:00)
  allowedHoursEnd: number;   // e.g. 22 (22:00)
  iconUrl?: string;
}

export interface ScheduledDispatch {
  id: string;
  offerId: string;
  offer: DealOffer;
  targetGroupIds: string[];
  scheduledTime: string; // ISO string
  status: 'pending' | 'sending' | 'sent' | 'failed' | 'cancelled';
  templateId: string;
  customMessage?: string;
  sentAt?: string;
}

export interface DispatchLog {
  id: string;
  offerTitle: string;
  marketplace: Marketplace;
  groupName: string;
  groupId: string;
  timestamp: string;
  status: 'success' | 'failed';
  clicksEstimated: number;
  messageText: string;
  errorReason?: string;
}

export interface AffiliateConfig {
  amazonTag: string;
  shopeeTag: string;
  mercadoLivreTag: string;
  magaluTag: string;
  aliexpressTag: string;
  shortenerPrefix: string;
  autoPilotEnabled: boolean;
  autoPilotIntervalMinutes: number;
  autoPilotMinDiscount: number;
  autoPilotSelectedCategories: DealCategory[];
  whatsappConnected: boolean;
  whatsappPhoneNumber: string;
  whatsappInstanceName: string;
  // Evolution API Configuration
  evolutionApiUrl: string;
  evolutionApiKey: string;
  evolutionInstanceName: string;
  evolutionConnectionState: 'open' | 'connecting' | 'close';
  whatsappSenderNumber: string;
  whatsappPairingMethod: 'qrcode' | 'pairing_code';
  whatsappWebhookUrl: string;
  lastConnectedAt?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  templateFormat: string;
}
