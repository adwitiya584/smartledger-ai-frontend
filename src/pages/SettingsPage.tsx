import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import {
  User, Shield, Trash2, AlertTriangle,
  Mail, Lock, CheckCircle
} from 'lucide-react';

const SettingsPage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me').then(res => setProfile(res.data));
  }, []);

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm');
      return;
    }
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await api.delete('/auth/delete-account', {
        data: { password: deletePassword }
      });
      setDeleted(true);
      setTimeout(() => {
        localStorage.clear();
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setDeleteError(err?.response?.data?.message || 'Failed to delete account');
    }
    setDeleteLoading(false);
  };

  const inputClass = "w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm";

  return (
    <div className="space-y-6 animate-slide-up max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Info */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <User size={18} className="text-indigo-400" />
          Profile Information
        </h3>
        {profile && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-white/3 rounded-xl border border-white/5">
              <div className="w-14 h-14 rounded-2xl balance-gradient flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {profile.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold text-lg">{profile.name}</p>
                <p className="text-slate-400 text-sm">{profile.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  {profile.emailVerified ? (
                    <>
                      <CheckCircle size={12} className="text-green-400" />
                      <span className="text-green-400 text-xs">Email Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={12} className="text-amber-400" />
                      <span className="text-amber-400 text-xs">Email Not Verified</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Shield size={18} className="text-green-400" />
          Security
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/3 rounded-xl">
            <div className="flex items-center gap-3">
              <Lock size={16} className="text-slate-400" />
              <div>
                <p className="text-white text-sm">Password</p>
                <p className="text-slate-500 text-xs">BCrypt encrypted</p>
              </div>
            </div>
            <span className="text-green-400 text-xs glass px-2 py-1 rounded-full">Protected</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/3 rounded-xl">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-slate-400" />
              <div>
                <p className="text-white text-sm">Email OTP Verification</p>
                <p className="text-slate-500 text-xs">Required for registration</p>
              </div>
            </div>
            <span className="text-green-400 text-xs glass px-2 py-1 rounded-full">Active</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass rounded-2xl p-6 border border-red-500/20">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <Trash2 size={18} className="text-red-400" />
          Danger Zone
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          Once you delete your account, all your data will be permanently removed.
          This action cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-500/20 transition"
        >
          <Trash2 size={16} />
          Delete My Account
        </button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-md animate-slide-up border border-red-500/30">
            {deleted ? (
              <div className="text-center py-4">
                <CheckCircle size={48} className="text-green-400 mx-auto mb-3" />
                <p className="text-white font-semibold">Account Deleted</p>
                <p className="text-slate-400 text-sm mt-1">
                  All your data has been removed. Redirecting...
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle size={20} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Delete Account</h3>
                    <p className="text-red-400 text-xs">This action is irreversible</p>
                  </div>
                </div>

                <p className="text-slate-400 text-sm mb-4">
                  This will permanently delete:
                </p>
                <ul className="text-slate-500 text-xs space-y-1 mb-4 ml-4">
                  <li>• All your transactions</li>
                  <li>• All investments & loans</li>
                  <li>• All savings goals</li>
                  <li>• Your profile and settings</li>
                </ul>

                {deleteError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-3 py-2 mb-3 text-xs">
                    {deleteError}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">
                      Enter your password
                    </label>
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={e => setDeletePassword(e.target.value)}
                      placeholder="Your account password"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">
                      Type <span className="text-red-400 font-bold">DELETE</span> to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteConfirm}
                      onChange={e => setDeleteConfirm(e.target.value)}
                      placeholder="DELETE"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading || deleteConfirm !== 'DELETE' || !deletePassword}
                    className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-medium hover:bg-red-600 transition disabled:opacity-50 text-sm"
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete Forever'}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeletePassword('');
                      setDeleteConfirm('');
                      setDeleteError('');
                    }}
                    className="flex-1 glass text-slate-400 py-2.5 rounded-xl text-sm hover:text-white transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;