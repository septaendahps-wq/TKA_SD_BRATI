import React, { useState, useEffect, useMemo } from 'react';
import { Question, StudentProfile, ExamSessionResult, CategoryId, ExamSettings } from '../types/tka';
import { CATEGORIES } from '../data/defaultQuestions';
import { Clock, AlertTriangle, CheckCircle, Flag, ChevronLeft, ChevronRight, HelpCircle, X } from 'lucide-react';

interface ExamScreenProps {
  questions: Question[];
  student: StudentProfile;
  categoryId: CategoryId | 'all';
  settings: ExamSettings;
  onFinishExam: (result: ExamSessionResult) => void;
  onCancelExam: () => void;
}

export const ExamScreen: React.FC<ExamScreenProps> = ({
  questions,
  student,
  categoryId,
  settings,
  onFinishExam,
  onCancelExam,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | 'E' | null>>({});
  const [markedDoubtful, setMarkedDoubtful] = useState<Record<string, boolean>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Exam timing
  const totalSeconds = settings.defaultDurationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  const [startTime] = useState(Date.now());

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleForceSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentQuestion = questions[currentIndex];

  const categoryName = useMemo(() => {
    if (categoryId === 'all') return 'Simulasi Lengkap Seluruh Subtes TKA';
    const found = CATEGORIES.find((c) => c.id === categoryId);
    return found ? found.name : 'Tes Kemampuan Akademik';
  }, [categoryId]);

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter((val) => val !== null && val !== undefined).length;
  }, [answers]);

  const doubtfulCount = useMemo(() => {
    return Object.values(markedDoubtful).filter(Boolean).length;
  }, [markedDoubtful]);

  const unansweredCount = questions.length - answeredCount;

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: key,
    }));
  };

  const handleToggleDoubtful = () => {
    if (!currentQuestion) return;
    setMarkedDoubtful((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleForceSubmit = () => {
    completeSubmission();
  };

  const completeSubmission = () => {
    const timeElapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    
    // Evaluate answers
    let correctCount = 0;
    const evaluatedAnswers: ExamSessionResult['answers'] = {};
    const categoryStats: ExamSessionResult['categoryBreakdown'] = {};

    questions.forEach((q) => {
      const selected = answers[q.id] || null;
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correctCount++;

      evaluatedAnswers[q.id] = {
        selected,
        correct: q.correctAnswer,
        isCorrect,
        isDoubtful: !!markedDoubtful[q.id],
      };

      // category breakdown
      if (!categoryStats[q.categoryId]) {
        const catInfo = CATEGORIES.find(c => c.id === q.categoryId);
        categoryStats[q.categoryId] = {
          categoryName: catInfo ? catInfo.name : q.categoryId,
          total: 0,
          correct: 0,
          score: 0
        };
      }
      categoryStats[q.categoryId]!.total += 1;
      if (isCorrect) {
        categoryStats[q.categoryId]!.correct += 1;
      }
    });

    // compute scores
    Object.keys(categoryStats).forEach((catId) => {
      const c = categoryStats[catId as CategoryId]!;
      c.score = c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0;
    });

    const scoreScale100 = questions.length > 0 ? Math.round((correctCount / questions.length) * 1000) / 10 : 0;
    
    // Scaled UTBK score: base 200 + (scoreScale100 * 8) => up to 1000
    const scoreUTBKScale = Math.round(200 + (scoreScale100 * 8));
    const passed = scoreScale100 >= settings.passingGrade;

    const result: ExamSessionResult = {
      id: 'exam-' + Date.now(),
      studentName: student.name,
      nisn: student.nisn,
      testTitle: categoryName,
      categoryId,
      totalQuestions: questions.length,
      answeredCount,
      correctCount,
      incorrectCount: answeredCount - correctCount,
      unansweredCount,
      scoreScale100,
      scoreUTBKScale,
      passed,
      passingGrade: settings.passingGrade,
      startedAt: new Date(startTime).toISOString(),
      completedAt: new Date().toISOString(),
      durationMinutes: settings.defaultDurationMinutes,
      timeElapsedSeconds,
      categoryBreakdown: categoryStats,
      answers: evaluatedAnswers,
    };

    onFinishExam(result);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-slate-600 mb-4">Tidak ada soal yang tersedia untuk kategori ini.</p>
          <button
            onClick={onCancelExam}
            className="px-4 py-2 bg-indigo-700 text-white rounded-lg text-sm"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const isCurrentDoubtful = !!markedDoubtful[currentQuestion.id];
  const currentSelectedOption = answers[currentQuestion.id] || null;
  const isTimeCritical = secondsRemaining < 300; // < 5 mins

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col select-none">
      {/* CBT Top Bar */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-3 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setShowExitConfirm(true)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md border border-slate-700 transition-colors shrink-0"
            >
              Keluar
            </button>
            <div className="truncate">
              <h1 className="text-sm font-semibold text-white truncate">
                {categoryName}
              </h1>
              <p className="text-xs text-slate-400 truncate">
                {student.name} · NISN {student.nisn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Timer countdown */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-semibold tabular-nums border ${
                isTimeCritical
                  ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-amber-300'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            {/* Selesai Button */}
            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs"
            >
              Selesai Ujian
            </button>
          </div>
        </div>
      </header>

      {/* Main Examination Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Question Content (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex-1 flex flex-col">
            {/* Question Info Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-slate-900 text-sm">
                  Soal No. {currentIndex + 1}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-600">
                  {CATEGORIES.find((c) => c.id === currentQuestion.categoryId)?.name || currentQuestion.categoryId}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500">Tingkat {currentQuestion.difficulty}</span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>

            {/* Stimulus Passage / Reading Text if available */}
            {currentQuestion.passage && (
              <div className="mb-5 bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs sm:text-sm text-slate-700 leading-relaxed max-h-60 overflow-y-auto">
                <div className="font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
                  Teks Stimulus Bacaan:
                </div>
                <div className="whitespace-pre-line text-slate-800">
                  {currentQuestion.passage}
                </div>
              </div>
            )}

            {/* Question Prompt */}
            <div className="text-base text-slate-900 font-medium leading-relaxed mb-6 whitespace-pre-line">
              {currentQuestion.text}
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option) => {
                const isSelected = currentSelectedOption === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => handleSelectOption(option.key)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3.5 group cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-md font-semibold text-xs flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                      }`}
                    >
                      {option.key}
                    </div>
                    <div className="text-sm text-slate-800 leading-snug pt-0.5 whitespace-pre-line flex-1">
                      {option.text}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action Bar (Prev, Ragu-ragu, Next) */}
            <div className="mt-auto pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <button
                type="button"
                onClick={handleToggleDoubtful}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                  isCurrentDoubtful
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-200'
                }`}
              >
                <Flag
                  className={`w-4 h-4 ${
                    isCurrentDoubtful ? 'text-amber-600 fill-amber-600' : 'text-slate-400'
                  }`}
                />
                <span>{isCurrentDoubtful ? 'Tandai Ragu (Aktif)' : 'Ragu-ragu'}</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Selesai & Kumpulkan</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Question Navigator Grid (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Nomor Soal</span>
              <span className="text-xs text-slate-500 font-normal">
                {answeredCount}/{questions.length} Selesai
              </span>
            </h2>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 pb-3 mb-3 border-b border-slate-100 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500 inline-block"></span>
                <span>Dijawab ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-amber-400 inline-block"></span>
                <span>Ragu ({doubtfulCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300 inline-block"></span>
                <span>Kosong ({unansweredCount})</span>
              </div>
            </div>

            {/* Grid of question buttons */}
            <div className="grid grid-cols-5 gap-2 max-h-[360px] overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const hasAnswer = answers[q.id] !== null && answers[q.id] !== undefined;
                const isDoubt = !!markedDoubtful[q.id];

                let bgClass = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50';
                if (isDoubt) {
                  bgClass = 'bg-amber-400 border-amber-500 text-amber-950 font-bold';
                } else if (hasAnswer) {
                  bgClass = 'bg-emerald-600 border-emerald-600 text-white font-medium';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-lg text-xs font-semibold flex items-center justify-center border transition-all relative ${bgClass} ${
                      isCurrent ? 'ring-2 ring-indigo-600 ring-offset-2' : ''
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {hasAnswer && (
                      <span className="text-[10px] absolute bottom-0.5 right-1 opacity-80">
                        {answers[q.id]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowConfirmModal(true)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Kumpulkan Lembar Jawaban</span>
              </button>
            </div>
          </div>

          {/* Quick Exam Tips */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-1.5">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Petunjuk Pengerjaan:</span>
            </div>
            <p>· Jawaban Anda otomatis tersimpan saat memilih opsi.</p>
            <p>· Gunakan tanda <strong>Ragu-ragu</strong> untuk soal yang ingin Anda tinjau kembali.</p>
            <p>· Waktu akan otomatis menutup ujian jika durasi habis.</p>
          </div>
        </div>
      </main>

      {/* Confirmation Modal Before Final Submit */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Konfirmasi Selesai Ujian
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Apakah Anda yakin ingin mengakhiri sesi pengerjaan ujian ini? Lembar jawaban Anda akan langsung dinilai.
            </p>

            {/* Status alerts */}
            <div className="space-y-2 mb-6">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600">Total Soal Ujian:</span>
                <span className="font-bold text-slate-900">{questions.length}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600">Sudah Terjawab:</span>
                <span className="font-bold text-emerald-700">{answeredCount} Soal</span>
              </div>
              {unansweredCount > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-800">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>
                    Perhatian: Masih terdapat <strong>{unansweredCount} soal yang belum dijawab</strong>!
                  </span>
                </div>
              )}
              {doubtfulCount > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-800">
                  <Flag className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    Anda masih memiliki <strong>{doubtfulCount} soal bertanda ragu-ragu</strong>.
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
              >
                Kembali Periksa
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  completeSubmission();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                Ya, Selesai Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit confirmation modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900">Batalkan Sesi Ujian?</h3>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-5">
              Jika Anda keluar sekarang, pengerjaan saat ini tidak akan disimpan ke riwayat nilai Anda.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold"
              >
                Lanjutkan Ujian
              </button>
              <button
                onClick={onCancelExam}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
              >
                Keluar Ujian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
