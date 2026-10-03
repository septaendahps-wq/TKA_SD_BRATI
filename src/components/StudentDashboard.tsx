import React, { useMemo } from 'react';
import { StudentProfile, Question, ExamSessionResult, CategoryId } from '../types/tka';
import { CATEGORIES } from '../data/defaultQuestions';
import { Play, BookOpen, Clock, Award, CheckCircle, TrendingUp, ArrowRight, BarChart3 } from 'lucide-react';

interface StudentDashboardProps {
  student: StudentProfile;
  questions: Question[];
  examHistory: ExamSessionResult[];
  onStartExam: (categoryId: CategoryId | 'all') => void;
  onViewResultDetail: (result: ExamSessionResult) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  questions,
  examHistory,
  onStartExam,
  onViewResultDetail,
}) => {
  // Filter history for current student
  const studentHistory = useMemo(() => {
    return examHistory.filter(
      (h) => h.nisn === student.nisn || h.studentName.toLowerCase() === student.name.toLowerCase()
    );
  }, [examHistory, student]);

  // Performance stats
  const stats = useMemo(() => {
    if (studentHistory.length === 0) {
      return { total: 0, avgScore: 0, highestScore: 0, passRate: 0 };
    }
    const total = studentHistory.length;
    const sumScore = studentHistory.reduce((acc, curr) => acc + curr.scoreScale100, 0);
    const avgScore = Math.round((sumScore / total) * 10) / 10;
    const highestScore = Math.max(...studentHistory.map((h) => h.scoreScale100));
    const passedCount = studentHistory.filter((h) => h.passed).length;
    const passRate = Math.round((passedCount / total) * 100);

    return { total, avgScore, highestScore, passRate };
  }, [studentHistory]);

  // Questions count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    questions.forEach((q) => {
      counts[q.categoryId] = (counts[q.categoryId] || 0) + 1;
    });
    return counts;
  }, [questions]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Sesi Aktif Siswa</span>
              <span>·</span>
              <span>{student.school || 'SMA/MA'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {student.name}
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Persiapkan diri Anda menghadapi Tes Kemampuan Akademik (TKA) dengan latihan soal berstandar nasional, analisis kelemahan, dan pembahasan komprehensif.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-indigo-200">
              <span>NISN: {student.nisn}</span>
              <span>·</span>
              <span>Total Bank Soal: {questions.length} Butir</span>
            </div>
          </div>

          {/* Quick CTA to Full Exam */}
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onStartExam('all')}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white transition-transform group-hover:scale-110" />
              <span>Simulasi Ujian Lengkap (Semua Subtes)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Ujian Dikerjakan</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {stats.total} <span className="text-xs font-normal text-slate-400">kali</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {stats.total > 0 ? 'Tercatat di sistem' : 'Belum ada pengerjaan'}
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Rata-rata Skor</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {stats.avgScore.toFixed(1)} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Skala standar kelulusan
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Skor Tertinggi</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {stats.highestScore.toFixed(1)} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Pencapaian terbaik
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Tingkat Ketuntasan</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {stats.passRate}%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Mencapai KKM (≥ 70)
          </span>
        </div>
      </div>

      {/* Subtests Selection Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Pilihan Subtes Ujian TKA
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih subtes spesifik untuk melatih pemahaman per bidang atau ambil simulasi penuh.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            return (
              <div
                key={cat.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {cat.shortName}
                    </span>
                    <span className="text-xs text-slate-500">
                      {count} Butir Soal Tersedia
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Durasi estimasi: ~{Math.max(10, count * 2)} Menit
                  </span>
                  <button
                    onClick={() => onStartExam(cat.id)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>Kerjakan Subtes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam History Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-700" />
              <span>Riwayat Hasil Ujian Anda</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar skor dan evaluasi ujian yang telah Anda selesaikan.
            </p>
          </div>
        </div>

        {studentHistory.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800">
              Belum Ada Riwayat Ujian
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
              Anda belum mengerjakan latihan atau simulasi ujian. Klik tombol di bawah untuk memulai latihan pertama Anda.
            </p>
            <button
              onClick={() => onStartExam('all')}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-medium text-xs rounded-lg transition-colors inline-flex items-center gap-2 shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Mulai Ujian Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-3 px-4">Nama Ujian / Subtes</th>
                    <th className="py-3 px-4">Tanggal & Waktu</th>
                    <th className="py-3 px-4 text-center">Benar / Total</th>
                    <th className="py-3 px-4 text-center">Skor (100)</th>
                    <th className="py-3 px-4 text-center">Skor UTBK (1000)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentHistory.map((item) => {
                    const dateFormatted = new Date(item.completedAt).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {item.testTitle}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono">
                          {dateFormatted}
                        </td>
                        <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-700">
                          {item.correctCount} / {item.totalQuestions}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-900 font-mono tabular-nums text-sm">
                          {item.scoreScale100.toFixed(1)}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-indigo-700 font-mono tabular-nums text-sm">
                          {item.scoreUTBKScale}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.passed ? (
                            <span className="inline-flex items-center text-emerald-700 font-semibold">
                              Lulus
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-rose-600 font-semibold">
                              Remedial
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onViewResultDetail(item)}
                            className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium rounded-md transition-colors"
                          >
                            Lihat Pembahasan
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
