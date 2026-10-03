import React from 'react';
import { Role, StudentProfile } from '../types/tka';
import { LogOut, User, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentRole: Role;
  student: StudentProfile | null;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenLoginModal: (role: 'student' | 'admin') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  student,
  activeTab,
  onSelectTab,
  onOpenLoginModal,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab(currentRole === 'admin' ? 'questions' : 'dashboard')}
            className="text-left group flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              TKA
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-700 transition-colors">
              Portal TKA Smart
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {currentRole === 'student' && (
            <>
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`py-1 text-sm font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'text-indigo-700 border-b-2 border-indigo-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard Siswa
              </button>
              <button
                onClick={() => onSelectTab('history')}
                className={`py-1 text-sm font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'text-indigo-700 border-b-2 border-indigo-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Riwayat & Skor
              </button>
              <button
                onClick={() => onSelectTab('guide')}
                className={`py-1 text-sm font-medium transition-colors ${
                  activeTab === 'guide'
                    ? 'text-indigo-700 border-b-2 border-indigo-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Panduan & Silabus
              </button>
            </>
          )}

          {currentRole === 'admin' && (
            <>
              <button
                onClick={() => onSelectTab('questions')}
                className={`py-1 text-sm font-medium transition-colors ${
                  activeTab === 'questions'
                    ? 'text-indigo-700 border-b-2 border-indigo-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kelola Bank Soal
              </button>
              <button
                onClick={() => onSelectTab('student-results')}
                className={`py-1 text-sm font-medium transition-colors ${
                  activeTab === 'student-results'
                    ? 'text-indigo-700 border-b-2 border-indigo-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rekap Nilai Siswa
              </button>
              <button
                onClick={() => onSelectTab('settings')}
                className={`py-1 text-sm font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'text-indigo-700 border-b-2 border-indigo-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pengaturan Ujian
              </button>
            </>
          )}

          {currentRole === 'guest' && (
            <>
              <a href="#tentang" className="hover:text-slate-900 transition-colors">
                Tentang TKA
              </a>
              <a href="#subtes" className="hover:text-slate-900 transition-colors">
                Mata Uji Subtes
              </a>
              <a href="#panduan" className="hover:text-slate-900 transition-colors">
                Tata Cara Ujian
              </a>
            </>
          )}
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-3">
          {currentRole === 'student' && student && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-900 truncate max-w-[180px]">
                  {student.name}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  NISN {student.nisn}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Keluar dari akun siswa"
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          )}

          {currentRole === 'admin' && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Panel Guru (Administrator)</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
                title="Keluar dari panel guru"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          )}

          {currentRole === 'guest' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenLoginModal('admin')}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Masuk Guru
              </button>
              <button
                onClick={() => onOpenLoginModal('student')}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>Masuk Siswa</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
