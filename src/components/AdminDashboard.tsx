import React, { useState, useMemo } from 'react';
import { Question, ExamSessionResult, ExamSettings, CategoryId, DifficultyLevel } from '../types/tka';
import { CATEGORIES } from '../data/defaultQuestions';
import { 
  Plus, Edit3, Trash2, Copy, Search, Filter, RotateCcw, 
  Download, Eye, CheckCircle2, XCircle, Settings, 
  HelpCircle, BookOpen, Users, Sliders, Check, X, AlertTriangle
} from 'lucide-react';

interface AdminDashboardProps {
  questions: Question[];
  examHistory: ExamSessionResult[];
  settings: ExamSettings;
  activeSubTab: string;
  onSelectSubTab: (tab: string) => void;
  onAddQuestion: (q: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateQuestion: (id: string, q: Partial<Question>) => void;
  onDeleteQuestion: (id: string) => void;
  onResetQuestions: () => void;
  onSaveSettings: (settings: ExamSettings) => void;
  onDeleteExamHistory: (id: string) => void;
  onClearAllExamHistory: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  questions,
  examHistory,
  settings,
  activeSubTab,
  onSelectSubTab,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onResetQuestions,
  onSaveSettings,
  onDeleteExamHistory,
  onClearAllExamHistory,
}) => {
  // Questions filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Question Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Form Fields
  const [formCategory, setFormCategory] = useState<CategoryId>('penalaran-matematika');
  const [formDifficulty, setFormDifficulty] = useState<DifficultyLevel>('Sedang');
  const [formPassage, setFormPassage] = useState('');
  const [formText, setFormText] = useState('');
  const [formOptions, setFormOptions] = useState<Record<'A' | 'B' | 'C' | 'D' | 'E', string>>({
    A: '',
    B: '',
    C: '',
    D: '',
    E: '',
  });
  const [formCorrectAnswer, setFormCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [formExplanation, setFormExplanation] = useState('');
  const [formError, setFormError] = useState('');

  // Student Detail Modal state
  const [inspectResult, setInspectResult] = useState<ExamSessionResult | null>(null);

  // Settings form state
  const [localSettings, setLocalSettings] = useState<ExamSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchCat = selectedCategory === 'all' || q.categoryId === selectedCategory;
      const matchDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      const qLower = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        q.text.toLowerCase().includes(qLower) ||
        (q.passage && q.passage.toLowerCase().includes(qLower)) ||
        q.explanation.toLowerCase().includes(qLower);

      return matchCat && matchDiff && matchSearch;
    });
  }, [questions, selectedCategory, selectedDifficulty, searchQuery]);

  // Handle open modal for new question
  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setFormCategory('penalaran-matematika');
    setFormDifficulty('Sedang');
    setFormPassage('');
    setFormText('');
    setFormOptions({ A: '', B: '', C: '', D: '', E: '' });
    setFormCorrectAnswer('A');
    setFormExplanation('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle open modal for edit
  const handleOpenEditModal = (q: Question) => {
    setEditingQuestion(q);
    setFormCategory(q.categoryId);
    setFormDifficulty(q.difficulty);
    setFormPassage(q.passage || '');
    setFormText(q.text);
    const optMap: Record<'A' | 'B' | 'C' | 'D' | 'E', string> = { A: '', B: '', C: '', D: '', E: '' };
    q.options.forEach((opt) => {
      optMap[opt.key] = opt.text;
    });
    setFormOptions(optMap);
    setFormCorrectAnswer(q.correctAnswer);
    setFormExplanation(q.explanation);
    setFormError('');
    setIsModalOpen(true);
  };

  // Duplicate question
  const handleDuplicate = (q: Question) => {
    onAddQuestion({
      categoryId: q.categoryId,
      passage: q.passage,
      text: `${q.text} (Salinan)`,
      options: [...q.options],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      points: q.points,
    });
  };

  // Save question handler
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formText.trim()) {
      setFormError('Teks pertanyaan wajib diisi.');
      return;
    }

    if (!formOptions.A.trim() || !formOptions.B.trim() || !formOptions.C.trim() || !formOptions.D.trim() || !formOptions.E.trim()) {
      setFormError('Seluruh pilihan jawaban (A, B, C, D, E) wajib diisi.');
      return;
    }

    if (!formExplanation.trim()) {
      setFormError('Pembahasan soal wajib diisi agar siswa dapat belajar dari evaluasi.');
      return;
    }

    const optionsList = (['A', 'B', 'C', 'D', 'E'] as const).map((key) => ({
      key,
      text: formOptions[key].trim(),
    }));

    if (editingQuestion) {
      onUpdateQuestion(editingQuestion.id, {
        categoryId: formCategory,
        difficulty: formDifficulty,
        passage: formPassage.trim() || undefined,
        text: formText.trim(),
        options: optionsList,
        correctAnswer: formCorrectAnswer,
        explanation: formExplanation.trim(),
      });
    } else {
      onAddQuestion({
        categoryId: formCategory,
        difficulty: formDifficulty,
        passage: formPassage.trim() || undefined,
        text: formText.trim(),
        options: optionsList,
        correctAnswer: formCorrectAnswer,
        explanation: formExplanation.trim(),
        points: 4,
      });
    }

    setIsModalOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (examHistory.length === 0) {
      alert('Belum ada data riwayat ujian siswa untuk diekspor.');
      return;
    }

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
      'Waktu Selesai'
    ];

    const rows = examHistory.map((item) => [
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
      item.passed ? 'LULUS' : 'REMEDIAL',
      `"${new Date(item.completedAt).toLocaleString('id-ID')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_TKA_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save Settings
  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(localSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Panel Administrator Guru TKA
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola bank soal, periksa rekapan hasil pengerjaan siswa, dan sesuaikan parameter ujian.
          </p>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            onClick={() => onSelectSubTab('questions')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeSubTab === 'questions'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bank Soal ({questions.length})</span>
          </button>
          <button
            onClick={() => onSelectSubTab('student-results')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeSubTab === 'student-results'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Rekap Nilai Siswa ({examHistory.length})</span>
          </button>
          <button
            onClick={() => onSelectSubTab('settings')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeSubTab === 'settings'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Pengaturan Ujian</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: BANK SOAL MANAGEMENT --- */}
      {activeSubTab === 'questions' && (
        <div className="space-y-4">
          {/* Action & Filter Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              {/* Search input */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari kata kunci soal, teks stimulus, atau pembahasan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Category filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="py-1.5 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-700"
              >
                <option value="all">Semua Subtes</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Difficulty filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="py-1.5 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-700"
              >
                <option value="all">Semua Kesulitan</option>
                <option value="Mudah">Mudah</option>
                <option value="Sedang">Sedang</option>
                <option value="Sukar">Sukar</option>
              </select>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onResetQuestions}
                title="Kembalikan ke bank soal standar nasional"
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Standar</span>
              </button>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Soal Baru</span>
              </button>
            </div>
          </div>

          {/* Questions List */}
          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">
                Tidak ada butir soal ditemukan
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                Coba sesuaikan kata kunci pencarian atau filter subtes, atau buat butir soal baru.
              </p>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-indigo-700 text-white rounded-lg text-xs font-semibold"
              >
                Tambah Soal Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((q, idx) => {
                const categoryInfo = CATEGORIES.find((c) => c.id === q.categoryId);

                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 pb-3 mb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <span className="font-bold text-slate-900">
                            #{idx + 1}
                          </span>
                          <span>·</span>
                          <span className="font-medium text-indigo-700">
                            {categoryInfo?.name || q.categoryId}
                          </span>
                          <span>·</span>
                          <span className="text-slate-600">
                            Tingkat {q.difficulty}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          ID: {q.id}
                        </span>
                      </div>

                      {/* Quick Actions: Edit, Duplicate, Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(q)}
                          title="Edit Butir Soal"
                          className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(q)}
                          title="Duplikat Soal"
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Hapus butir soal ini dari bank soal?')) {
                              onDeleteQuestion(q.id);
                            }
                          }}
                          title="Hapus Soal"
                          className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Stimulus if exists */}
                    {q.passage && (
                      <div className="mb-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 line-clamp-3">
                        <strong className="text-slate-800">Stimulus:</strong> {q.passage}
                      </div>
                    )}

                    {/* Question Text */}
                    <div className="text-sm font-medium text-slate-900 mb-4 whitespace-pre-line leading-relaxed">
                      {q.text}
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-3">
                      {q.options.map((opt) => {
                        const isCorrect = opt.key === q.correctAnswer;
                        return (
                          <div
                            key={opt.key}
                            className={`p-2 rounded-lg border text-xs flex items-start gap-2 ${
                              isCorrect
                                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-800'
                              }`}
                            >
                              {opt.key}
                            </span>
                            <span className="truncate pt-0.5">{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation toggle preview */}
                    <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="truncate max-w-2xl">
                        <strong>Pembahasan:</strong> {q.explanation}
                      </span>
                      <span className="font-semibold text-emerald-700 shrink-0">
                        Kunci: Opsi {q.correctAnswer}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: REKAP HASIL UJIAN SISWA --- */}
      {activeSubTab === 'student-results' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Data Hasil Skor Peserta Ujian TKA
              </h2>
              <p className="text-xs text-slate-500">
                Total {examHistory.length} sesi pengerjaan ujian tercatat di database lokal.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {examHistory.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Kosongkan semua riwayat ujian peserta?')) {
                      onClearAllExamHistory();
                    }
                  }}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                >
                  Bersihkan Riwayat
                </button>
              )}
              <button
                onClick={handleExportCSV}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File CSV / Excel</span>
              </button>
            </div>
          </div>

          {examHistory.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">
                Belum ada siswa yang menyelesaikan ujian
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Hasil pengerjaan siswa akan otomatis muncul di tabel ini secara lengkap dengan nilai dan detail lembar jawaban.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="py-3 px-4">Nama Siswa</th>
                      <th className="py-3 px-4">NISN</th>
                      <th className="py-3 px-4">Subtes / Paket</th>
                      <th className="py-3 px-4 text-center">Benar / Soal</th>
                      <th className="py-3 px-4 text-center">Skor (100)</th>
                      <th className="py-3 px-4 text-center">Skor UTBK</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4">Tanggal Ujian</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {examHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {item.studentName}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono">
                          {item.nisn}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {item.testTitle}
                        </td>
                        <td className="py-3 px-4 text-center font-mono tabular-nums">
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
                            <span className="text-emerald-700 font-semibold">
                              Lulus
                            </span>
                          ) : (
                            <span className="text-rose-600 font-semibold">
                              Remedial
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {new Date(item.completedAt).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setInspectResult(item)}
                              title="Lihat Detail Lembar Jawaban Siswa"
                              className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded transition-colors text-xs font-medium"
                            >
                              Detail
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Hapus hasil ujian siswa ini?')) {
                                  onDeleteExamHistory(item.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: PENGATURAN UJIAN --- */}
      {activeSubTab === 'settings' && (
        <div className="max-w-2xl bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Konfigurasi Parameter Ujian TKA
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sesuaikan durasi waktu, ambang batas kelulusan (KKM), dan identitas penyelenggara.
            </p>
          </div>

          {settingsSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Pengaturan berhasil disimpan dan langsung diterapkan ke seluruh sesi siswa.</span>
            </div>
          )}

          <form onSubmit={handleSaveSettingsSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nama Sekolah / Lembaga Asesmen
              </label>
              <input
                type="text"
                value={localSettings.schoolName}
                onChange={(e) => setLocalSettings({ ...localSettings, schoolName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Durasi Ujian Default (Menit)
                </label>
                <input
                  type="number"
                  min={5}
                  max={240}
                  value={localSettings.defaultDurationMinutes}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      defaultDurationMinutes: parseInt(e.target.value) || 30,
                    })
                  }
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Ambang Batas Nilai / KKM (Skala 100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={localSettings.passingGrade}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      passingGrade: parseInt(e.target.value) || 70,
                    })
                  }
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.allowReviewAfterTest}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      allowReviewAfterTest: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600"
                />
                <span className="text-xs text-slate-700 font-medium">
                  Izinkan siswa melihat kunci jawaban dan pembahasan setelah selesai ujian
                </span>
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-medium rounded-lg text-xs transition-colors shadow-xs"
              >
                Simpan Konfigurasi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL TAMBAH & EDIT SOAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">
                {editingQuestion ? 'Edit Butir Soal TKA' : 'Tambah Butir Soal Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form onSubmit={handleSaveQuestion} className="p-6 overflow-y-auto space-y-5 flex-1">
              {formError && (
                <div className="p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Subtes & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mata Uji Subtes <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CategoryId)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-900"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.shortName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tingkat Kesulitan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-900"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Sukar">Sukar</option>
                  </select>
                </div>
              </div>

              {/* Wacana / Stimulus (Opsional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Wacana / Teks Stimulus / Bacaan (Opsional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Masukkan wacana atau bacaan jika soal berupa pemahaman teks literasi atau studi kasus..."
                  value={formPassage}
                  onChange={(e) => setFormPassage(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Teks Pertanyaan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teks Pertanyaan / Soal <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ketik butir pertanyaan di sini..."
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900 font-sans"
                />
              </div>

              {/* Opsi Jawaban (A, B, C, D, E) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Pilihan Jawaban (Klik lingkaran untuk memilih Kunci Jawaban Benar) <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
                  {(['A', 'B', 'C', 'D', 'E'] as const).map((key) => {
                    const isKeySelected = formCorrectAnswer === key;
                    return (
                      <div
                        key={key}
                        className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${
                          isKeySelected
                            ? 'border-emerald-400 bg-emerald-50/60 ring-1 ring-emerald-400'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setFormCorrectAnswer(key)}
                          className={`w-7 h-7 rounded-md font-bold text-xs flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                            isKeySelected
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title={`Tandai opsi ${key} sebagai kunci jawaban`}
                        >
                          {key}
                        </button>
                        <input
                          type="text"
                          required
                          placeholder={`Teks pilihan ${key}...`}
                          value={formOptions[key]}
                          onChange={(e) =>
                            setFormOptions({ ...formOptions, [key]: e.target.value })
                          }
                          className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white"
                        />
                        {isKeySelected && (
                          <span className="text-[11px] font-semibold text-emerald-700 shrink-0 px-2">
                            Kunci Benar
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pembahasan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pembahasan Lengkap & Solusi <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan langkah-langkah penyelesaian, rumus yang digunakan, atau alasan logis kunci jawaban ini..."
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  {editingQuestion ? 'Perbarui Soal' : 'Simpan ke Bank Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL INSPECT DETAIL NILAI SISWA --- */}
      {inspectResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Rincian Jawaban: {inspectResult.studentName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  NISN: {inspectResult.nisn} · {inspectResult.testTitle}
                </p>
              </div>
              <button
                onClick={() => setInspectResult(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-4 gap-2 text-center p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Skor 100:</span>
                  <span className="font-bold text-base text-slate-900 font-mono">
                    {inspectResult.scoreScale100.toFixed(1)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Skor UTBK:</span>
                  <span className="font-bold text-base text-indigo-700 font-mono">
                    {inspectResult.scoreUTBKScale}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Benar / Total:</span>
                  <span className="font-bold text-base text-emerald-700 font-mono">
                    {inspectResult.correctCount} / {inspectResult.totalQuestions}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Status:</span>
                  <span className={`font-bold text-xs ${inspectResult.passed ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {inspectResult.passed ? 'LULUS' : 'REMEDIAL'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900">
                  Daftar Pilihan Jawaban per Soal:
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs">
                  {Object.entries(inspectResult.answers).map(([qId, ansData], idx) => {
                    const targetQ = questions.find((item) => item.id === qId);
                    return (
                      <div key={qId} className="p-3 flex items-start justify-between gap-4 bg-white hover:bg-slate-50">
                        <div className="flex-1">
                          <span className="font-semibold text-slate-900">
                            Soal #{idx + 1}
                          </span>
                          <p className="text-slate-600 line-clamp-1 mt-0.5">
                            {targetQ?.text || 'Teks soal'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 font-mono">
                          <span>
                            Dijawab: <strong>{ansData.selected || 'Kosong'}</strong>
                          </span>
                          <span>
                            Kunci: <strong>{ansData.correct}</strong>
                          </span>
                          {ansData.isCorrect ? (
                            <span className="text-emerald-600 font-bold">✓ Benar</span>
                          ) : (
                            <span className="text-rose-600 font-bold">✗ Salah</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setInspectResult(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
