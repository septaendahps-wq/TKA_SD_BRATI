import React from 'react';
import { CATEGORIES } from '../data/defaultQuestions';
import { User, ShieldCheck, CheckCircle2, BookOpen, Clock, Award, ArrowRight, Sparkles } from 'lucide-react';

interface LandingViewProps {
  onOpenLoginModal: (role: 'student' | 'admin') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onOpenLoginModal }) => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-8 sm:p-12 lg:p-16 border border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]"></div>
          
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>Sistem Ujian CBT Terstandar Nasional</span>
              <span>·</span>
              <span>Tahun Ajaran 2026/2027</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Portal Tes Kemampuan Akademik (TKA) Pintar
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Platform asesmen kemampuan akademik interaktif berbasis komputer untuk siswa dan sekolah. Dilengkapi simulasi ujian real-time, evaluasi skor otomatis, serta panel guru pengelola bank soal terintegrasi.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenLoginModal('student')}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2 group cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Masuk Siswa (Nama & NISN)</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onOpenLoginModal('admin')}
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl transition-all border border-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Masuk Guru / Administrator</span>
              </button>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Tanpa Registrasi Rumit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pembahasan Detail Setiap Soal</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Timer Countdown Presisi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of TKA Subtests */}
      <section id="subtes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider block mb-1">
            Materi Uji Terpadu
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Empat Pilar Subtes Asesmen TKA
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Disusun mengacu pada standar seleksi perguruan tinggi negeri dan asesmen nasional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold font-mono text-sm flex items-center justify-center mb-4">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-700">Kode: {cat.shortName}</span>
                <span className="text-slate-400">Pilihan Ganda A-E</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guide Section */}
      <section id="panduan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-700" />
              <span>Panduan Pelaksanaan Ujian Siswa</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                <strong>1. Login Peserta:</strong> Masuk melalui tombol <em>Masuk Siswa</em> dengan mengetikkan Nama Lengkap dan NISN aktif.
              </p>
              <p>
                <strong>2. Memilih Ujian:</strong> Anda dapat mengerjakan <em>Simulasi Lengkap Seluruh Subtes</em> atau memilih latihan per subtes bidang.
              </p>
              <p>
                <strong>3. Sistem CBT:</strong> Jawab soal dengan memilih opsi A, B, C, D, atau E. Anda dapat menandai soal yang belum yakin dengan fitur <em>Ragu-ragu</em>.
              </p>
              <p>
                <strong>4. Evaluasi & Pembahasan:</strong> Segera setelah mengumpulkan ujian, Anda akan menerima rapor skor (skala 100 dan skala UTBK 1000) lengkap dengan kunci jawaban dan pembahasan runut.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
