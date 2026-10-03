import React, { useState, useEffect } from 'react';
import { Role, StudentProfile, Question, ExamSessionResult, ExamSettings, CategoryId } from './types/tka';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { LandingView } from './components/LandingView';
import { StudentDashboard } from './components/StudentDashboard';
import { ExamScreen } from './components/ExamScreen';
import { ExamResultView } from './components/ExamResultView';
import { AdminDashboard } from './components/AdminDashboard';
import { BookOpen, CheckCircle2, Award, Clock } from 'lucide-react';

export default function App() {
  // App state
  const [role, setRole] = useState<Role>('guest');
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examHistory, setExamHistory] = useState<ExamSessionResult[]>([]);
  const [settings, setSettings] = useState<ExamSettings>(storageService.getSettings());

  // Navigation state
  const [currentView, setCurrentView] = useState<
    'landing' | 'dashboard' | 'exam' | 'result' | 'history' | 'guide' | 'admin'
  >('landing');
  const [activeNavTab, setActiveNavTab] = useState<string>('dashboard');
  const [adminSubTab, setAdminSubTab] = useState<string>('questions');

  // Exam in-progress state
  const [activeExamCategory, setActiveExamCategory] = useState<CategoryId | 'all'>('all');
  const [activeExamQuestions, setActiveExamQuestions] = useState<Question[]>([]);
  const [currentExamResult, setCurrentExamResult] = useState<ExamSessionResult | null>(null);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'student' | 'admin'>('student');

  // Load initial data from localStorage
  useEffect(() => {
    const loadedQuestions = storageService.getQuestions();
    setQuestions(loadedQuestions);

    const loadedHistory = storageService.getExamHistory();
    setExamHistory(loadedHistory);

    const loadedSettings = storageService.getSettings();
    setSettings(loadedSettings);

    const savedStudent = storageService.getActiveStudent();
    const isAdmin = storageService.isAdminAuthenticated();

    if (isAdmin) {
      setRole('admin');
      setCurrentView('admin');
      setActiveNavTab('questions');
    } else if (savedStudent) {
      setStudent(savedStudent);
      setRole('student');
      setCurrentView('dashboard');
      setActiveNavTab('dashboard');
    } else {
      setRole('guest');
      setCurrentView('landing');
    }
  }, []);

  // Login Handlers
  const handleStudentLogin = (newStudent: StudentProfile) => {
    storageService.setActiveStudent(newStudent);
    storageService.setAdminAuthenticated(false);
    setStudent(newStudent);
    setRole('student');
    setCurrentView('dashboard');
    setActiveNavTab('dashboard');
  };

  const handleAdminLogin = () => {
    storageService.setAdminAuthenticated(true);
    storageService.setActiveStudent(null);
    setStudent(null);
    setRole('admin');
    setCurrentView('admin');
    setActiveNavTab('questions');
    setAdminSubTab('questions');
  };

  const handleLogout = () => {
    storageService.setActiveStudent(null);
    storageService.setAdminAuthenticated(false);
    setStudent(null);
    setRole('guest');
    setCurrentView('landing');
    setActiveNavTab('dashboard');
  };

  const handleOpenAuthModal = (modalRole: 'student' | 'admin') => {
    setAuthModalTab(modalRole);
    setIsAuthModalOpen(true);
  };

  // Exam Handlers
  const handleStartExam = (catId: CategoryId | 'all') => {
    setActiveExamCategory(catId);

    let filtered = questions;
    if (catId !== 'all') {
      filtered = questions.filter((q) => q.categoryId === catId);
    }

    if (filtered.length === 0) {
      alert('Maaf, belum ada butir soal yang tersedia untuk subtes ini.');
      return;
    }

    // Shuffle if configured
    let examQs = [...filtered];
    if (settings.randomizeQuestions) {
      examQs = examQs.sort(() => Math.random() - 0.5);
    }

    setActiveExamQuestions(examQs);
    setCurrentView('exam');
  };

  const handleFinishExam = (result: ExamSessionResult) => {
    storageService.saveExamResult(result);
    setExamHistory(storageService.getExamHistory());
    setCurrentExamResult(result);
    setCurrentView('result');
  };

  const handleCancelExam = () => {
    setCurrentView(role === 'student' ? 'dashboard' : 'landing');
  };

  const handleViewResultDetail = (result: ExamSessionResult) => {
    setCurrentExamResult(result);
    setCurrentView('result');
  };

  // Question bank operations by admin
  const handleAddQuestion = (qData: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    storageService.addQuestion(qData);
    setQuestions(storageService.getQuestions());
  };

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
    storageService.updateQuestion(id, updates);
    setQuestions(storageService.getQuestions());
  };

  const handleDeleteQuestion = (id: string) => {
    storageService.deleteQuestion(id);
    setQuestions(storageService.getQuestions());
  };

  const handleResetQuestions = () => {
    if (window.confirm('Kembalikan bank soal ke soal contoh standar nasional?')) {
      const resetList = storageService.resetQuestionsToDefault();
      setQuestions(resetList);
    }
  };

  // Settings & History Operations
  const handleSaveSettings = (newSettings: ExamSettings) => {
    storageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleDeleteExamHistory = (id: string) => {
    storageService.deleteExamResult(id);
    setExamHistory(storageService.getExamHistory());
  };

  const handleClearAllExamHistory = () => {
    storageService.clearAllExamHistory();
    setExamHistory([]);
  };

  // Tab navigation from header
  const handleSelectTab = (tab: string) => {
    setActiveNavTab(tab);
    if (role === 'admin') {
      setCurrentView('admin');
      setAdminSubTab(tab);
    } else if (role === 'student') {
      if (tab === 'dashboard') setCurrentView('dashboard');
      if (tab === 'history') setCurrentView('history');
      if (tab === 'guide') setCurrentView('guide');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Don't show top header when actively taking CBT exam */}
      {currentView !== 'exam' && (
        <Header
          currentRole={role}
          student={student}
          activeTab={activeNavTab}
          onSelectTab={handleSelectTab}
          onOpenLoginModal={handleOpenAuthModal}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content Areas */}
      <div className="flex-1 flex flex-col">
        {/* VIEW 1: GUEST LANDING */}
        {currentView === 'landing' && (
          <LandingView onOpenLoginModal={handleOpenAuthModal} />
        )}

        {/* VIEW 2: STUDENT DASHBOARD */}
        {currentView === 'dashboard' && student && (
          <StudentDashboard
            student={student}
            questions={questions}
            examHistory={examHistory}
            onStartExam={handleStartExam}
            onViewResultDetail={handleViewResultDetail}
          />
        )}

        {/* VIEW 3: STUDENT HISTORY & RAPOR TAB */}
        {currentView === 'history' && student && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <StudentDashboard
              student={student}
              questions={questions}
              examHistory={examHistory}
              onStartExam={handleStartExam}
              onViewResultDetail={handleViewResultDetail}
            />
          </div>
        )}

        {/* VIEW 4: PANDUAN & SILABUS TAB */}
        {currentView === 'guide' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Panduan & Silabus Ujian Tes Kemampuan Akademik (TKA)
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Standar kompetensi dan kisi-kisi penilaian asesmen akademik nasional.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h2 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1. Penalaran Matematika (PM)</span>
                  </h2>
                  <p>
                    Menguji kemampuan dalam merumuskan, menggunakan, dan menafsirkan permasalahan matematika dalam berbagai konteks kehidupan nyata, termasuk aljabar, kalkulus dasar, fungsi, geometri, peluang, dan statistika deskriptif.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h2 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>2. Literasi Bahasa Indonesia (LBI)</span>
                  </h2>
                  <p>
                    Menguji kemampuan memahami, merefleksikan, dan mengevaluasi teks bacaan informatif maupun sastra; menarik simpulan logis, menemukan ide pokok, serta menganalisis efektivitas kalimat baku.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h2 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>3. Literasi Bahasa Inggris (LBE)</span>
                  </h2>
                  <p>
                    Mengukur kompetensi membaca teks akademik berbahasa Inggris, menentukan makna kosakata dalam konteks (vocabulary in context), mengidentifikasi nada penulis (author's tone), dan menarik simpulan inferensial.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h2 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>4. Penalaran Umum & Skolastik (PU)</span>
                  </h2>
                  <p>
                    Menilai kemampuan bernalar secara induktif, deduktif, silogisme logika, deret angka, serta analisis kuantitatif sederhana tanpa rumus rumit.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    if (role === 'student') setCurrentView('dashboard');
                    else handleOpenAuthModal('student');
                  }}
                  className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-medium text-xs rounded-lg transition-colors shadow-xs"
                >
                  {role === 'student' ? 'Kembali ke Dashboard Siswa' : 'Mulai Latihan Sekarang'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: CBT EXAM SCREEN */}
        {currentView === 'exam' && student && (
          <ExamScreen
            questions={activeExamQuestions}
            student={student}
            categoryId={activeExamCategory}
            settings={settings}
            onFinishExam={handleFinishExam}
            onCancelExam={handleCancelExam}
          />
        )}

        {/* VIEW 6: EXAM RESULT & PEMBAHASAN */}
        {currentView === 'result' && currentExamResult && (
          <ExamResultView
            result={currentExamResult}
            questions={questions.filter((q) =>
              activeExamCategory === 'all' ? true : q.categoryId === activeExamCategory
            )}
            onBackToDashboard={() => setCurrentView(role === 'student' ? 'dashboard' : 'admin')}
            onRetakeExam={() => handleStartExam(activeExamCategory)}
          />
        )}

        {/* VIEW 7: ADMIN DASHBOARD */}
        {currentView === 'admin' && role === 'admin' && (
          <AdminDashboard
            questions={questions}
            examHistory={examHistory}
            settings={settings}
            activeSubTab={adminSubTab}
            onSelectSubTab={(tab) => setAdminSubTab(tab)}
            onAddQuestion={handleAddQuestion}
            onUpdateQuestion={handleUpdateQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onResetQuestions={handleResetQuestions}
            onSaveSettings={handleSaveSettings}
            onDeleteExamHistory={handleDeleteExamHistory}
            onClearAllExamHistory={handleClearAllExamHistory}
          />
        )}
      </div>

      {/* Footer */}
      {currentView !== 'exam' && (
        <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © 2026 Portal TKA Smart · Sistem Ujian Tes Kemampuan Akademik Mandiri
            </div>
            <div className="flex items-center gap-4">
              <span>Durasi Standar: {settings.defaultDurationMinutes} Menit</span>
              <span>·</span>
              <span>Passing Grade: {settings.passingGrade}</span>
              <span>·</span>
              <button
                onClick={() => handleOpenAuthModal(role === 'admin' ? 'student' : 'admin')}
                className="hover:text-indigo-700 transition-colors underline underline-offset-2"
              >
                {role === 'admin' ? 'Ganti ke Masuk Siswa' : 'Masuk Panel Guru (Admin)'}
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialRoleTab={authModalTab}
        onClose={() => setIsAuthModalOpen(false)}
        onStudentLogin={handleStudentLogin}
        onAdminLogin={handleAdminLogin}
      />
    </div>
  );
}
