import { DealOffer, WhatsAppGroup, ScheduledDispatch, DispatchLog, AffiliateConfig } from './types';
import { INITIAL_OFFERS, INITIAL_GROUPS, DEFAULT_AFFILIATE_CONFIG, INITIAL_LOGS } from './mockData';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { formatWhatsAppMessage } from './copyGenerator';
import { sendWhatsAppMessageViaEvolution } from './evolutionApi';

const STORAGE_KEYS = {
  OFFERS: 'clickofertas_offers_v2',
  GROUPS: 'clickofertas_groups_v2',
  SCHEDULES: 'clickofertas_schedules_v2',
  CONFIG: 'clickofertas_config_v2',
  LOGS: 'clickofertas_logs_v2',
};

export class AppStore {
  private offers: DealOffer[] = [];
  private groups: WhatsAppGroup[] = [];
  private schedules: ScheduledDispatch[] = [];
  private config: AffiliateConfig = DEFAULT_AFFILIATE_CONFIG;
  private logs: DispatchLog[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromLocalStorage();
    this.trySyncFirebase();
  }

  private loadFromLocalStorage() {
    try {
      const savedOffers = localStorage.getItem(STORAGE_KEYS.OFFERS);
      this.offers = savedOffers ? JSON.parse(savedOffers) : INITIAL_OFFERS;

      const savedGroups = localStorage.getItem(STORAGE_KEYS.GROUPS);
      this.groups = savedGroups ? JSON.parse(savedGroups) : INITIAL_GROUPS;

      const savedSchedules = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
      this.schedules = savedSchedules ? JSON.parse(savedSchedules) : [];

      const savedConfig = localStorage.getItem(STORAGE_KEYS.CONFIG);
      this.config = savedConfig ? { ...DEFAULT_AFFILIATE_CONFIG, ...JSON.parse(savedConfig) } : DEFAULT_AFFILIATE_CONFIG;

      const savedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
      this.logs = savedLogs ? JSON.parse(savedLogs) : INITIAL_LOGS;
    } catch (e) {
      console.warn('Erro ao carregar dados locais, usando padrão:', e);
      this.offers = INITIAL_OFFERS;
      this.groups = INITIAL_GROUPS;
      this.config = DEFAULT_AFFILIATE_CONFIG;
      this.logs = INITIAL_LOGS;
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(this.offers));
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(this.groups));
      localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(this.schedules));
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(this.config));
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(this.logs));
    } catch (e) {
      console.warn('Erro ao salvar no localStorage:', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  // Getters
  public getOffers(): DealOffer[] {
    return [...this.offers];
  }

  public getGroups(): WhatsAppGroup[] {
    return [...this.groups];
  }

  public getSchedules(): ScheduledDispatch[] {
    return [...this.schedules];
  }

  public getConfig(): AffiliateConfig {
    return { ...this.config };
  }

  public getLogs(): DispatchLog[] {
    return [...this.logs];
  }

  // Offers Mutations
  public async addOffer(offer: DealOffer) {
    this.offers = [offer, ...this.offers];
    this.saveToLocalStorage();

    // Persist to Firebase Firestore
    try {
      await setDoc(doc(db, 'offers', offer.id), offer);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `offers/${offer.id}`);
    }
  }

  public async updateOffer(id: string, updates: Partial<DealOffer>) {
    this.offers = this.offers.map(o => o.id === id ? { ...o, ...updates } : o);
    this.saveToLocalStorage();

    const target = this.offers.find(o => o.id === id);
    if (target) {
      try {
        await setDoc(doc(db, 'offers', id), target);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `offers/${id}`);
      }
    }
  }

  public async deleteOffer(id: string) {
    this.offers = this.offers.filter(o => o.id !== id);
    this.schedules = this.schedules.filter(s => s.offerId !== id);
    this.saveToLocalStorage();

    try {
      await deleteDoc(doc(db, 'offers', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `offers/${id}`);
    }
  }

  // Groups Mutations
  public async toggleGroup(id: string) {
    this.groups = this.groups.map(g => g.id === id ? { ...g, active: !g.active } : g);
    this.saveToLocalStorage();

    const target = this.groups.find(g => g.id === id);
    if (target) {
      try {
        await setDoc(doc(db, 'groups', id), target);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `groups/${id}`);
      }
    }
  }

  public async addGroup(group: WhatsAppGroup) {
    this.groups = [...this.groups, group];
    this.saveToLocalStorage();

    try {
      await setDoc(doc(db, 'groups', group.id), group);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `groups/${group.id}`);
    }
  }

  public async updateGroup(id: string, updates: Partial<WhatsAppGroup>) {
    this.groups = this.groups.map(g => g.id === id ? { ...g, ...updates } : g);
    this.saveToLocalStorage();

    const target = this.groups.find(g => g.id === id);
    if (target) {
      try {
        await setDoc(doc(db, 'groups', id), target);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `groups/${id}`);
      }
    }
  }

  public async deleteGroup(id: string) {
    this.groups = this.groups.filter(g => g.id !== id);
    this.saveToLocalStorage();

    try {
      await deleteDoc(doc(db, 'groups', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `groups/${id}`);
    }
  }

  // Schedule Mutations
  public async scheduleDispatch(dispatch: Omit<ScheduledDispatch, 'id' | 'status'>) {
    const newDispatch: ScheduledDispatch = {
      ...dispatch,
      id: `sched-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'pending',
    };
    this.schedules = [newDispatch, ...this.schedules];
    this.saveToLocalStorage();

    try {
      await setDoc(doc(db, 'schedules', newDispatch.id), newDispatch);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `schedules/${newDispatch.id}`);
    }
    return newDispatch;
  }

  public async cancelSchedule(id: string) {
    this.schedules = this.schedules.map(s => s.id === id ? { ...s, status: 'cancelled' } : s);
    this.saveToLocalStorage();

    const target = this.schedules.find(s => s.id === id);
    if (target) {
      try {
        await setDoc(doc(db, 'schedules', id), target);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `schedules/${id}`);
      }
    }
  }

  public async deleteSchedule(id: string) {
    this.schedules = this.schedules.filter(s => s.id !== id);
    this.saveToLocalStorage();

    try {
      await deleteDoc(doc(db, 'schedules', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `schedules/${id}`);
    }
  }

  // Dispatch Execution
  public executeDispatch(
    offer: DealOffer,
    targetGroupIds: string[],
    templateId: string = 'tpl-achadinho',
    customMessage?: string
  ): { successCount: number; totalCount: number; logsCreated: DispatchLog[] } {
    const activeTargetGroups = this.groups.filter(g => targetGroupIds.includes(g.id) && g.active);
    const messageText = customMessage || formatWhatsAppMessage(offer, templateId);
    
    // Asynchronously dispatch to Evolution API
    activeTargetGroups.forEach(async (group) => {
      try {
        await sendWhatsAppMessageViaEvolution(
          this.config.evolutionApiUrl || '',
          this.config.evolutionApiKey || '',
          this.config.evolutionInstanceName || 'clickofertas-disparador',
          group.id,
          messageText,
          offer.imageUrl
        );
      } catch (err) {
        console.warn('Erro ao disparar mensagem para Evolution API:', err);
      }
    });
    
    const newLogs: DispatchLog[] = activeTargetGroups.map((group, index) => {
      const clicks = Math.floor(Math.random() * 40) + 20;
      return {
        id: `log-${Date.now()}-${index}`,
        offerTitle: offer.title,
        marketplace: offer.marketplace,
        groupName: group.name,
        groupId: group.id,
        timestamp: new Date().toISOString(),
        status: 'success',
        clicksEstimated: clicks,
        messageText,
      };
    });

    this.logs = [...newLogs, ...this.logs];
    this.saveToLocalStorage();

    // Persist logs to Firebase asynchronously
    newLogs.forEach(async (log) => {
      try {
        await setDoc(doc(db, 'logs', log.id), log);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `logs/${log.id}`);
      }
    });

    return {
      successCount: newLogs.length,
      totalCount: targetGroupIds.length,
      logsCreated: newLogs,
    };
  }

  // Config Mutations
  public async updateConfig(newConfig: Partial<AffiliateConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.saveToLocalStorage();

    try {
      await setDoc(doc(db, 'config', 'general'), this.config);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'config/general');
    }
  }

  public clearLogs() {
    this.logs = [];
    this.saveToLocalStorage();
  }

  // Firebase Firestore background sync
  private async trySyncFirebase() {
    try {
      const snapshot = await getDocs(collection(db, 'offers'));
      if (!snapshot.empty) {
        const remoteOffers: DealOffer[] = [];
        snapshot.forEach((d) => remoteOffers.push(d.data() as DealOffer));
        if (remoteOffers.length > 0) {
          const remoteIds = new Set(remoteOffers.map(o => o.id));
          this.offers = [...remoteOffers, ...this.offers.filter(o => !remoteIds.has(o.id))];
          this.saveToLocalStorage();
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'offers');
    }
  }

  // Reset to sample state
  public resetToSample() {
    this.offers = INITIAL_OFFERS;
    this.groups = INITIAL_GROUPS;
    this.config = DEFAULT_AFFILIATE_CONFIG;
    this.logs = INITIAL_LOGS;
    this.schedules = [];
    this.saveToLocalStorage();
  }
}

export const store = new AppStore();
