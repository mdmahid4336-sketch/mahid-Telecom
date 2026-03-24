
import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, User, Phone, Mail, Save, Loader2 } from 'lucide-react';
import { User as UserType } from '../types';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../App';

interface EditProfileProps {
  user: UserType;
  onBack: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onBack, showToast }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [nid, setNid] = useState(user.nid || '');
  const [dob, setDob] = useState(user.dob || '');
  const [gender, setGender] = useState(user.gender || '');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) { // 500KB limit
        showToast("Image size should be less than 500KB", 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateDoc(doc(db, 'users', user.id), {
        name,
        email,
        photoURL,
        nid,
        dob,
        gender
      });
      showToast("Profile updated successfully!");
      onBack();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.id}`);
      showToast("Failed to update profile", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 min-h-screen bg-gray-50 pb-10">
      <div className="bg-blue-700 text-white p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">Edit Profile</h2>
      </div>

      <div className="p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex flex-col items-center mb-8">
            <div 
              className="relative cursor-pointer group"
              onClick={handleImageClick}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-blue-50 flex items-center justify-center">
                {photoURL ? (
                  <img 
                    src={photoURL} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User size={64} className="text-blue-200" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md group-hover:bg-blue-700 transition-colors">
                <Camera size={20} />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <p className="text-xs text-gray-400 mt-3">Click to change profile picture</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
              <div className="relative opacity-60">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  value={user.phone}
                  disabled
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-2xl border border-gray-100 cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-gray-400 ml-1">Phone number cannot be changed</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">NID Number</label>
              <input
                type="text"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                placeholder="Enter NID number"
                className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-transform mt-4 disabled:opacity-70"
          >
            {isSaving ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            <span>Save Changes</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
