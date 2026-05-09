
import React, { useState, useEffect } from 'react';
import { Home, User, Smartphone, History, PlusCircle, CreditCard, Send, LogOut, MessageSquare, Share2, Download, ShieldCheck, ChevronRight, KeyRound, AlertCircle, CheckCircle, Edit2 } from 'lucide-react';
import { AppView, User as UserType, Transaction, Notice } from './types';
import { APP_NAME, WHATSAPP_LINK, APK_DOWNLOAD_URL, HELPLINE_WHATSAPP, APP_LOGO } from './constants';
import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  getDocFromServer,
  orderBy,
  limit,
  deleteDoc
} from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  const errorMsg = JSON.stringify(errInfo);
  console.error('Firestore Error: ', errorMsg);
  return errInfo; // Return errInfo instead of throwing to allow caller to handle or re-throw
};
import Login from './views/Login';
import SignUp from './views/SignUp';
import HomeView from './views/Home';
import MobileRecharge from './views/MobileRecharge';
import AddBalance from './views/AddBalance';
import BillPay from './views/BillPay';
import BalanceTransfer from './views/BalanceTransfer';
import DrivePackages from './views/DrivePackages';
import MBanking from './views/MBanking';
import BBanking from './views/BBanking';
import AddReseller from './views/AddReseller';
import Notifications from './views/Notifications';
import PaymentGateway from './views/PaymentGateway';
import AccountActivation from './views/AccountActivation';
import ChangePin from './views/ChangePin';
import ChangePassword from './views/ChangePassword';
import PrivacyPolicy from './views/PrivacyPolicy';
import ApiKey from './views/ApiKey';
import MyDevice from './views/MyDevice';
import AdminDashboard from './views/AdminDashboard';
import EditProfile from './views/EditProfile';
import HistoryView from './views/History';
import ProfileView from './views/Profile';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('login');
  const [rechargeTab, setRechargeTab] = useState<'online' | 'offline'>('online');
  const [user, setUser] = useState<UserType | null>(null);
  const userRef = React.useRef<UserType | null>(null);
  
  // Sync userRef with user state
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const [history, setHistory] = useState<Transaction[]>([]);
  const [pendingSignUp, setPendingSignUp] = useState<{ name: string, phone: string, accountType: string, fee: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [settings, setSettings] = useState({
    apkDownloadUrl: APK_DOWNLOAD_URL,
    whatsappLink: WHATSAPP_LINK,
    helplineNumber: HELPLINE_WHATSAPP,
    appName: APP_NAME,
    appLogo: APP_LOGO,
    shareUrl: APK_DOWNLOAD_URL
  });

  // Global error boundary state
  const [errorHeader, setErrorHeader] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    // If it's a permission error, make it more user-friendly
    const friendlyMessage = message.includes('permission') 
      ? "Access Denied: You don't have permission to perform this action. Please check your account status."
      : typeof message === 'string' ? message : "An unexpected error occurred.";
    
    setToast({ message: friendlyMessage, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Add global window error listener
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Global Error Caught:", event.error);
      setErrorHeader(event.error?.message || "A runtime error occurred.");
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Validate connection to Firestore
  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  }, []);

  // Listen for global settings and notices
  useEffect(() => {
    // Listen for notice
    const unsubscribeNotice = onSnapshot(doc(db, 'notices', 'current'), (snap) => {
      if (snap.exists()) {
        setNotice(snap.data() as Notice);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'notices/current'));

    // Listen for global settings
    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'global'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setSettings({
          apkDownloadUrl: data.apkDownloadUrl || APK_DOWNLOAD_URL,
          whatsappLink: data.whatsappLink || WHATSAPP_LINK,
          helplineNumber: data.helplineNumber || HELPLINE_WHATSAPP,
          appName: data.appName || APP_NAME,
          appLogo: data.appLogo || APP_LOGO,
          shareUrl: data.shareUrl || APK_DOWNLOAD_URL
        });
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/global'));

    return () => {
      unsubscribeNotice();
      unsubscribeSettings();
    };
  }, []);

  // Safety timeout for loading state
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        console.warn("Loading timeout reached. Forcing interface to open.");
        setIsLoading(false);
      }, 5000); // 5 seconds safety net
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Listen for Auth state changes
  useEffect(() => {
    let unsubscribeUser: (() => void) | null = null;
    let unsubscribeHistory: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("Auth state changed: User logged in", firebaseUser.uid);
        
        // If we already have a user and the UID matches, don't re-initialize everything
        if (userRef.current && userRef.current.id === firebaseUser.uid) {
          console.log("User already initialized, skipping re-fetch");
          return;
        }
        
        // Real-time user data
        unsubscribeUser = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data() as UserType;
            setUser(userData);
            if (userData.role === 'admin') {
              setView('admin-dashboard');
            } else if (!userData.isActive && view !== 'payment-gateway') {
              setView('account-activation');
            }
          }
          setIsLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
          setIsLoading(false);
        });

        // Real-time history
        const q = query(
          collection(db, 'transactions'), 
          where('userId', '==', firebaseUser.uid),
          orderBy('date', 'desc'),
          limit(20)
        );
        unsubscribeHistory = onSnapshot(q, (snapshot) => {
          const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
          setHistory(txs);
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'transactions');
        });

      } else {
        console.log("Auth state changed: User logged out");
        setUser(null);
        setHistory([]);
        if (unsubscribeUser) unsubscribeUser();
        if (unsubscribeHistory) unsubscribeHistory();
        setView(prev => (prev === 'signup' || prev === 'privacy-policy') ? prev : 'login');
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeHistory) unsubscribeHistory();
    };
  }, []);

  const handleLogin = async (phoneInput: string, passwordInput?: string, pinInput?: string) => {
    try {
      const phone = phoneInput.trim();
      const pass = (passwordInput || '').trim();
      const pin = (pinInput || '').trim();
      
      console.log("Attempting login for phone:", phone);
      const email = `${phone}@mahid.com`;
      
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        console.log("Auth successful, UID:", userCredential.user.uid);
      } catch (authError: any) {
        console.log("Initial auth failed. Code:", authError.code, "Message:", authError.message);
        
        const isCredentialError = authError.code === 'auth/user-not-found' || 
                                 authError.code === 'auth/invalid-credential' ||
                                 authError.code === 'auth/wrong-password' ||
                                 authError.message?.toLowerCase().includes('invalid-credential') ||
                                 authError.message?.toLowerCase().includes('user-not-found');

        if (isCredentialError) {
          console.log("Checking Firestore for manual entry for phone:", phone);
          
          let userData: UserType | null = null;
          let userDocId: string | null = null;

          // Try getting document directly by phone as ID (Manual Admin Entry)
          const directDoc = await getDoc(doc(db, 'users', phone));
          if (directDoc.exists()) {
            userData = directDoc.data() as UserType;
            userDocId = directDoc.id;
          }
          
          if (userData && userDocId) {
            console.log("User found in Firestore. Checking password...");
            if (userData.password === pass) {
              console.log("Password matches. Attempting auto-registration...");
              try {
                const newUserCredential = await createUserWithEmailAndPassword(auth, email, pass);
                const newUid = newUserCredential.user.uid;
                
                const updatedUserData = { ...userData, id: newUid };
                await setDoc(doc(db, 'users', newUid), updatedUserData);
                
                console.log("Auto-registration successful. New UID:", newUid);
              } catch (createError: any) {
                if (createError.code === 'auth/email-already-in-use') {
                  throw new Error("Invalid phone number or password.");
                }
                throw new Error("Account setup failed. Please contact admin.");
              }
            } else {
              throw new Error("Invalid phone number or password.");
            }
          } else {
            throw new Error("User not found. Please sign up first.");
          }
        } else {
          throw authError;
        }
      }

      // Re-fetch current user after potential auto-registration
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error("Authentication failed");

      const path = `users/${firebaseUser.uid}`;
      try {
        let userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        // Fallback: If document doesn't exist by UID, try finding by email or phone
        if (!userDoc.exists()) {
          console.log("User document not found by UID, searching by email/phone...");
          const email = firebaseUser.email;
          const phone = email?.split('@')[0];
          
          const q = query(collection(db, 'users'), where('phone', '==', phone));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const existingDoc = querySnapshot.docs[0];
            const existingData = existingDoc.data();
            console.log("Found existing user document by phone. Migrating to new UID...");
            
            // Migrate document to new UID
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              ...existingData,
              id: firebaseUser.uid
            });
            
            // Delete old document if ID was different
            if (existingDoc.id !== firebaseUser.uid) {
              await deleteDoc(doc(db, 'users', existingDoc.id));
            }
            
            userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          } else if (email === 'mdmahid4336@gmail.com' || email === '01920544401@mahid.com') {
            // Auto-repair for admin accounts
            console.log("Admin account detected with missing document. Repairing...");
            const adminData = {
              id: firebaseUser.uid,
              name: 'Admin',
              phone: email === 'mdmahid4336@gmail.com' ? '01920544401' : '01920544401',
              email: email,
              balance: 1000000,
              isActive: true,
              role: 'admin',
              createdAt: new Date().toISOString(),
              pin: '998877'
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), adminData);
            userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          }
        }

        if (userDoc.exists()) {
          const userData = userDoc.data() as UserType;
          
          // Admin Bootstrap: If user uses this secret PIN, they become admin
          if (pin === '998877') {
            if (userData.role !== 'admin') {
              await updateDoc(doc(db, 'users', firebaseUser.uid), { 
                role: 'admin',
                isActive: true 
              });
              userData.role = 'admin';
              userData.isActive = true;
              showToast("Congratulations! You are now an Admin.");
            }
            setUser(userData);
            setView('admin-dashboard');
            return;
          }

          if (userData.role === 'admin') {
            setUser(userData);
            setView('admin-dashboard');
            return;
          }

          if (userData.pin !== pin) {
            showToast("Incorrect PIN. Please try again.", 'error');
            await signOut(auth);
            return;
          }
          
          if (!userData.isActive) {
            showToast("Your account is currently blocked or inactive. Please contact admin.", 'error');
            await signOut(auth);
            return;
          }

          setUser(userData);
          setView('home');
        } else {
          showToast("User data not found in database. Please contact support.", 'error');
          await signOut(auth);
        }
      } catch (err) {
        console.error("Error fetching user document:", err);
        showToast("Database error. Please try again later.", 'error');
        await signOut(auth);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      showToast(error.message || "Login failed. Please try again.", 'error');
    }
  };

  const handleSignUp = async (userData: Partial<UserType>) => {
    try {
      console.log("Starting signup for:", userData.phone);
      // Use phone as part of email for Firebase Auth
      const authEmail = `${userData.phone}@mahid.com`;
      const userCredential = await createUserWithEmailAndPassword(auth, authEmail, userData.password || '');
      console.log("Auth user created:", userCredential.user.uid);
      
      const newUser: UserType = {
        ...userData,
        id: userCredential.user.uid,
        balance: 0,
        isActive: false,
        role: 'user'
      } as UserType;
      
      const path = `users/${newUser.id}`;
      try {
        await setDoc(doc(db, 'users', newUser.id), newUser);
        console.log("User document created successfully in Firestore");
        setUser(newUser);
        setView('account-activation');
        showToast("Registration Successful!");
      } catch (err) {
        console.error("Firestore setDoc failed during signup:", err);
        const errInfo = handleFirestoreError(err, OperationType.WRITE, path) as FirestoreErrorInfo;
        
        // Cleanup: If Firestore fails, delete the auth user so they can try again
        try {
          await userCredential.user.delete();
          console.log("Auth user deleted due to Firestore failure");
        } catch (deleteErr) {
          console.error("Failed to delete auth user after Firestore failure:", deleteErr);
          // If we can't delete, at least sign out
          await signOut(auth);
        }
        
        throw new Error(`Registration failed at database step: ${errInfo.error}`);
      }
    } catch (error: any) {
      console.error("Signup error in handleSignUp:", error);
      let msg = "Signup failed";
      if (error.code === 'auth/email-already-in-use') {
        msg = "This phone number is already registered. Please try logging in.";
      } else if (error.code === 'auth/weak-password') {
        msg = "Password is too weak. Please use at least 6 characters.";
      } else if (error.message) {
        msg = error.message;
      }
      showToast(msg, 'error');
      throw error; // Re-throw so the view knows it failed
    }
  };

  const handleAddReseller = async (name: string, phone: string, level: string) => {
    try {
      const newUser: UserType = {
        id: 'u' + Math.random().toString(36).substr(2, 9),
        name,
        phone,
        balance: 0,
        isActive: true, // Resellers added by admin are active by default
        accountType: level
      };
      await setDoc(doc(db, 'users', newUser.id), newUser);
      showToast(`Reseller ${name} added successfully!`);
    } catch (error) {
      console.error("Error adding reseller:", error);
    }
  };

  const handlePaymentSuccess = async () => {
    if (user) {
      try {
        // Create a transaction record for the registration fee
        const txId = Math.random().toString(36).substr(2, 9).toUpperCase();
        const regTx: Transaction = {
          id: txId,
          userId: user.id,
          type: 'Add Balance',
          amount: pendingSignUp?.fee || 0,
          date: new Date().toISOString(),
          status: 'Pending',
          description: `Registration Fee - ${user.accountType}`
        };
        await setDoc(doc(db, 'transactions', txId), regTx);

        await updateDoc(doc(db, 'users', user.id), { isActive: true });
        setUser({ ...user, isActive: true });
        setView('home');
        showToast("Payment Submitted! Your account is now active.");
      } catch (error) {
        console.error("Error activating account:", error);
        showToast("Failed to process activation.", "error");
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setView('login');
  };

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => {
    if (!user) return;

    // Balance check for deductions
    if (tx.type !== 'Add Balance' && user.balance < tx.amount) {
      showToast("Insufficient balance for this transaction.", 'error');
      return;
    }

    const txId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const newTx: Transaction = {
      ...tx,
      id: txId,
      userId: user.id,
      date: new Date().toISOString(),
      status: 'Pending'
    };

    try {
      // Save to Firestore
      await setDoc(doc(db, 'transactions', txId), newTx);
      
      // If it's a deduction (Recharge, Bill Pay, Transfer), deduct balance immediately
      if (tx.type !== 'Add Balance') {
        await updateDoc(doc(db, 'users', user.id), {
          balance: user.balance - tx.amount
        });
      }
      
      console.log("Transaction added successfully");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `transactions/${txId}`);
      showToast("Failed to process transaction. Please try again.", 'error');
    }
  };

  const handleShare = () => {
    const url = settings.shareUrl || window.location.href;
    if (navigator.share) {
      navigator.share({
        title: settings.appName,
        text: `Check out ${settings.appName} for easy recharge and bill pay!`,
        url: url,
      }).catch(console.error);
    } else {
      showToast("Sharing is not supported on this browser. Copy this URL: " + url, 'error');
    }
  };

  const renderView = () => {
    if (!user && view !== 'signup') return <Login onLogin={handleLogin} onGoToSignUp={() => setView('signup')} onGoToPrivacy={() => setView('privacy-policy')} showToast={showToast} />;
    if (!user && view === 'signup') return <SignUp onSignUp={handleSignUp} onGoToLogin={() => setView('login')} onGoToPrivacy={() => setView('privacy-policy')} showToast={showToast} />;

    switch (view) {
      case 'admin-dashboard': return <AdminDashboard onLogout={handleLogout} showToast={showToast} />;
      case 'home': return <HomeView user={user!} history={history} setView={setView} setRechargeTab={setRechargeTab} handleShare={handleShare} onLogout={handleLogout} showToast={showToast} notice={notice} settings={settings} />;
      case 'recharge': return <MobileRecharge user={user!} initialTab={rechargeTab} onBack={() => setView('home')} onAddTransaction={addTransaction} showToast={showToast} />;
      case 'add-balance': return <AddBalance onBack={() => setView('home')} onAddTransaction={addTransaction} showToast={showToast} />;
      case 'bill-pay': return <BillPay user={user!} onBack={() => setView('home')} onAddTransaction={addTransaction} showToast={showToast} />;
      case 'transfer': return <BalanceTransfer user={user!} onBack={() => setView('home')} onAddTransaction={addTransaction} showToast={showToast} />;
      case 'drive-packages': return <DrivePackages user={user!} onBack={() => setView('home')} onAddTransaction={addTransaction} showToast={showToast} />;
      case 'm-banking': return <MBanking user={user!} onBack={() => setView('home')} onAddTransaction={addTransaction} showToast={showToast} />;
      case 'b-banking': return <BBanking user={user!} onBack={() => setView('home')} onAddTransaction={addTransaction} showToast={showToast} />;
      case 'add-reseller': return <AddReseller onBack={() => setView('home')} onAddReseller={handleAddReseller} showToast={showToast} />;
      case 'notifications': return <Notifications onBack={() => setView('home')} />;
      case 'payment-gateway': return (
        <PaymentGateway 
          amount={pendingSignUp?.fee || user?.balance || 0} 
          accountType={pendingSignUp?.accountType || user?.accountType || ''} 
          onPaymentSuccess={handlePaymentSuccess} 
          onBack={() => setView(user ? 'account-activation' : 'signup')} 
          showToast={showToast}
        />
      );
      case 'account-activation': return (
        <AccountActivation 
          user={user!} 
          onActivate={(fee) => {
            setPendingSignUp({ name: user!.name, phone: user!.phone, accountType: user!.accountType || 'Personal', fee });
            setView('payment-gateway');
          }}
          onLogout={handleLogout}
          showToast={showToast}
        />
      );
      case 'change-pin': return <ChangePin onBack={() => setView('profile')} showToast={showToast} />;
      case 'change-password': return <ChangePassword onBack={() => setView('profile')} showToast={showToast} />;
      case 'privacy-policy': return <PrivacyPolicy onBack={() => setView(user ? 'profile' : 'login')} />;
      case 'api-key': 
        if (user?.role !== 'admin') {
          setView('profile');
          return null;
        }
        return <ApiKey onBack={() => setView('profile')} showToast={showToast} />;
      case 'my-device': return <MyDevice onBack={() => setView('profile')} showToast={showToast} />;
      case 'edit-profile': return <EditProfile user={user!} onBack={() => setView('profile')} showToast={showToast} />;
      case 'history': return <HistoryView history={history} onBack={() => setView('home')} showToast={showToast} />;
      case 'profile': return <ProfileView user={user!} onBack={() => setView('home')} onLogout={handleLogout} onNavigate={(v) => setView(v)} />;

      default: return <HomeView user={user!} history={history} setView={setView} setRechargeTab={setRechargeTab} handleShare={handleShare} onLogout={handleLogout} showToast={showToast} notice={notice} settings={settings} />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative pb-20 overflow-x-hidden shadow-2xl">
      {/* Header */}
      {user && view !== 'login' && view !== 'signup' && view !== 'admin-dashboard' && (
        <header className="bg-blue-700 text-white p-4 pt-6 rounded-b-3xl shadow-lg sticky top-0 z-50">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Smartphone size={20} />
              </div>
              <h1 className="text-lg font-bold tracking-tight">{settings.appName}</h1>
            </div>
            <button onClick={() => setView('profile')} className="p-1 border-2 border-white/30 rounded-full overflow-hidden w-8 h-8 flex items-center justify-center">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User size={20} />
              )}
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="animate-in fade-in duration-300">
        {errorHeader && (
          <div className="absolute inset-0 z-[200] bg-red-600 text-white flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle size={64} className="mb-4" />
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="opacity-90 mb-6">{errorHeader}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-white text-red-600 px-8 py-3 rounded-2xl font-bold shadow-lg"
            >
              Restart App
            </button>
          </div>
        )}
        {isLoading ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-blue-700 text-white p-6 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl overflow-hidden border-4 border-white/20">
              <img src={settings.appLogo} alt={settings.appName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">{settings.appName}</h1>
            <p className="text-blue-100/60 text-sm font-medium animate-pulse uppercase tracking-[0.2em]">Loading System...</p>
            
            <div className="mt-12 w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-white animate-[loading_2s_ease-in-out_infinite] w-1/2 rounded-full"></div>
            </div>
          </div>
        ) : renderView()}
      </main>

      {/* Bottom Navigation */}
      {user && view !== 'login' && view !== 'signup' && view !== 'admin-dashboard' && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 flex justify-around p-3 safe-area-bottom shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
          <button onClick={() => setView('home')} className={`flex flex-col items-center ${view === 'home' ? 'text-blue-600' : 'text-gray-400'}`}>
            <Home size={22} />
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </button>
          <button onClick={() => setView('history')} className={`flex flex-col items-center ${view === 'history' ? 'text-blue-600' : 'text-gray-400'}`}>
            <History size={22} />
            <span className="text-[10px] mt-1 font-medium">History</span>
          </button>
          <button onClick={() => setView('profile')} className={`flex flex-col items-center ${view === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full overflow-hidden border ${view === 'profile' ? 'border-blue-600' : 'border-gray-300'} flex items-center justify-center`}>
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User size={18} />
              )}
            </div>
            <span className="text-[10px] mt-1 font-medium">Profile</span>
          </button>
        </nav>
      )}
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[280px] border ${
            toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-bold">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
