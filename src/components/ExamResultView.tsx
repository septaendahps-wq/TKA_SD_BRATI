import React, { useState } from 'react';
import { ExamSessionResult, Question } from '../types/tka';
import { CATEGORIES } from '../data/defaultQuestions';
import { CheckCircle2, XCircle, AlertCircle, ArrowLeft, Printer, RefreshCw, BookOpen, Award, Check, X } from 'lucide-react';

interface ExamResultViewProps {
  result: ExamSessionResult;
  questions: Question[];
  onBackToDashboard: () => void;
  onRetakeExam: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  result,
  questions,
  onBackToDashboard,
  onRetakeExam,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'wrong' | 'correct' | 'doubtful'>('all');

  const filteredQuestions = questions.filter((q) => {
    const ans = result.answers[q.id];
    if (filterMode === 'correct') return ans?.isCorrect;
    if (filterMode === 'wrong') return !ans?.isCorrect;
    if (filterMode === 'doubtful') return ans?.isDoubtful;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  const minutesTaken = Math.floor(result.timeElapsedSeconds / 60);
  const secondsTaken = result.timeElapsedSeconds % 60;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Hasil Ujian</span>
          </button>
          <button
            onClick={onRetakeExam}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Latihan Ulang</span>
          </button>
        </div>
      </div>

      {/* Main Result Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
                <Award className="w-4 h-4" />
                <span>Rapor Evaluasi Tes Kemampuan Akademik (TKA)</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
                {result.testTitle}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 font-mono">
                <span>Nama: <strong className="text-white font-sans">{result.studentName}</strong></span>
                <span>·</span>
                <span>NISN: <strong className="text-white">{result.nisn}</strong></span>
                <span>·</span>
                <span>Waktu Pengerjaan: {minutesTaken}m {secondsTaken}d</span>
              </div>
            </div>

            {/* Score Highlight Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center shrink-0 min-w-[200px]">
              <span className="text-[11px] uppercase tracking-wider text-indigo-200 font-medium block">
                Skor Nilai Akhir
              </span>
              <div className="text-4xl font-extrabold text-white my-1 tabular-nums">
                {result.scoreScale100.toFixed(1)}
              </div>
              <div className="text-xs text-indigo-200">
                Konversi Standar: <span className="font-bold text-white tabular-nums">{result.scoreUTBKScale}</span> / 1000
              </div>
              <div className="mt-2 pt-2 border-t border-white/10 text-xs">
                {result.passed ? (
                  <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Lulus Ambang Batas (KKM {result.passingGrade})</span>
                  </span>
                ) : (
                  <span className="text-rose-300 font-semibold flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Perlu Remedial / Latihan Lagi</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 border-b border-slate-200 bg-slate-50/50">
          <div className="p-4 text-center">
            <span className="text-xs text-slate-500 block mb-1">Total Soal</span>
            <span className="text-xl font-bold text-slate-900 tabular-nums">{result.totalQuestions}</span>
          </div>
          <div className="p-4 text-center">
            <span className="text-xs text-emerald-600 block mb-1">Jawaban Benar</span>
            <span className="text-xl font-bold text-emerald-700 tabular-nums">{result.correctCount}</span>
          </div>
          <div className="p-4 text-center">
            <span className="text-xs text-rose-600 block mb-1">Jawaban Salah</span>
            <span className="text-xl font-bold text-rose-700 tabular-nums">{result.incorrectCount}</span>
          </div>
          <div className="p-4 text-center">
            <span className="text-xs text-slate-500 block mb-1">Tidak Dijawab</span>
            <span className="text-xl font-bold text-slate-700 tabular-nums">{result.unansweredCount}</span>
          </div>
        </div>

        {/* Subtest Category Breakdown */}
        {result.categoryBreakdown && Object.keys(result.categoryBreakdown).length > 0 && (
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-900 mb-4">
              Analisis Perolehan Nilai per Subtes
            </h2>
            <div className="space-y-3">
              {Object.entries(result.categoryBreakdown).map(([catId, stats]) => {
                if (!stats) return null;
                const percentage = Math.round((stats.correct / stats.total) * 100);
                return (
                  <div key={catId} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-800">{stats.categoryName}</span>
                      <span className="font-mono text-slate-600 tabular-nums">
                        {stats.correct} / {stats.total} Benar ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          percentage >= 70
                            ? 'bg-emerald-600'
                            : percentage >= 50
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Review Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-700" />
              <span>Pembahasan & Kunci Jawaban Soal</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pelajari langkah penyelesaian dan analisis setiap butir soal untuk memperdalam pemahaman materi.
            </p>
          </div>

          {/* Review Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs print:hidden">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({questions.length})
            </button>
            <button
              onClick={() => setFilterMode('wrong')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                filterMode === 'wrong'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              Salah ({result.incorrectCount + result.unansweredCount})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                filterMode === 'correct'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Benar ({result.correctCount})
            </button>
          </div>
        </div>

        {/* Questions Review List */}
        <div className="space-y-6">
          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
              Tidak ada soal pada kategori filter ini.
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const ansInfo = result.answers[q.id];
              const isCorrect = ansInfo?.isCorrect;
              const studentChoice = ansInfo?.selected;
              const realIndex = questions.findIndex((item) => item.id === q.id);

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-xl border p-6 shadow-xs transition-all ${
                    isCorrect
                      ? 'border-emerald-200/90'
                      : studentChoice === null
                      ? 'border-slate-200'
                      : 'border-rose-200'
                  }`}
                >
                  {/* Status header */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        Nomor {realIndex + 1}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500">
                        {CATEGORIES.find((c) => c.id === q.categoryId)?.name || q.categoryId}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          <Check className="w-3.5 h-3.5" />
                          <span>Jawaban Benar</span>
                        </span>
                      ) : studentChoice === null ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                          <span>Tidak Dijawab</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                          <X className="w-3.5 h-3.5" />
                          <span>Jawaban Salah</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stimulus if any */}
                  {q.passage && (
                    <div className="mb-4 bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                      <span className="font-semibold text-slate-900 block mb-1">
                        Wacana / Stimulus:
                      </span>
                      {q.passage}
                    </div>
                  )}

                  {/* Question prompt */}
                  <div className="text-sm font-medium text-slate-900 mb-4 whitespace-pre-line leading-relaxed">
                    {q.text}
                  </div>

                  {/* Options List */}
                  <div className="space-y-2 mb-4">
                    {q.options.map((opt) => {
                      const isOptionCorrect = opt.key === q.correctAnswer;
                      const isOptionChosen = studentChoice === opt.key;

                      let rowClass = 'bg-white border-slate-200 text-slate-700';
                      if (isOptionCorrect) {
                        rowClass = 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium';
                      } else if (isOptionChosen && !isCorrect) {
                        rowClass = 'bg-rose-50 border-rose-300 text-rose-950 font-medium';
                      }

                      return (
                        <div
                          key={opt.key}
                          className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start gap-3 transition-colors ${rowClass}`}
                        >
                          <div
                            className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0 ${
                              isOptionCorrect
                                ? 'bg-emerald-600 text-white'
                                : isOptionChosen && !isCorrect
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {opt.key}
                          </div>
                          <div className="flex-1 pt-0.5 leading-snug">{opt.text}</div>
                          {isOptionCorrect && (
                            <span className="text-xs font-semibold text-emerald-700 shrink-0 self-center">
                              Kunci Jawaban
                            </span>
                          )}
                          {isOptionChosen && !isOptionCorrect && (
                            <span className="text-xs font-semibold text-rose-700 shrink-0 self-center">
                              Jawaban Anda
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Pembahasan Detail */}
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 text-xs sm:text-sm text-slate-800">
                    <div className="font-bold text-indigo-950 mb-1 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-700" />
                      <span>Pembahasan & Solusi:</span>
                    </div>
                    <div className="whitespace-pre-line text-slate-700 leading-relaxed font-sans">
                      {q.explanation}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
