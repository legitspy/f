
export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export interface UserProfile extends User {
  balance: number; // in BTC
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  description: string;
  amount: number; // in BTC, negative for sent
  category: 'Received' | 'Sent';
  // Details for expandable view
  status?: 'Completed' | 'Pending' | 'Failed' | 'Done';
  fee?: number; // in BTC
  hash?: string;
  supportRequest?: string;
  source?: string;
  destination?: string;
}