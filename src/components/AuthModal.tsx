import React, { useState } from 'react';
import { User, ShieldCheck, X, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { StudentProfile } from '../types/tka';

interface AuthModalProps {
  isOpen: boolean;
  initialRoleTab?: 'student' | 'admin';
  onClose: () => void;
  onStudentLogin: (student: StudentProfile) => void;
  onAdminLogin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialRoleTab = 'student',
  onClose,
  onStudentLogin,
  onAdminLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>(initialRoleTab);

  // Student Form State
  const [studentName, setStudentName] = useState('');
  const [studentNisn, setStudentNisn] = useState('');
  const [studentSchool, setStudentSchool] = useState('');
  const [studentError, setStudentError] = useState('');

  // Admin Form State
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  if (!isOpen) return null;

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError('');

    const trimmedName = studentName.trim();
    const trimmedNisn = studentNisn.trim();

    if (!trimmedName) {
      setStudentError('Nama lengkap siswa wajib diisi.');
      return;
    }

    if (!trimmedNisn) {
      setStudentError('Nomor Induk Siswa Nasional (NISN) wajib diisi.');
      return;
    }

    if (!/^\d{8,12}$/.test(trimmedNisn)) {
      setStudentError('NISN harus berupa angka (8-12 digit).');
      return;
    }

    const newStudent: StudentProfile = {
      name: trimmedName,
      nisn: trimmedNisn,
      school: studentSchool.trim() || 'SMA Negeri Terpadu',
      loginAt: new Date().toISOString()
    };

    onStudentLogin(newStudent);
    onClose();
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    const trimmedUser = adminUsername.trim();
    const trimmedPass = adminPassword.trim();

    // Exact credentials specified in prompt: username administrator, password 123456789
    if (trimmedUser === 'administrator' && trimmedPass === '123456789') {
      onAdminLogin();
      onClose();
    } else {
      setAdminError('Username atau password administrator tidak cocok. (Gunakan: administrator / 123456789)');
    }
  };

  const fillDemoStudent = (name: string, nisn: string, school: string) => {
    setStudentName(name);
    setStudentNisn(nisn);
    setStudentSchool(school);
    setStudentError('');
  };

  const fillDemoAdmin = () => {
    setAdminUsername('administrator');
    setAdminPassword('123456789');
    setAdminError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header modal */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Masuk Portal TKA
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sistem Asesmen Tes Kemampuan Akademik Berbasis Web
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setActiveTab('student');
                setStudentError('');
              }}
              className={`py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'student'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Siswa Peserta</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setAdminError('');
              }}
              className={`py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Guru / Admin</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {activeTab === 'student' ? (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-900 flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p>
                  Masukkan <strong>Nama Lengkap</strong> dan <strong>NISN</strong> Anda untuk memulai pengerjaan latihan & ujian TKA.
                </p>
              </div>

              {studentError && (
                <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{studentError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Fauzan Al-Ghifari"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  NISN (Nomor Induk Siswa Nasional) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={12}
                  placeholder="Contoh: 0064512987"
                  value={studentNisn}
                  onChange={(e) => setStudentNisn(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white text-slate-900 placeholder:text-slate-400"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Format 10 digit numerik sesuai kartu pelajar atau Dapodik
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Asal Sekolah (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SMA Negeri 1 Indonesia"
                  value={studentSchool}
                  onChange={(e) => setStudentSchool(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Demo Quickfill */}
              <div className="pt-1">
                <span className="text-[11px] text-slate-500 font-medium block mb-1.5">
                  Uji coba cepat dengan akun contoh:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => fillDemoStudent('Aditya Pratama', '0067829104', 'SMA Unggulan Bangsa')}
                    className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                  >
                    Aditya (0067829104)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoStudent('Nabila Putri Azzahra', '0071239845', 'SMAN 3 Merdeka')}
                    className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                  >
                    Nabila (0071239845)
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-indigo-700 hover:bg-indigo-800 text-white font-medium rounded-lg text-sm transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Masuk Dashboard Siswa</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-950 mb-0.5">Kredensial Khusus Guru / Administrator:</p>
                  <p className="font-mono text-[11px]">
                    Username: <span className="font-bold text-slate-900">administrator</span> | Password: <span className="font-bold text-slate-900">123456789</span>
                  </p>
                </div>
              </div>

              {adminError && (
                <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{adminError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Username Guru / Administrator
                </label>
                <input
                  type="text"
                  required
                  placeholder="administrator"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white text-slate-900 placeholder:text-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Password Administrator
                </label>
                <input
                  type="password"
                  required
                  placeholder="•••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Demo button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={fillDemoAdmin}
                  className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Isi otomatis kredensial guru</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-sm transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Masuk Panel Pengelola Guru</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
