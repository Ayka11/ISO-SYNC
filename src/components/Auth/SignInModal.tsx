import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'signin' | 'register';
}

const SignInModal: React.FC<Props> = ({ isOpen, onClose, mode = 'signin' }) => {
  const { login, register } = useAuth();
  const [m, setM] = useState<'signin' | 'register'>(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setM(mode), [mode]);

  useEffect(() => {
    if (!isOpen) {
      setEmail(''); setPassword(''); setName(''); setError(null); setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (m === 'signin') {
        await login(email, password);
      } else {
        await register(email, password, name || email);
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <form onSubmit={submit} className="relative z-10 w-full max-w-md bg-[#0b0b14] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{m === 'signin' ? 'Sign In' : 'Register'}</h3>
          <div className="flex gap-2">
            <button type="button" onClick={() => setM('signin')} className={`px-3 py-1 rounded ${m === 'signin' ? 'bg-indigo-600 text-white' : 'text-gray-300'}`}>Sign In</button>
            <button type="button" onClick={() => setM('register')} className={`px-3 py-1 rounded ${m === 'register' ? 'bg-indigo-600 text-white' : 'text-gray-300'}`}>Register</button>
          </div>
        </div>

        {error && <div className="mb-3 text-sm text-red-400">{error}</div>}

        {m === 'register' && (
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Display name" className="w-full mb-3 px-3 py-2 rounded bg-white/5" />
        )}

        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full mb-3 px-3 py-2 rounded bg-white/5" required />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full mb-4 px-3 py-2 rounded bg-white/5" required />

        <div className="flex items-center justify-between">
          <button disabled={loading} type="submit" className="px-4 py-2 bg-indigo-600 rounded text-white">
            {loading ? 'Working…' : (m === 'signin' ? 'Sign In' : 'Create Account')}
          </button>
          <button type="button" onClick={onClose} className="text-sm text-gray-400">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default SignInModal;
