// This is a MOCK Firebase service for demonstration.
// In a real application, you would use the actual Firebase SDK
// import { initializeApp } from "firebase/app";
// import { getAuth, ... } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "your-auth-domain",
//   ...
// };
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);

// For this demo, we'll simulate the auth object and its methods.

interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface MockUserCredential {
  user: MockUser;
}

let currentUser: MockUser | null = null;
let authStateListener: ((user: MockUser | null) => void) | null = null;

const MOCK_USERS: { [email: string]: { pass: string, uid: string, pin: string } } = {
  "fortunatefranklin@gmail.com": { pass: "password123", uid: "mock-uid-123", pin: "1234" }
};

const notifyListener = () => {
  if (authStateListener) {
    authStateListener(currentUser);
  }
};

export const auth = {
  signOut: (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentUser = null;
        notifyListener();
        resolve();
      }, 200);
    });
  },
  signInWithPin: (pin: string): Promise<MockUserCredential> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const email = "fortunatefranklin@gmail.com";
        // Accept any PIN for the demo.
        if (MOCK_USERS[email]) {
          console.log(`Signing in with PIN: ${pin}. Auto-accepting for demo.`);
          currentUser = { email, uid: MOCK_USERS[email].uid, displayName: "BTCSG LTD" };
          notifyListener();
          resolve({ user: currentUser });
        } else {
          reject(new Error("Mock user not found."));
        }
      }, 500);
    });
  },
};

export const onAuthStateChanged = (callback: (user: MockUser | null) => void): (() => void) => {
  authStateListener = callback;
  // Immediately call with current state
  callback(currentUser);
  
  // Return an unsubscribe function
  return () => {
    authStateListener = null;
  };
};