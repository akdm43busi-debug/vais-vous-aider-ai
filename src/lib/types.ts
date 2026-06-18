export type UserRole = 'ADMIN' | 'MEMBER' | 'TREASURER' | 'SUPER_ADMIN';

export type SubscriptionStatus = 'trial' | 'active' | 'expired';
export type SubscriptionPlan = 'trial' | 'decouverte' | 'standard';

export interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  price: number;
  memberLimit: number;
  paymentMethod?: string;
  lastPaymentDate?: string;
  autoRenew: boolean;
}

export interface Bureau {
  presidentId?: string;
  secretaryId?: string;
  treasurerId?: string;
  auditorId?: string;
}

export interface Association {
  id: string;
  name: string;
  logo?: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
  bureau?: Bureau;
  subscription?: Subscription;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  profession: string;
  joinDate: string;
  status: 'active' | 'inactive';
  photo?: string;
}

export interface ContributionCategory {
  id: string;
  name: string;
  description?: string;
  defaultAmount?: number;
}

export interface Contribution {
  id: string;
  memberId: string;
  amount: number;
  type: string;
  date: string;
  status: 'payé' | 'en_attente' | 'en_retard';
  period?: string; // e.g. "Mars 2024"
}

export interface Payment {
  id: string;
  contributionId: string;
  memberId: string;
  amount: number;
  paymentDate: string;
  method: 'espèces' | 'virement' | 'mobile_money';
  transactionId: string;
  validatedBy?: string; // Treasurer ID
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  status: 'prévue' | 'terminée' | 'annulée';
  attendees: string[]; // Member IDs
}

export interface Notification {
  id: string;
  memberId: string;
  title: string;
  message: string;
  date: string;
  type: 'paiement' | 'rappel' | 'reunion' | 'annonce';
  read: boolean;
}

export interface FinancialCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  categoryId: string;
  description: string;
}

export interface Message {
  id: string;
  senderId: string;
  conversationId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: string;
  lastMessageTimestamp?: string;
  unreadCount: number;
  isGroup: boolean;
  name?: string;
  avatar?: string;
}
