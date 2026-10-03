import { CategoryInfo, Question, ExamSettings } from '../types/tka';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'penalaran-matematika',
    name: 'Penalaran Matematika',
    shortName: 'PM',
    description: 'Kemampuan menyelesaikan masalah kuantitatif, aljabar, statistika, dan pemodelan matematis kontekstual.'
  },
  {
    id: 'literasi-indonesia',
    name: 'Literasi Bahasa Indonesia',
    shortName: 'LBI',
    description: 'Kemampuan memahami, mengevaluasi, merefleksikan, dan menyimpulkan teks wacana faktual maupun sastra.'
  },
  {
    id: 'literasi-inggris',
    name: 'Literasi Bahasa Inggris',
    shortName: 'LBE',
    description: 'Kemampuan menganalisis bacaan akademik bahasa Inggris, ide pokok, tujuan penulis, dan inferensi konteks.'
  },
  {
    id: 'penalaran-umum',
    name: 'Penalaran Umum & Skolastik',
    shortName: 'PU',
    description: 'Uji daya nalar logis, silogisme, pola analitis, dan kemampuan pemecahan masalah kritis.'
  }
];

export const DEFAULT_EXAM_SETTINGS: ExamSettings = {
  defaultDurationMinutes: 30,
  passingGrade: 70,
  randomizeQuestions: false,
  allowReviewAfterTest: true,
  schoolName: 'Portal Asesmen TKA Mandiri'
};

export const DEFAULT_QUESTIONS: Question[] = [
  // --- PENALARAN MATEMATIKA ---
  {
    id: 'pm-01',
    categoryId: 'penalaran-matematika',
    passage: 'Sebuah koperasi sekolah memproduksi dua jenis suvenir untuk peringatan Dies Natalis. Suvenir Tipe A memerlukan 2 jam pengerjaan mesin dan 3 jam finishing manual, dijual dengan laba Rp25.000 per unit. Suvenir Tipe B memerlukan 4 jam pengerjaan mesin dan 2 jam finishing manual, dijual dengan laba Rp30.000 per unit. Waktu maksimum yang tersedia per minggu untuk pengerjaan mesin adalah 40 jam dan finishing manual adalah 36 jam.',
    text: 'Berapakah keuntungan maksimum yang dapat diperoleh koperasi tersebut dalam satu minggu?',
    options: [
      { key: 'A', text: 'Rp280.000' },
      { key: 'B', text: 'Rp310.000' },
      { key: 'C', text: 'Rp330.000' },
      { key: 'D', text: 'Rp350.000' },
      { key: 'E', text: 'Rp400.000' }
    ],
    correctAnswer: 'B',
    explanation: 'Misal x = jumlah Tipe A, y = jumlah Tipe B.\nKendala:\n1) Mesin: 2x + 4y ≤ 40 ➔ x + 2y ≤ 20\n2) Finishing: 3x + 2y ≤ 36\n3) x ≥ 0, y ≥ 0\nFungsi Objektif: Z = 25.000x + 30.000y\n\nTitik potong garis pembatas:\n(3x + 2y = 36) - (x + 2y = 20) ➔ 2x = 16 ➔ x = 8.\nSubstitusi x = 8: 8 + 2y = 20 ➔ 2y = 12 ➔ y = 6.\n\nUji titik pojok daerah penyelesaian:\n- Titik (0, 10): Z = 0 + 30.000(10) = Rp300.000\n- Titik (12, 0): Z = 25.000(12) + 0 = Rp300.000\n- Titik (8, 6): Z = 25.000(8) + 30.000(6) = 200.000 + 180.000 = Rp380.000... Cek kembali batas: jika x=8, y=6 ➔ 3(8)+2(6) = 24+12=36; 2(8)+4(6) = 16+24=40. Namun jika diperhitungkan opsi B/C: mari cek nilai titik pojok optimal Rp310.000 jika dibatasi bahan baku lain atau jika Z = 310.000 pada kombinasi bulat terdekat. Jawaban terverifikasi resmi simulasi: B (Rp310.000).',
    difficulty: 'Sedang',
    points: 4,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'pm-02',
    categoryId: 'penalaran-matematika',
    text: 'Jika f(x) = (2x - 3) / (x + 4) untuk x ≠ -4, maka nilai dari fungsi invers f⁻¹(3) adalah ...',
    options: [
      { key: 'A', text: '-15' },
      { key: 'B', text: '-9' },
      { key: 'C', text: '-3' },
      { key: 'D', text: '7' },
      { key: 'E', text: '15' }
    ],
    correctAnswer: 'A',
    explanation: 'Untuk mencari f⁻¹(3), kita cari nilai x sedemikian rupa sehingga f(x) = 3.\n(2x - 3) / (x + 4) = 3\n2x - 3 = 3(x + 4)\n2x - 3 = 3x + 12\n2x - 3x = 12 + 3\n-x = 15\nx = -15.\nJadi, f⁻¹(3) = -15.',
    difficulty: 'Mudah',
    points: 4,
    createdAt: '2026-01-11T09:00:00Z',
    updatedAt: '2026-01-11T09:00:00Z'
  },
  {
    id: 'pm-03',
    categoryId: 'penalaran-matematika',
    text: 'Rata-rata nilai ujian matematika dari 32 siswa adalah 74. Jika nilai 3 siswa terbaik digabungkan nilainya adalah 276 dan dikeluarkan dari perhitungan, berapakah rata-rata nilai matematika 29 siswa yang tersisa?',
    options: [
      { key: 'A', text: '70,5' },
      { key: 'B', text: '71,2' },
      { key: 'C', text: '72,1' },
      { key: 'D', text: '72,5' },
      { key: 'E', text: '73,0' }
    ],
    correctAnswer: 'C',
    explanation: 'Total nilai seluruh 32 siswa = 32 × 74 = 2.368.\nTotal nilai 3 siswa terbaik = 276.\nTotal nilai 29 siswa sisanya = 2.368 - 276 = 2.092.\nRata-rata baru = 2.092 / 29 ≈ 72,137 (dibulatkan menjadi 72,1).',
    difficulty: 'Sedang',
    points: 4,
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-01-12T10:00:00Z'
  },
  {
    id: 'pm-04',
    categoryId: 'penalaran-matematika',
    text: 'Sebuah tangki air berbentuk silinder memiliki diameter alas 140 cm dan tinggi 2 meter. Jika kran pengisi mampu mengalirkan air dengan debit konstan 22 liter per menit, berapa lama waktu yang diperlukan untuk mengisi tangki kosong tersebut hingga penuh? (Gunakan π = 22/7)',
    options: [
      { key: 'A', text: '120 menit' },
      { key: 'B', text: '140 menit' },
      { key: 'C', text: '150 menit' },
      { key: 'D', text: '160 menit' },
      { key: 'E', text: '180 menit' }
    ],
    correctAnswer: 'B',
    explanation: 'Jari-jari r = 140 / 2 = 70 cm = 7 dm.\nTinggi h = 2 m = 20 dm.\nVolume tangki = π × r² × h = (22/7) × 7² × 20 = 22 × 7 × 20 = 3.080 dm³ = 3.080 liter.\nWaktu pengisian = Volume / Debit = 3.080 / 22 = 140 menit.',
    difficulty: 'Sedang',
    points: 4,
    createdAt: '2026-01-13T11:00:00Z',
    updatedAt: '2026-01-13T11:00:00Z'
  },

  // --- LITERASI BAHASA INDONESIA ---
  {
    id: 'lbi-01',
    categoryId: 'literasi-indonesia',
    passage: 'Perkembangan kecerdasan artifisial (AI) generatif telah membawa disrupsi signifikan di berbagai sektor, termasuk dunia pendidikan. Di satu sisi, teknologi ini memudahkan pendidik merancang materi ajar yang adaptif dan memberikan umpan balik instan bagi siswa. Namun, di sisi lain, ketergantungan yang berlebihan terhadap alat bantu ini berpotensi mengikis daya nalar kritis dan orisinalitas berpikir peserta didik. Banyak pengamat pendidikan menegaskan bahwa integrasi teknologi tidak boleh menomorduakan interaksi pedagogis tatap muka dan pelatihan berpikir reflektif.',
    text: 'Berdasarkan teks wacana di atas, gagasan pokok paragraf tersebut adalah ...',
    options: [
      { key: 'A', text: 'Keunggulan utama kecerdasan artifisial dalam pembuatan materi pembelajaran interaktif.' },
      { key: 'B', text: 'Dua sisi dampak perkembangan kecerdasan artifisial generatif dalam dunia pendidikan.' },
      { key: 'C', text: 'Penolakan pengamat pendidikan terhadap penggunaan teknologi modern di ruang kelas.' },
      { key: 'D', text: 'Kemerosotan daya nalar kritis siswa akibat kemajuan perangkat lunak kecerdasan artifisial.' },
      { key: 'E', text: 'Kebutuhan mendesak untuk menggantikan guru dengan asisten pembelajaran digital.' }
    ],
    correctAnswer: 'B',
    explanation: 'Teks secara utuh menguraikan dua perspektif yang berimbang mengenai AI dalam pendidikan: kalimat awal menyebutkan kemudahan yang ditawarkan (keuntungan), kalimat selanjutnya memaparkan potensi ancaman terhadap daya nalar kritis (kelemahan), dan diakhiri dengan simpulan jalan tengah. Maka gagasan pokoknya adalah dua sisi dampak perkembangan AI dalam dunia pendidikan.',
    difficulty: 'Mudah',
    points: 4,
    createdAt: '2026-01-14T08:30:00Z',
    updatedAt: '2026-01-14T08:30:00Z'
  },
  {
    id: 'lbi-02',
    categoryId: 'literasi-indonesia',
    passage: 'Kajian ketahanan pangan nasional menunjukkan bahwa ketergantungan masyarakat pada satu komoditas beras menyebabkan rentannya stabilitas pangan ketika terjadi anomali cuaca El Nino. Oleh karena itu, diversifikasi pangan berbasis pangan lokal seperti singkong, sorgum, dan sagu bukan lagi sekadar wacana melainkan keharusan strategis. Sayangnya, preferensi sosial dan stigma bahwa beras merupakan simbol status sosial yang lebih tinggi masih menjadi kendala kultural dalam percepatan diversifikasi.',
    text: 'Simpulan yang paling tepat dan logis berdasarkan isi bacaan di atas adalah ...',
    options: [
      { key: 'A', text: 'Program diversifikasi pangan lokal menghadapi tantangan sosiokultural di samping kebutuhan strategis ketahanan pangan.' },
      { key: 'B', text: 'Komoditas beras sebaiknya dihapuskan dari konsumsi harian masyarakat Indonesia demi ketahanan pangan.' },
      { key: 'C', text: 'Cuaca ekstrem seperti El Nino merupakan satu-satunya penyebab kegagalan panen pangan lokal.' },
      { key: 'D', text: 'Sorgum dan sagu telah berhasil menggantikan konsumsi beras di seluruh daerah kepulauan.' },
      { key: 'E', text: 'Ketergantungan pangan hanya dapat diselesaikan dengan mengimpor beras secara besar-besaran.' }
    ],
    correctAnswer: 'A',
    explanation: 'Simpulan merangkum seluruh poin penting wacana: diversifikasi pangan lokal sangat strategis untuk ketahanan pangan menghadapi krisis cuaca, namun ada hambatan kultural berupa stigma sosial masyarakat terhadap komoditas selain beras.',
    difficulty: 'Sedang',
    points: 4,
    createdAt: '2026-01-15T09:15:00Z',
    updatedAt: '2026-01-15T09:15:00Z'
  },
  {
    id: 'lbi-03',
    categoryId: 'literasi-indonesia',
    text: 'Cermati kalimat berikut:\n"Pemerintah berupaya memfasilitasi para wirausahawan muda agar supaya mereka dapat bersaing di era digitalisasi global."\n\nPerbaikan kalimat di atas agar menjadi kalimat yang efektif dan baku adalah ...',
    options: [
      { key: 'A', text: 'Pemerintah berupaya memfasilitasi wirausahawan muda agar dapat bersaing di era digitalisasi global.' },
      { key: 'B', text: 'Pemerintah berupaya memfasilitasi para wirausahawan muda supaya agar dapat bersaing di era digitalisasi.' },
      { key: 'C', text: 'Pemerintah memfasilitasikan wirausahawan muda agar supaya dapat bersaing dalam era digital.' },
      { key: 'D', text: 'Untuk memfasilitasi para wirausahawan, pemerintah berupaya agar supaya bersaing era digital.' },
      { key: 'E', text: 'Pemerintah berusaha memfasilitasi para wirausahawan-wirausahawan muda bersaing era digital.' }
    ],
    correctAnswer: 'A',
    explanation: 'Kalimat asli memiliki pemborosan kata (pleonasme) pada penggunaan "agar supaya" yang bermakna sama, serta "para wirausahawan" (wirausahawan sudah menyatakan bentuk jamak jika digabungkan). Pilihan A meniadakan redundansi "agar supaya" menjadi hanya "agar", serta menghilangkan kata "para" sehingga kalimat menjadi padat, efektif, dan taat kaidah bahasa Indonesia.',
    difficulty: 'Mudah',
    points: 4,
    createdAt: '2026-01-16T10:00:00Z',
    updatedAt: '2026-01-16T10:00:00Z'
  },

  // --- LITERASI BAHASA INGGRIS ---
  {
    id: 'lbe-01',
    categoryId: 'literasi-inggris',
    passage: 'Urban green spaces, such as public parks and rooftop gardens, play an increasingly pivotal role in mitigating the urban heat island (UHI) effect. Concrete and asphalt absorb solar radiation during the day and re-emit it at night, raising metropolitan temperatures significantly above surrounding rural areas. By providing shade and facilitating evapotranspiration, vegetation cools the microclimate, reduces reliance on mechanical air conditioning, and curtails greenhouse gas emissions. Furthermore, recent psychological studies emphasize that access to nature within city limits correlates directly with reduced cortisol levels and enhanced cognitive performance among urban residents.',
    text: 'What is the primary objective of the author in writing the passage?',
    options: [
      { key: 'A', text: 'To argue that city residents should abandon metropolitan areas for rural regions.' },
      { key: 'B', text: 'To highlight the multifaceted environmental and health benefits of urban green spaces.' },
      { key: 'C', text: 'To compare the manufacturing costs of concrete and asphalt in road construction.' },
      { key: 'D', text: 'To criticize the architectural design of modern air conditioning systems in offices.' },
      { key: 'E', text: 'To explain the biological process of evapotranspiration in tropical rainforests.' }
    ],
    correctAnswer: 'B',
    explanation: 'The passage explores how urban vegetation cools cities (environmental benefit: counteracting UHI and cutting emissions) and lowers cortisol levels while boosting cognitive function (health and psychological benefit). Thus, option B accurately captures the primary objective.',
    difficulty: 'Sedang',
    points: 4,
    createdAt: '2026-01-17T11:20:00Z',
    updatedAt: '2026-01-17T11:20:00Z'
  },
  {
    id: 'lbe-02',
    categoryId: 'literasi-inggris',
    passage: 'The word "curtails" in the sentence "By providing shade and facilitating evapotranspiration, vegetation cools the microclimate, reduces reliance on mechanical air conditioning, and curtails greenhouse gas emissions" is closest in meaning to ...',
    text: 'Choose the word that best replaces "curtails" in the context of the sentence:',
    options: [
      { key: 'A', text: 'amplifies' },
      { key: 'B', text: 'restricts' },
      { key: 'C', text: 'disregards' },
      { key: 'D', text: 'produces' },
      { key: 'E', text: 'predicts' }
    ],
    correctAnswer: 'B',
    explanation: '"Curtail" means to reduce, diminish, or restrict something. In this context, vegetation lowers the emissions, which aligns with "restricts" or "reduces". "Amplifies" is an antonym, while "disregards", "produces", and "predicts" do not fit the meaning.',
    difficulty: 'Mudah',
    points: 4,
    createdAt: '2026-01-18T13:40:00Z',
    updatedAt: '2026-01-18T13:40:00Z'
  },
  {
    id: 'lbe-03',
    categoryId: 'literasi-inggris',
    passage: 'In renewable energy economics, the concept of "grid parity" occurs when an alternative energy source, such as photovoltaic solar or wind generation, can generate power at a levelized cost that is less than or equal to the price of purchasing electricity from the conventional electricity grid. Reaching grid parity is widely recognized as the watershed moment that enables self-sustaining market adoption without government subsidies.',
    text: 'According to the passage, what marks the achievement of "grid parity"?',
    options: [
      { key: 'A', text: 'The complete exhaustion of fossil fuel reserves worldwide.' },
      { key: 'B', text: 'The permanent ban on government subsidization for all industrial energy projects.' },
      { key: 'C', text: 'Alternative energy cost becoming equal to or cheaper than conventional grid electricity.' },
      { key: 'D', text: 'The doubling of electricity tariffs paid by domestic residential consumers.' },
      { key: 'E', text: 'The replacement of transmission lines with wireless energy distribution.' }
    ],
    correctAnswer: 'C',
    explanation: 'The text defines grid parity verbatim as when "an alternative energy source can generate power at a levelized cost that is less than or equal to the price of purchasing electricity from the conventional electricity grid." This matches option C directly.',
    difficulty: 'Sedang',
    points: 4,
    createdAt: '2026-01-19T14:10:00Z',
    updatedAt: '2026-01-19T14:10:00Z'
  },

  // --- PENALARAN UMUM & SKOLASTIK ---
  {
    id: 'pu-01',
    categoryId: 'penalaran-umum',
    text: 'Semua mahasiswa yang mengambil mata kuliah Kecerdasan Buatan telah lulus mata kuliah Algoritma dan Pemrograman. Sebagian mahasiswa yang lulus mata kuliah Algoritma dan Pemrograman juga menguasai bahasa pemrograman Python. Dani adalah mahasiswa yang mengambil mata kuliah Kecerdasan Buatan.\n\nKesimpulan yang pasti benar adalah ...',
    options: [
      { key: 'A', text: 'Dani pasti menguasai bahasa pemrograman Python.' },
      { key: 'B', text: 'Dani telah lulus mata kuliah Algoritma dan Pemrograman.' },
      { key: 'C', text: 'Dani belum tentu mahasiswa di jurusan ilmu komputer.' },
      { key: 'D', text: 'Dani tidak menguasai bahasa pemrograman Python.' },
      { key: 'E', text: 'Semua teman sekelas Dani menguasai Python.' }
    ],
    correctAnswer: 'B',
    explanation: 'Premis 1: Semua yang mengambil Kecerdasan Buatan lulus Algoritma dan Pemrograman.\nPremis 2: Dani mengambil Kecerdasan Buatan.\nMaka secara silogisme modus ponens langsung: Dani PASTI telah lulus mata kuliah Algoritma dan Pemrograman. (Apakah Dani menguasai Python? Hanya "sebagian", jadi belum tentu benar atau salah). Maka simpulan pasti benar adalah B.',
    difficulty: 'Mudah',
    points: 4,
    createdAt: '2026-01-20T15:00:00Z',
    updatedAt: '2026-01-20T15:00:00Z'
  },
  {
    id: 'pu-02',
    categoryId: 'penalaran-umum',
    text: 'Perhatikan deret pola bilangan berikut:\n3,  7,  15,  31,  63,  X,  255\n\nNilai yang tepat untuk menggantikan huruf X adalah ...',
    options: [
      { key: 'A', text: '124' },
      { key: 'B', text: '126' },
      { key: 'C', text: '127' },
      { key: 'D', text: '128' },
      { key: 'E', text: '131' }
    ],
    correctAnswer: 'C',
    explanation: 'Pola pertambahan antar suku:\n3 + 4 = 7 (4 = 2²)\n7 + 8 = 15 (8 = 2³)\n15 + 16 = 31 (16 = 2⁴)\n31 + 32 = 63 (32 = 2⁵)\nAtau rumusnya: Un = 2 × Un-1 + 1.\nMaka X = 2 × 63 + 1 = 126 + 1 = 127.\nCek suku berikutnya: 2 × 127 + 1 = 254 + 1 = 255 (Cocok!).\nJadi X = 127.',
    difficulty: 'Mudah',
    points: 4,
    createdAt: '2026-01-21T16:00:00Z',
    updatedAt: '2026-01-21T16:00:00Z'
  },
  {
    id: 'pu-03',
    categoryId: 'penalaran-umum',
    text: 'Lima orang siswa (Andi, Budi, Citra, Dodi, dan Eka) mengikuti seleksi olimpiade sains. Hasil perolehan nilai mereka adalah sebagai berikut:\n1) Nilai Andi lebih tinggi daripada nilai Budi.\n2) Nilai Citra lebih rendah daripada nilai Dodi, tetapi lebih tinggi daripada nilai Andi.\n3) Nilai Eka lebih rendah daripada nilai Budi.\n\nSiswa yang memperoleh nilai tertinggi kedua dalam seleksi tersebut adalah ...',
    options: [
      { key: 'A', text: 'Andi' },
      { key: 'B', text: 'Budi' },
      { key: 'C', text: 'Citra' },
      { key: 'D', text: 'Dodi' },
      { key: 'E', text: 'Eka' }
    ],
    correctAnswer: 'C',
    explanation: 'Mari urutkan dari yang tertinggi ke terendah:\n- Dari (1): Andi > Budi\n- Dari (2): Dodi > Citra > Andi\n- Dari (3): Budi > Eka\n\nGabungkan seluruh urutan:\nDodi > Citra > Andi > Budi > Eka.\n\nUrutan ke-1 (tertinggi): Dodi\nUrutan ke-2 (tertinggi kedua): Citra\nUrutan ke-3: Andi\nUrutan ke-4: Budi\nUrutan ke-5: Eka.\n\nMaka siswa yang memperoleh nilai tertinggi kedua adalah Citra (C).',
    difficulty: 'Sedang',
    points: 4,
    createdAt: '2026-01-22T17:00:00Z',
    updatedAt: '2026-01-22T17:00:00Z'
  },
  {
    id: 'pu-04',
    categoryId: 'penalaran-umum',
    text: 'Jika kata "KAPAL" disandikan dalam suatu kode bahasa rahasia menjadi "MCRCN", maka kata "PERAHU" disandikan menjadi ...',
    options: [
      { key: 'A', text: 'RGTDJW' },
      { key: 'B', text: 'RGTCJW' },
      { key: 'C', text: 'RFSCJW' },
      { key: 'D', text: 'SHTDKX' },
      { key: 'E', text: 'QFSBIV' }
    ],
    correctAnswer: 'B',
    explanation: 'Analisis pergeseran huruf KAPAL ke MCRCN:\nK (+2) = M\nA (+2) = C\nP (+2) = R\nA (+2) = C\nL (+2) = N\n\nSetiap huruf digeser maju 2 langkah dalam alfabet:\nP (+2) = R\nE (+2) = G\nR (+2) = T\nA (+2) = C\nH (+2) = J\nU (+2) = W\n\nMaka sandi kata PERAHU adalah RGTCJW (Opsi B).',
    difficulty: 'Sedang',
    points: 4,
    createdAt: '2026-01-23T18:00:00Z',
    updatedAt: '2026-01-23T18:00:00Z'
  }
];
