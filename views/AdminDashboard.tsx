
import React, { useState, useEffect } from 'react';
import { db, auth, firebaseConfig } from '../firebase';
import { initializeApp, getApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, setPersistence, inMemoryPersistence } from 'firebase/auth';
import { collection, query, getDocs, getDoc, updateDoc, doc, onSnapshot, orderBy, limit, deleteDoc, setDoc, where } from 'firebase/firestore';
import { User as UserType, Transaction } from '../types';
import { handleFirestoreError, OperationType } from '../App';
import { Users, CreditCard, Smartphone, CheckCircle2, XCircle, LogOut, Search, Filter, ArrowLeft, ShieldCheck, Clock, Trash2, UserPlus, Ban, Check, Edit2, Loader2 } from 'lucide-react';
import { APP_LOGO, APP_NAME, ACCOUNT_TYPES } from '../constants';

interface AdminDashboardProps {
  onLogout: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, showToast }) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'transactions'>('transactions');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [newBalanceValue, setNewBalanceValue] = useState('');
  
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    pin: '',
    accountType: 'Sub-Admin',
    balance: 0
  });

  const handleEditBalance = async () => {
    if (editingUser && newBalanceValue !== '' && !isNaN(Number(newBalanceValue))) {
      try {
        await updateDoc(doc(db, 'users', editingUser.id), { balance: Number(newBalanceValue) });
        setEditingUser(null);
        setNewBalanceValue('');
        showToast("Balance updated successfully!", 'success');
      } catch (error) {
        console.error("Error updating balance:", error);
        showToast("Failed to update balance", 'error');
      }
    }
  };

  const handleToggleActive = async (u: UserType) => {
    try {
      await updateDoc(doc(db, 'users', u.id), { isActive: !u.isActive });
      showToast(`User ${u.isActive ? 'blocked' : 'unblocked'} successfully!`, 'success');
    } catch (error) {
      console.error("Error toggling active status:", error);
      showToast("Failed to update user status", 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUserToDelete(null);
      showToast("User deleted successfully!", 'success');
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast("Failed to delete user", 'error');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.phone.length !== 11) {
      showToast("Phone must be 11 digits", 'error');
      return;
    }
    
    console.log("Starting handleAddUser for phone:", newUser.phone);
    setIsLoading(true);
    let secondaryApp;
    try {
      // Use phone as ID for manual users to ensure uniqueness and easier tracking
      const authEmail = `${newUser.phone}@mahid.com`;
      const authPassword = newUser.password || '123456';
      
      // Check if user already exists in Firestore by phone
      console.log("Checking if user exists in Firestore...");
      const q = query(collection(db, 'users'), where('phone', '==', newUser.phone));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        console.log("User already exists in Firestore.");
        showToast("A user with this phone number already exists in the database.", 'error');
        setIsLoading(false);
        return;
      }

      // Create Auth user using a secondary app instance to avoid signing out the admin
      const secondaryAppName = `SecondaryApp_${Date.now()}`;
      console.log("Initializing secondary app:", secondaryAppName);
      try {
        secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
      } catch (e) {
        secondaryApp = getApp(secondaryAppName);
      }
      const secondaryAuth = getAuth(secondaryApp);
      
      try {
        console.log("Setting persistence for secondary auth...");
        // Set persistence to 'none' (inMemory) to ensure this doesn't affect the main app's auth state
        await setPersistence(secondaryAuth, inMemoryPersistence);
        
        console.log("Creating user in Firebase Auth...");
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, authEmail, authPassword);
        const authUid = userCredential.user.uid;
        console.log("Auth user created with UID:", authUid);
        
        // Delete the secondary app immediately. 
        // DO NOT call signOut(secondaryAuth) as it might trigger global auth state changes in some environments.
        await deleteApp(secondaryApp);
        secondaryApp = null;
        
        // Prepare user data for Firestore (excluding password)
        const { password, ...userData } = newUser;
        
        // Save to Firestore with the Auth UID as ID
        const path = `users/${authUid}`;
        console.log("Saving user data to Firestore path:", path);
        try {
          await setDoc(doc(db, 'users', authUid), {
            ...userData,
            id: authUid,
            isActive: true,
            role: 'user',
            createdAt: new Date().toISOString()
          });
          
          console.log("User added successfully to Firestore.");
          setIsAddUserModalOpen(false);
          setNewUser({ name: '', phone: '', email: '', password: '', pin: '', accountType: 'Sub-Admin', balance: 0 });
          showToast("User added successfully!", 'success');
        } catch (fsError: any) {
          console.error("Firestore creation failed:", fsError);
          handleFirestoreError(fsError, OperationType.WRITE, path);
          showToast(`Database error: ${fsError.message || "Failed to save user data"}`, 'error');
        }
      } catch (authError: any) {
        console.error("Auth creation failed:", authError);
        if (authError.code === 'auth/email-already-in-use') {
          showToast("This phone number is already registered.", 'error');
        } else if (authError.code === 'auth/weak-password') {
          showToast("Password is too weak. Use at least 6 characters.", 'error');
        } else {
          showToast(`Account error: ${authError.message || "Failed to create account"}`, 'error');
        }
      }
    } catch (error: any) {
      console.error("Error adding user:", error);
      showToast(`Failed to add user: ${error.message || "Unknown error"}`, 'error');
    } finally {
      if (secondaryApp) {
        try {
          await deleteApp(secondaryApp);
        } catch (e) {}
      }
      setIsLoading(false);
    }
  };

  const handleMakeAdmin = async (u: UserType) => {
    try {
      await updateDoc(doc(db, 'users', u.id), { role: 'admin' });
      showToast(`${u.name} is now an admin!`, 'success');
    } catch (error) {
      console.error("Error making admin:", error);
      showToast("Failed to update user role", 'error');
    }
  };

  useEffect(() => {
    setIsLoading(true);
    
    // Listen for all transactions
    const qTx = query(collection(db, 'transactions'), orderBy('date', 'desc'), limit(50));
    const unsubscribeTx = onSnapshot(qTx, (snapshot) => {
      const txList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(txList);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'transactions'));

    // Listen for all users
    const qUsers = query(collection(db, 'users'), limit(100));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserType));
      setUsers(userList);
      setIsLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));

    return () => {
      unsubscribeTx();
      unsubscribeUsers();
    };
  }, []);

  const handleUpdateStatus = async (txId: string, status: 'Success' | 'Failed', userId: string, amount: number, type: string) => {
    try {
      // Update transaction status
      await updateDoc(doc(db, 'transactions', txId), { status });
      
      // If it's an "Add Balance" and we mark as Success, update user balance
      if (status === 'Success' && type === 'Add Balance') {
        const userRef = doc(db, 'users', userId);
        const userSnap = users.find(u => u.id === userId);
        if (userSnap) {
          await updateDoc(userRef, {
            balance: (userSnap.balance || 0) + amount
          });
        }
      }
      
      showToast(`Transaction marked as ${status}`, 'success');
    } catch (error) {
      console.error("Error updating transaction:", error);
      showToast("Failed to update transaction", 'error');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.phone.includes(searchTerm)
  );

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-indigo-900 p-5 flex items-center justify-between shadow-lg rounded-b-[2rem]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <img src={APP_LOGO} alt={APP_NAME} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <h1 className="text-white text-xl font-bold">Admin Panel</h1>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Stats Summary */}
      <div className="px-6 -mt-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-indigo-50 flex justify-around">
          <div className="text-center">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Users</p>
            <p className="text-2xl font-black text-indigo-900">{users.length}</p>
          </div>
          <div className="w-px h-10 bg-gray-100 self-center"></div>
          <div className="text-center">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Pending</p>
            <p className="text-2xl font-black text-orange-500">
              {transactions.filter(t => t.status === 'Pending').length}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder={activeTab === 'users' ? "Search by name or phone..." : "Search transactions..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'transactions' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-400 border border-gray-100'}`}
          >
            <CreditCard size={18} />
            Transactions
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-400 border border-gray-100'}`}
          >
            <Users size={18} />
            Users
          </button>
        </div>

        {activeTab === 'users' && (
          <button 
            onClick={() => setIsAddUserModalOpen(true)}
            className="w-full py-3 bg-green-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-100 hover:bg-green-700 transition-all"
          >
            <UserPlus size={18} />
            Add New User
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-medium">Loading data...</p>
          </div>
        ) : activeTab === 'transactions' ? (
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 italic">No transactions found</p>
              </div>
            ) : (
              filteredTransactions.map(tx => (
                <div key={tx.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl ${tx.type === 'Add Balance' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                        {tx.type === 'Add Balance' ? <CreditCard size={20} /> : <Smartphone size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{tx.type}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{tx.date}</p>
                      </div>
                    </div>
                    <p className="text-lg font-black text-indigo-900">৳{tx.amount}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">{tx.description}</p>
                  </div>

                  {tx.status === 'Pending' ? (
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => handleUpdateStatus(tx.id, 'Success', tx.userId || '', tx.amount, tx.type)}
                        className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-green-600 active:scale-95 transition-all"
                      >
                        <CheckCircle2 size={16} />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(tx.id, 'Failed', tx.userId || '', tx.amount, tx.type)}
                        className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-600 active:scale-95 transition-all"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold ${tx.status === 'Success' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                      {tx.status === 'Success' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {tx.status}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 italic">No users found</p>
              </div>
            ) : (
              filteredUsers.map(u => (
                <div key={u.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{u.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{u.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-indigo-600">৳{u.balance?.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{u.accountType || 'User'}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-1 border-t border-gray-50">
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => handleMakeAdmin(u)}
                        className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold hover:bg-indigo-100 transition-all"
                      >
                        Make Admin
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setEditingUser(u);
                        setNewBalanceValue(u.balance.toString());
                      }}
                      className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-bold hover:bg-gray-100 transition-all"
                    >
                      Balance
                    </button>
                    <button 
                      onClick={() => handleToggleActive(u)}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all ${u.isActive ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}
                    >
                      {u.isActive ? 'Block' : 'Unblock'}
                    </button>
                    <button 
                      onClick={() => setUserToDelete(u)}
                      className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete User?</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete <span className="font-bold text-gray-700">{userToDelete.name}</span>? 
                This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteUser(userToDelete.id)}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Balance Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">Edit Balance</h3>
              <p className="text-sm text-gray-500">Updating balance for {editingUser.name}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">New Balance (৳)</label>
              <input 
                type="number"
                value={newBalanceValue}
                onChange={(e) => setNewBalanceValue(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-900"
                placeholder="0.00"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setEditingUser(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleEditBalance}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 my-8 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">Add New User</h3>
              <p className="text-sm text-gray-500">Create a new account manually</p>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                <input 
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                <input 
                  type="tel"
                  required
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value.replace(/\D/g, '').slice(0, 11)})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="01XXXXXXXXX"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                  <input 
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="******"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">PIN</label>
                  <input 
                    type="password"
                    required
                    value={newUser.pin}
                    onChange={(e) => setNewUser({...newUser, pin: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="1234"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Account Type</label>
                <select 
                  value={newUser.accountType}
                  onChange={(e) => setNewUser({...newUser, accountType: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {ACCOUNT_TYPES.map(t => (
                    <option key={t.name} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Initial Balance (৳)</label>
                <input 
                  type="number"
                  value={newUser.balance}
                  onChange={(e) => setNewUser({...newUser, balance: Number(e.target.value)})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 shadow-lg shadow-green-100 transition-all flex items-center justify-center"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
