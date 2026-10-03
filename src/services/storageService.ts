import { Question, ExamSessionResult, ExamSettings, StudentProfile } from '../types/tka';
import { DEFAULT_QUESTIONS, DEFAULT_EXAM_SETTINGS } from '../data/defaultQuestions';

const STORAGE_KEYS = {
  QUESTIONS: 'tka_questions_bank_v1',
  STUDENT_SESSION: 'tka_current_student',
  ADMIN_SESSION: 'tka_admin_logged_in',
  EXAM_HISTORY: 'tka_exam_history_v1',
  SETTINGS: 'tka_settings_v1',
};

export const storageService = {
  // Questions
  getQuestions(): Question[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(DEFAULT_QUESTIONS));
        return DEFAULT_QUESTIONS;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return DEFAULT_QUESTIONS;
    } catch (e) {
      console.error('Failed to load questions from storage:', e);
      return DEFAULT_QUESTIONS;
    }
  },

  saveQuestions(questions: Question[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    } catch (e) {
      console.error('Failed to save questions:', e);
    }
  },

  addQuestion(newQ: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Question {
    const questions = this.getQuestions();
    const created: Question = {
      ...newQ,
      id: 'q-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedList = [created, ...questions];
    this.saveQuestions(updatedList);
    return created;
  },

  updateQuestion(id: string, updates: Partial<Question>): Question | null {
    const questions = this.getQuestions();
    const index = questions.findIndex(q => q.id === id);
    if (index === -1) return null;

    const updated: Question = {
      ...questions[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    questions[index] = updated;
    this.saveQuestions(questions);
    return updated;
  },

  deleteQuestion(id: string): boolean {
    const questions = this.getQuestions();
    const filtered = questions.filter(q => q.id !== id);
    if (filtered.length !== questions.length) {
      this.saveQuestions(filtered);
      return true;
    }
    return false;
  },

  resetQuestionsToDefault(): Question[] {
    this.saveQuestions(DEFAULT_QUESTIONS);
    return DEFAULT_QUESTIONS;
  },

  // Student Session
  getActiveStudent(): StudentProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENT_SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setActiveStudent(student: StudentProfile | null): void {
    if (student) {
      localStorage.setItem(STORAGE_KEYS.STUDENT_SESSION, JSON.stringify(student));
    } else {
      localStorage.removeItem(STORAGE_KEYS.STUDENT_SESSION);
    }
  },

  // Admin Session
  isAdminAuthenticated(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
    } catch {
      return false;
    }
  },

  setAdminAuthenticated(status: boolean): void {
    if (status) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    }
  },

  // Exam History
  getExamHistory(): ExamSessionResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXAM_HISTORY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to load exam history:', e);
      return [];
    }
  },

  saveExamResult(result: ExamSessionResult): void {
    try {
      const history = this.getExamHistory();
      const updated = [result, ...history];
      localStorage.setItem(STORAGE_KEYS.EXAM_HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save exam result:', e);
    }
  },

  deleteExamResult(id: string): void {
    const history = this.getExamHistory();
    const filtered = history.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEYS.EXAM_HISTORY, JSON.stringify(filtered));
  },

  clearAllExamHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.EXAM_HISTORY);
  },

  exportResultsToCSV(): string {
    const history = this.getExamHistory();
    if (history.length === 0) return '';

    const headers = [
      'ID Ujian',
      'Nama Siswa',
      'NISN',
      'Kategori/Subtes',
      'Total Soal',
      'Benar',
      'Salah',
      'Kosong',
      'Skor (0-100)',
      'Skor UTBK (0-1000)',
      'Status Kelulusan',
      'Waktu Mulai',
      'Waktu Selesai',
      'Durasi (Menit)'
    ];

    const rows = history.map(item => [
      `"${item.id}"`,
      `"${item.studentName.replace(/"/g, '""')}"`,
      `"${item.nisn}"`,
      `"${item.testTitle.replace(/"/g, '""')}"`,
      item.totalQuestions,
      item.correctCount,
      item.incorrectCount,
      item.unansweredCount,
      item.scoreScale100.toFixed(1),
      item.scoreUTBKScale,
      item.passed ? 'LULUS' : 'TIDAK LULUS',
      `"${new Date(item.startedAt).toLocaleString('id-ID')}"`,
      `"${new Date(item.completedAt).toLocaleString('id-ID')}"`,
      Math.round(item.timeElapsedSeconds / 60)
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },

  // Settings
  getSettings(): ExamSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return DEFAULT_EXAM_SETTINGS;
      return { ...DEFAULT_EXAM_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_EXAM_SETTINGS;
    }
  },

  saveSettings(settings: ExamSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }
};
