import { Member, Contribution, Payment, Meeting, Notification, Association, ContributionCategory, Transaction, FinancialCategory, Message, Conversation, Subscription, SubscriptionPlan, SubscriptionStatus } from './types';
import { differenceInDays, addDays, isAfter, parseISO } from 'date-fns';

const STORAGE_KEYS = {
  MEMBERS: 'akdm_members',
  CONTRIBUTIONS: 'akdm_contributions',
  PAYMENTS: 'akdm_payments',
  MEETINGS: 'akdm_meetings',
  NOTIFICATIONS: 'akdm_notifications',
  USER: 'akdm_current_user',
  ASSOCIATION: 'akdm_association',
  CONTRIBUTION_CATEGORIES: 'akdm_contribution_categories',
  TRANSACTIONS: 'akdm_transactions',
  FINANCIAL_CATEGORIES: 'akdm_financial_categories',
  MESSAGES: 'akdm_messages',
  CONVERSATIONS: 'akdm_conversations'
};

const defaultSubscription: Subscription = {
  plan: 'trial',
  status: 'trial',
  startDate: new Date().toISOString(),
  endDate: addDays(new Date(), 90).toISOString(),
  price: 0,
  memberLimit: 1000,
  autoRenew: false
};

const defaultAssociation: Association = {
  id: 'assoc-1',
  name: 'AKDM ASSOCIATION',
  email: 'contact@akdm.org',
  phone: '+225 05 46 76 53 00',
  address: 'Dakar, Sénégal',
  description: 'La gestion intelligente des associations.',
  logo: '/gebeya.webp',
  bureau: {
    presidentId: '1',
    secretaryId: '2',
    treasurerId: '3',
    auditorId: ''
  },
  subscription: defaultSubscription
};

const defaultMembers: Member[] = [
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+221 77 123 45 67',
    address: 'Dakar, Sénégal',
    profession: 'Ingénieur',
    joinDate: '2023-01-15',
    status: 'active',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Sow',
    email: 'marie.sow@example.com',
    phone: '+221 70 987 65 43',
    address: 'Saint-Louis, Sénégal',
    profession: 'Enseignante',
    joinDate: '2023-03-20',
    status: 'active',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    firstName: 'Abdoulaye',
    lastName: 'Diop',
    email: 'abdoulaye.diop@example.com',
    phone: '+221 76 555 44 33',
    address: 'Thiès, Sénégal',
    profession: 'Commerçant',
    joinDate: '2023-06-10',
    status: 'active',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
  }
];

const defaultContributionCategories: ContributionCategory[] = [
  { id: 'cat-1', name: 'Cotisation mensuelle', defaultAmount: 5000 },
  { id: 'cat-2', name: 'Cotisation annuelle', defaultAmount: 50000 },
  { id: 'cat-3', name: 'Participation exceptionnelle', defaultAmount: 10000 },
  { id: 'cat-4', name: 'Solidarité (Décès)', defaultAmount: 2000 },
  { id: 'cat-5', name: 'Événement spécial', defaultAmount: 5000 },
];

const defaultFinancialCategories: FinancialCategory[] = [
  { id: 'fc-1', name: 'Cotisations', type: 'income' },
  { id: 'fc-2', name: 'Dons', type: 'income' },
  { id: 'fc-3', name: 'Subventions', type: 'income' },
  { id: 'fc-4', name: 'Location de salle', type: 'expense' },
  { id: 'fc-5', name: 'Fournitures', type: 'expense' },
  { id: 'fc-6', name: 'Événements', type: 'expense' },
  { id: 'fc-7', name: 'Maintenance', type: 'expense' },
  { id: 'fc-8', name: 'Transport', type: 'expense' }
];

const defaultContributions: Contribution[] = [
  { id: 'c1', memberId: '1', amount: 5000, type: 'Cotisation mensuelle', date: '2024-03-01', status: 'payé', period: 'Mars 2024' },
  { id: 'c2', memberId: '1', amount: 5000, type: 'Cotisation mensuelle', date: '2024-02-01', status: 'payé', period: 'Février 2024' },
  { id: 'c3', memberId: '2', amount: 5000, type: 'Cotisation mensuelle', date: '2024-03-01', status: 'en_retard', period: 'Mars 2024' },
  { id: 'c4', memberId: '1', amount: 10000, type: 'Participation exceptionnelle', date: '2024-01-20', status: 'payé', period: 'Fonds de Solidarité' }
];

const defaultMeetings: Meeting[] = [
  {
    id: 'm1',
    title: 'Assemblée Générale Ordinaire',
    date: '2024-04-15T10:00:00',
    location: 'Salle Polyvalente, Dakar',
    description: 'Bilan annuel et élection du nouveau bureau.',
    status: 'prévue',
    attendees: ['1', '2']
  }
];

const defaultConversations: Conversation[] = [
  {
    id: 'conv-1',
    participantIds: ['1', '2'],
    lastMessage: 'Bonjour Marie, as-tu reçu le rapport ?',
    lastMessageTimestamp: '2024-03-20T14:30:00',
    unreadCount: 0,
    isGroup: false
  },
  {
    id: 'conv-2',
    participantIds: ['1', '3'],
    lastMessage: 'Ok, je verrai ça demain.',
    lastMessageTimestamp: '2024-03-19T10:15:00',
    unreadCount: 2,
    isGroup: false
  },
  {
    id: 'conv-group-1',
    participantIds: ['1', '2', '3'],
    lastMessage: "N'oubliez pas la réunion de demain !",
    lastMessageTimestamp: '2024-03-20T16:45:00',
    unreadCount: 5,
    isGroup: true,
    name: 'Bureau AKDM'
  }
];

const defaultMessages: Message[] = [
  { id: 'm-1', senderId: '1', conversationId: 'conv-1', text: 'Bonjour Marie, as-tu reçu le rapport ?', timestamp: '2024-03-20T14:30:00', status: 'read' },
  { id: 'm-2', senderId: '3', conversationId: 'conv-2', text: 'Ok, je verrai ça demain.', timestamp: '2024-03-19T10:15:00', status: 'delivered' }
];

export const storage = {
  getMembers: (): Member[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return data ? JSON.parse(data) : defaultMembers;
  },
  saveMembers: (members: Member[]) => localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members)),

  getContributions: (): Contribution[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CONTRIBUTIONS);
    return data ? JSON.parse(data) : defaultContributions;
  },
  saveContributions: (contributions: Contribution[]) => localStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(contributions)),

  getPayments: (): Payment[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return data ? JSON.parse(data) : [];
  },
  savePayments: (payments: Payment[]) => localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments)),

  getMeetings: (): Meeting[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MEETINGS);
    return data ? JSON.parse(data) : defaultMeetings;
  },
  saveMeetings: (meetings: Meeting[]) => localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(meetings)),

  getNotifications: (memberId?: string): Notification[] => {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const all: Notification[] = data ? JSON.parse(data) : [];
    return memberId ? all.filter(n => n.memberId === memberId) : all;
  },
  saveNotifications: (notifications: Notification[]) => localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)),

  getCurrentUser: () => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  setCurrentUser: (user: any) => localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
  logout: () => localStorage.removeItem(STORAGE_KEYS.USER),

  getAssociation: (): Association => {
    const data = localStorage.getItem(STORAGE_KEYS.ASSOCIATION);
    return data ? JSON.parse(data) : defaultAssociation;
  },
  saveAssociation: (association: Association) => localStorage.setItem(STORAGE_KEYS.ASSOCIATION, JSON.stringify(association)),

  getSubscriptionStatus: () => {
    const association = storage.getAssociation();
    if (!association.subscription) return { status: 'expired' as SubscriptionStatus, daysRemaining: 0, plan: 'trial' as SubscriptionPlan, memberLimit: 0 };

    const now = new Date();
    const endDate = parseISO(association.subscription.endDate);
    const daysRemaining = differenceInDays(endDate, now);
    
    let status = association.subscription.status;
    if (isAfter(now, endDate)) {
      status = 'expired';
    }

    return { 
      status, 
      daysRemaining: Math.max(0, daysRemaining), 
      plan: association.subscription.plan,
      memberLimit: association.subscription.memberLimit
    };
  },

  isSubscriptionActive: () => {
    const { status } = storage.getSubscriptionStatus();
    return status !== 'expired';
  },

  getSuperAdminStats: () => {
    return {
      totalAssociations: 124,
      trialAssociations: 45,
      activeAssociations: 68,
      expiredAssociations: 11,
      totalRevenue: 850000,
      totalCommissions: 127500,
      recentAssociations: [
        { id: '1', name: 'Association Sportive Dakar', plan: 'standard', status: 'active', joinDate: '2024-01-10' },
        { id: '2', name: 'Club des Amis de Thiès', plan: 'trial', status: 'trial', joinDate: '2024-03-05' },
        { id: '3', name: 'Groupement Femmes Saint-Louis', plan: 'decouverte', status: 'active', joinDate: '2024-02-15' },
        { id: '4', name: 'Solidarité Touba', plan: 'trial', status: 'expired', joinDate: '2023-11-20' },
      ]
    };
  },

  initializeNewAssociation: (name: string, email: string) => {
    const newAssoc: Association = {
      ...defaultAssociation,
      id: `assoc-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      subscription: {
        ...defaultSubscription,
        startDate: new Date().toISOString(),
        endDate: addDays(new Date(), 90).toISOString(),
      }
    };
    storage.saveAssociation(newAssoc);
    return newAssoc;
  },

  getContributionCategories: (): ContributionCategory[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CONTRIBUTION_CATEGORIES);
    return data ? JSON.parse(data) : defaultContributionCategories;
  },
  saveContributionCategories: (categories: ContributionCategory[]) => localStorage.setItem(STORAGE_KEYS.CONTRIBUTION_CATEGORIES, JSON.stringify(categories)),

  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },
  saveTransactions: (transactions: Transaction[]) => localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions)),

  getFinancialCategories: (): FinancialCategory[] => {
    const data = localStorage.getItem(STORAGE_KEYS.FINANCIAL_CATEGORIES);
    return data ? JSON.parse(data) : defaultFinancialCategories;
  },
  saveFinancialCategories: (categories: FinancialCategory[]) => localStorage.setItem(STORAGE_KEYS.FINANCIAL_CATEGORIES, JSON.stringify(categories)),

  getConversations: (): Conversation[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return data ? JSON.parse(data) : defaultConversations;
  },
  saveConversations: (conversations: Conversation[]) => localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations)),

  getMessages: (conversationId?: string): Message[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const all: Message[] = data ? JSON.parse(data) : defaultMessages;
    return conversationId ? all.filter(m => m.conversationId === conversationId) : all;
  },
  saveMessages: (messages: Message[]) => localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages))
};
