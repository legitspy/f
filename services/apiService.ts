import type { UserProfile, Transaction } from '../types';

// This is a MOCK backend service that simulates fetching data from a Google Sheet.
// In a real application, these functions would make authenticated HTTP requests 
// to your own backend server, which would then interact with the Google Sheets API.

interface MockDbUserRecord {
  profile: UserProfile;
  transactions: Transaction[];
  twoFactorCode: string;
}

const MOCK_SHEETS_DB: Record<string, MockDbUserRecord> = {
  'fortunatefranklin@gmail.com': {
    profile: {
      uid: 'mock-uid-123',
      email: 'fortunatefranklin@gmail.com',
      displayName: 'BTCSG LTD',
      balance: 1.80, // Updated balance
    },
    transactions: ([
        {
            id: 'tx-17',
            date: '2025-10-25',
            time: '14:00',
            description: 'Received',
            amount: 0.75,
            category: 'Received',
            status: 'Done',
            hash: 'a7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8',
            source: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        },
        {
            id: 'tx-1',
            date: '2025-10-22',
            time: '07:31',
            description: 'Received',
            amount: 1,
            category: 'Received',
            status: 'Done',
            hash: '67e39f9ff86b55c0d8e57e9e42ffc4aa15a383423a4a31f793cec70a59f8092a',
            source: 'bc1qfgeupj23f50koryxbdvxj7e4362vcth423w6h4',
        },
        {
            id: 'tx-10',
            date: '2025-10-15',
            time: '11:45',
            description: 'Received',
            amount: 0.05,
            category: 'Received',
            status: 'Done',
            hash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
            source: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        },
        {
            id: 'tx-2',
            date: '2025-09-10',
            time: '05:28',
            description: 'Sent',
            amount: -0.014668,
            category: 'Sent',
            status: 'Done',
        },
        {
            id: 'tx-11',
            date: '2025-09-01',
            time: '18:02',
            description: 'Received',
            amount: 0.1,
            category: 'Received',
            status: 'Done',
            hash: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
            source: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
        },
        {
            id: 'tx-14',
            date: '2025-08-15',
            time: '14:20',
            description: 'Received',
            amount: 0.12,
            category: 'Received',
            status: 'Done',
            hash: 'd5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6',
            source: '1LmoENgs5Rai6a6Gg4i222a75xJ8q43jB',
        },
        {
            id: 'tx-3',
            date: '2025-08-27',
            time: '07:50',
            description: 'Sent',
            amount: -0.007304,
            category: 'Sent',
            status: 'Done',
        },
        {
            id: 'tx-4',
            date: '2025-07-21',
            time: '07:36',
            description: 'Sent',
            amount: -0.0068,
            category: 'Sent',
            status: 'Done',
        },
        {
            id: 'tx-5',
            date: '2025-07-04',
            time: '15:31',
            description: 'Sent',
            amount: -0.000032,
            category: 'Sent',
            status: 'Done',
        },
        {
            id: 'tx-12',
            date: '2025-07-02',
            time: '09:15',
            description: 'Received',
            amount: 0.03,
            category: 'Received',
            status: 'Done',
            hash: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
            source: '1CounterpartyXXXXXXXXXXXXXXXUWLpVr',
        },
        {
            id: 'tx-6',
            date: '2025-07-01',
            time: '13:42',
            description: 'Sent',
            amount: -0.000032,
            category: 'Sent',
            status: 'Done',
        },
        {
            id: 'tx-7',
            date: '2025-06-24',
            time: '08:28',
            description: 'Sent',
            amount: -0.00733,
            category: 'Sent',
            status: 'Done',
        },
        {
            id: 'tx-15',
            date: '2025-06-10',
            time: '20:05',
            description: 'Received',
            amount: 0.05,
            category: 'Received',
            status: 'Done',
            hash: 'e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
            source: '1Mda991T6gY42aYt4X6z7Z8k9L5p3R7q2',
        },
        {
            id: 'tx-8',
            date: '2025-06-20',
            time: '08:32',
            description: 'Sent',
            amount: -0.0046,
            category: 'Sent',
            status: 'Done',
        },
        {
            id: 'tx-9',
            date: '2025-05-16',
            time: '08:05',
            description: 'Sent',
            amount: -0.00222,
            category: 'Sent',
            status: 'Done',
        },
        {
            id: 'tx-16',
            date: '2025-04-05',
            time: '09:55',
            description: 'Received',
            amount: 0.00571473,
            category: 'Received',
            status: 'Done',
            hash: 'f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a0b1c2d3e4f5a6b7c8d9e0',
            source: '1N4QbcrB1t4p4x8qGg4b8n8z3A6h8s4T2',
        },
        {
            id: 'tx-13',
            date: '2022-01-26',
            time: '03:46',
            description: 'Sent',
            amount: -0.83,
            category: 'Sent',
            status: 'Done',
            hash: 'c4776bcd3c86a0a3e935b3d7bc31be75d577185bb69a010bf76ffca5cce5f067',
            destination: 'bc1qljt2x3jamnakj98m74kuxufdtrk2svtmfa0u6k',
            fee: 0.00004403,
        },
    ] as Transaction[]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), // Serve most recent first
    twoFactorCode: '123456'
  }
};

const networkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const verify2FACode = async (email: string, code: string): Promise<boolean> => {
  await networkDelay(500);
  // For the demo, accept any code.
  console.log(`Verifying 2FA for ${email} with code ${code}. Auto-accepting.`);
  return true;
};

export const getUserProfile = async (email: string): Promise<UserProfile> => {
  await networkDelay(700);
  const userRecord = MOCK_SHEETS_DB[email as keyof typeof MOCK_SHEETS_DB];
  if (userRecord) {
    return userRecord.profile;
  }
  throw new Error('User profile not found.');
};

export const getTransactions = async (email: string): Promise<Transaction[]> => {
  await networkDelay(1000);
  const userRecord = MOCK_SHEETS_DB[email as keyof typeof MOCK_SHEETS_DB];
  if (userRecord) {
    return userRecord.transactions;
  }
  throw new Error('Transactions not found.');
};