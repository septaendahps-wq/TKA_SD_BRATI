export type Role = 'guest' | 'student' | 'admin';

export type CategoryId = 
  | 'penalaran-matematika'
  | 'literasi-indonesia'
  | 'literasi-inggris'
  | 'penalaran-umum';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
}

export type DifficultyLevel = 'Mudah' | 'Sedang' | 'Sukar';

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
}

export interface Question {
  id: string;
  categoryId: CategoryId;
  passage?: string; // Teks stimulus / bacaan pendukung
  text: string; // Teks pertanyaan
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string; // Pembahasan detail
  difficulty: DifficultyLevel;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  name: string;
  nisn: string;
  school?: string;
  loginAt: string;
}

export interface StudentAnswer {
  questionId: string;
  selectedOption: 'A' | 'B' | 'C' | 'D' | 'E' | null;
  isDoubtful: boolean;
  timeSpentSeconds?: number;
}

export interface ExamSessionResult {
  id: string;
  studentName: string;
  nisn: string;
  testTitle: string;
  categoryId: CategoryId | 'all';
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  scoreScale100: number;
  scoreUTBKScale: number; // Skala 1000
  passed: boolean;
  passingGrade: number;
  startedAt: string;
  completedAt: string;
  durationMinutes: number;
  timeElapsedSeconds: number;
  categoryBreakdown: {
    [key in CategoryId]?: {
      categoryName: string;
      total: number;
      correct: number;
      score: number;
    };
  };
  answers: Record<string, {
    selected: 'A' | 'B' | 'C' | 'D' | 'E' | null;
    correct: 'A' | 'B' | 'C' | 'D' | 'E';
    isCorrect: boolean;
    isDoubtful: boolean;
  }>;
}

export interface ExamSettings {
  defaultDurationMinutes: number;
  passingGrade: number;
  randomizeQuestions: boolean;
  allowReviewAfterTest: boolean;
  schoolName: string;
}
