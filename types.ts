
export interface User {
  id: string;
  name: string;
  phone: string;
  password?: string;
  pin?: string;
  balance: number;
  isActive: boolean;
  accountType?: string;
  role?: 'admin' | 'user';
  email?: string;
  nid?: string;
  dob?: string;
  division?: string;
  district?: string;
  upazila?: string;
  gender?: string;
  photoURL?: string;
}

export type AppView = 'home' | 'recharge' | 'add-balance' | 'bill-pay' | 'transfer' | 'history' | 'profile' | 'edit-profile' | 'login' | 'signup' | 'payment-gateway' | 'drive-packages' | 'm-banking' | 'b-banking' | 'add-reseller' | 'notifications' | 'change-pin' | 'change-password' | 'privacy-policy' | 'my-device' | 'account-activation' | 'admin-dashboard';

export interface Transaction {
  id: string;
  userId?: string;
  type: 'Recharge' | 'Bill Pay' | 'Transfer' | 'Add Balance';
  amount: number;
  date: string;
  status: 'Success' | 'Pending' | 'Failed';
  description: string;
}

export enum PaymentMethod {
  NAGAD = 'Nagad',
  ROCKET = 'Rocket',
  CELLFIN = 'Cellfin'
}
