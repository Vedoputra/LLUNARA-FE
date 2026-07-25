# Execution Plan — LLunara Mobile (`llunara-mobile`)

**Dokumen ini adalah panduan eksekusi berurutan dari nol sampai selesai.**
Setiap task punya format yang sama agar dapat dikerjakan oleh developer maupun AI agent tanpa konteks tambahan.

Untuk API bisa tembak ke https://llunara-be.vercel.app/
sesuaikan dengan list api .md. AKU juga sudah buat 2 endpoint API yang sepertinya tidak dimasukan ke file ini. Aku sudah generate UInya dan kamu bisa analisanya

---

## Cara Membaca Dokumen Ini

| Field | Arti |
|---|---|
| **ID** | Identitas unik task |
| **Tujuan** | Kondisi akhir yang ingin dicapai |
| **Langkah** | Instruksi teknis yang harus dilakukan |
| **Output** | Artefak konkret yang dihasilkan |
| **Selesai Jika** | Kriteria verifikasi |
| **Butuh** | Task Backend yang harus selesai lebih dulu |

**Aturan:** jangan mulai task yang punya field **Butuh** sebelum task backend tersebut benar-benar selesai dan sudah ter-deploy.

---

## Tech Stack Frontend

| Komponen | Pilihan | Alasan |
|---|---|---|
| Framework | Expo (SDK stabil terbaru) + TypeScript | Cross-platform, build gratis 15×/bulan |
| Routing | Expo Router | File-based routing, konvensi jelas |
| Server state | TanStack Query | Cache, retry, dan loading state bawaan — krusial untuk menangani cold start |
| Client state | Zustand | Ringan, tanpa boilerplate |
| Secure storage | `expo-secure-store` | Token disimpan di Keychain/Keystore OS |
| Notifikasi | `expo-notifications` | Local notification, gratis |
| Kalender | `react-native-calendars` | Matang, mudah dikustomisasi |
| Grafik | `react-native-gifted-charts` | Ringan, tidak butuh SVG kompleks |
| Form | `react-hook-form` + `zod` | Validasi type-safe |
| Styling | StyleSheet + design token terpusat | Tanpa dependency tambahan, kontrol penuh |
| Auth client | `@supabase/supabase-js` | Untuk auth dan read sederhana |

---

## Aturan Arsitektur yang Wajib Dipatuhi

Ini turunan langsung dari PRD Bagian 5.3. **Setiap pemanggilan data harus mengikuti aturan ini tanpa pengecualian.**

| Operasi | Jalur | Client |
|---|---|---|
| Login, register, refresh token | Supabase langsung | `supabase.auth` |
| Baca log harian mentah | Supabase langsung | `supabase.from()` |
| Baca daftar gejala | Supabase langsung | `supabase.from()` |
| **Semua operasi tulis** | Go API | `apiClient` |
| Prediksi siklus | Go API | `apiClient` |
| Insight & analytics | Go API | `apiClient` |
| Export | Go API | `apiClient` |

> **Jika ragu:** gunakan Go API. Membaca langsung dari Supabase adalah optimasi, bukan default.

---

# FASE 0 — Bootstrap & Fondasi

> **Tujuan fase:** kerangka aplikasi berdiri, terhubung ke backend, dengan sistem desain yang konsisten sejak awal.

---

### FE-0.1 — Inisialisasi Project

**Tujuan:** Project Expo berjalan di perangkat dengan konfigurasi TypeScript yang ketat.

**Langkah:**
1. Buat repository GitHub `llunara-mobile` (public)
2. Inisialisasi project Expo dengan template TypeScript dan Expo Router
3. Aktifkan mode `strict` di `tsconfig.json`
4. Setup ESLint dan Prettier
5. Buat `.gitignore` yang mencakup `.env`, `node_modules/`, `.expo/`, `dist/`

**Output:** Project Expo yang bisa dijalankan.

**Selesai jika:** Aplikasi terbuka di Expo Go dan menampilkan layar default.

---

### FE-0.2 — Struktur Folder

**Tujuan:** Batas antar tanggung jawab jelas sejak awal.

**Langkah:**

Buat struktur berikut:

```
app/                    # Routing (Expo Router) — hanya berisi layar
src/api/                # Client HTTP & Supabase
src/components/ui/      # Komponen dasar reusable
src/components/feedback/# Loading, error, empty state
src/hooks/              # Custom hooks
src/store/              # State global (Zustand)
src/services/           # Logic sisi klien (notifikasi, dll)
src/constants/          # Design token, daftar preset
src/types/              # Tipe TypeScript bersama
src/utils/              # Helper murni (tanggal, format)
```

**Aturan:**
- File di `app/` hanya berisi komposisi layar. Logic bisnis tidak boleh berada di sini
- Komponen di `src/components/ui/` tidak boleh memanggil API secara langsung
- Setiap pemanggilan data dibungkus dalam custom hook di `src/hooks/`

**Output:** Kerangka folder.

**Selesai jika:** Struktur sesuai dan alias path (`@/`) berfungsi.

---

### FE-0.3 — Konfigurasi Environment

**Tujuan:** Kredensial tidak ter-hardcode dan tidak masuk ke repository.

**Langkah:**
1. Buat `.env` dengan variabel:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_API_URL`
2. Buat `.env.example` tanpa nilai asli
3. Buat `src/constants/env.ts` yang membaca dan memvalidasi variabel tersebut, dan melempar error jelas jika ada yang kosong

> **Penting:** hanya `SUPABASE_ANON_KEY` yang boleh ada di frontend. `SERVICE_ROLE_KEY` tidak boleh muncul di sini dalam kondisi apapun — key tersebut mem-bypass seluruh Row Level Security.

**Output:** `src/constants/env.ts`, `.env.example`

**Selesai jika:** Aplikasi gagal start dengan pesan jelas jika ada variabel yang belum diisi.

---

### FE-0.4 — Design Token

**Tujuan:** Konsistensi visual dan dukungan dark mode tanpa perlu refactor besar nanti.

**Langkah:**
1. Buat `src/constants/theme.ts` berisi:
   - **Palet warna** untuk mode terang dan gelap, mencakup: `background`, `surface`, `text`, `textMuted`, `border`, `primary`, `danger`, `success`
   - **Warna semantik siklus:** `menstrual`, `follicular`, `ovulation`, `luteal`, `predicted`
   - **Skala spasi:** 4, 8, 12, 16, 24, 32, 48
   - **Skala tipografi:** `caption`, `body`, `subtitle`, `title`, `heading`
   - **Border radius:** `sm`, `md`, `lg`, `full`
2. Buat hook `useTheme()` yang mengembalikan palet sesuai skema warna sistem

**Ketentuan desain:**
- Rasio kontras minimal 4.5:1 untuk seluruh teks (WCAG AA)
- Warna prediksi harus jelas berbeda dari warna data aktual — gunakan opacity lebih rendah atau pola garis putus-putus
- Hindari palet yang terlalu bertema stereotip; utamakan keterbacaan

**Output:** `src/constants/theme.ts`, `src/hooks/useTheme.ts`

**Selesai jika:** Token dapat diakses dari komponen manapun, dan perubahan skema warna sistem langsung tercermin.

---

### FE-0.5 — Komponen UI Dasar

**Tujuan:** Pustaka komponen kecil yang dipakai berulang, agar tidak ada duplikasi styling.

**Langkah:**

Buat komponen berikut di `src/components/ui/`:

| Komponen | Ketentuan |
|---|---|
| `Button` | Varian: primary, secondary, ghost, danger. Punya state loading dan disabled |
| `Text` | Membungkus `Text` bawaan, menerima prop varian tipografi |
| `Card` | Container dengan padding dan radius standar |
| `Input` | Menampilkan label, pesan error, dan helper text |
| `Chip` | Untuk pemilihan gejala. Punya state terpilih |
| `Sheet` | Bottom sheet untuk form input cepat |
| `Divider` | Garis pemisah |

**Ketentuan wajib:**
- Setiap elemen interaktif memiliki `accessibilityLabel` dan `accessibilityRole`
- Ukuran area sentuh minimal 44×44 pt
- Seluruh warna diambil dari design token, bukan nilai literal

**Output:** File komponen di `src/components/ui/`

**Selesai jika:** Seluruh komponen dapat dirender dan berfungsi pada mode terang maupun gelap.

---

### FE-0.6 — API Client

**Tujuan:** Dua jalur akses data terdefinisi dengan jelas dan konsisten.

**Langkah:**

1. **Supabase client** — `src/api/supabase.ts`
   - Inisialisasi dengan URL dan anon key
   - Pasang adapter storage kustom yang menggunakan `expo-secure-store`, **bukan** AsyncStorage
   - Aktifkan `autoRefreshToken` dan `persistSession`

2. **Go API client** — `src/api/client.ts`
   - Buat pembungkus `fetch` dengan base URL dari environment
   - Sisipkan header `Authorization: Bearer <token>` secara otomatis dari session Supabase
   - Terapkan timeout 60 detik (**bukan** 10 detik — Render free tier butuh 30–60 detik saat cold start)
   - Tangani response error dan ubah menjadi objek `ApiError` yang terstruktur, sesuai format error backend
   - Retry otomatis maksimal 2 kali dengan exponential backoff, **hanya** untuk request GET dan error jaringan. Jangan retry request tulis
   - Pada respons 401, jalankan refresh token satu kali; jika tetap gagal, arahkan user ke halaman login

**Output:** `src/api/supabase.ts`, `src/api/client.ts`, `src/types/api.ts`

**Selesai jika:** Kedua client dapat diimpor dan digunakan; error backend terpetakan dengan benar ke tipe di frontend.

---

### FE-0.7 — Verifikasi Konektivitas

**Tujuan:** Membuktikan aplikasi benar-benar dapat menjangkau backend yang sudah di-deploy, sebelum membangun fitur apapun.

**Butuh:** BE-0.6

**Langkah:**
1. Buat layar sementara yang memanggil endpoint `/health`
2. Tampilkan status koneksi, waktu respons, dan pesan error jika gagal
3. **Ukur dan catat waktu respons saat cold start** — angka ini menjadi acuan untuk desain loading state nanti

**Output:** Layar debug sementara.

**Selesai jika:** Aplikasi menampilkan status `ok` dari backend production, dan durasi cold start sudah tercatat.

> Layar ini boleh dihapus setelah FE-2.2 selesai, atau dipindahkan ke halaman pengaturan sebagai menu diagnostik.

---

# FASE 1 — Autentikasi

> **Tujuan fase:** user dapat masuk dan sesinya bertahan dengan aman.

---

### FE-1.1 — Auth Store

**Tujuan:** Satu sumber kebenaran untuk status autentikasi di seluruh aplikasi.

**Langkah:**
1. Buat `src/store/authStore.ts` menggunakan Zustand
2. State yang disimpan: `session`, `user`, `isLoading`, `isInitialized`
3. Aksi yang tersedia: `signIn`, `signUp`, `signOut`, `initialize`
4. `initialize()` dipanggil sekali saat aplikasi mulai, untuk memulihkan sesi dari secure storage
5. Berlangganan `supabase.auth.onAuthStateChange` agar state selalu sinkron

**Output:** `src/store/authStore.ts`

**Selesai jika:** Status autentikasi konsisten dan bertahan setelah aplikasi ditutup dan dibuka kembali.

---

### FE-1.2 — Layar Login & Register

**Tujuan:** Antarmuka masuk yang jelas dan aman.

**Langkah:**
1. Buat `app/(auth)/login.tsx` dan `app/(auth)/register.tsx`
2. Gunakan `react-hook-form` dengan skema validasi `zod`:
   - Email: format valid
   - Password: minimal 8 karakter
   - Register: konfirmasi password harus cocok
3. Tampilkan state loading pada tombol saat proses berlangsung
4. Tampilkan pesan error yang ramah dan **tidak membocorkan informasi** — gunakan "Email atau password salah", bukan "Email tidak terdaftar"
5. Sediakan tautan navigasi antar kedua layar

**Output:** Dua layar autentikasi.

**Selesai jika:** Registrasi membuat user baru di Supabase, dan login mengembalikan sesi yang valid.

---

### FE-1.3 — Routing Terproteksi

**Tujuan:** User yang belum masuk tidak dapat mengakses layar berisi data.

**Butuh:** BE-2.3

**Langkah:**
1. Di `app/_layout.tsx`, panggil `initialize()` dan tampilkan splash screen selama `isInitialized` masih false
2. Terapkan pengalihan:
   - Belum login dan mencoba akses grup `(tabs)` → arahkan ke `/login`
   - Sudah login dan berada di grup `(auth)` → arahkan ke `/(tabs)`
3. Verifikasi sesi dengan memanggil `GET /api/v1/me` saat aplikasi dibuka

**Output:** Layout root dengan logika proteksi rute.

**Selesai jika:** Mengakses rute terproteksi tanpa sesi selalu berakhir di halaman login.

---

### FE-1.4 — Penanganan Token & Session

**Tujuan:** Sesi bertahan dengan aman dan pulih otomatis saat token kedaluwarsa.

**Butuh:** BE-2.2

**Langkah:**
1. Pastikan seluruh token tersimpan melalui `expo-secure-store`
2. Verifikasi refresh token berjalan otomatis sebelum kedaluwarsa
3. Uji skenario token kedaluwarsa: aplikasi harus melakukan refresh secara diam-diam, tanpa mengganggu user
4. Uji skenario refresh gagal: aplikasi mengarahkan ke login dengan pesan yang jelas
5. `signOut` harus menghapus token dari secure storage **dan** membersihkan seluruh cache TanStack Query

**Output:** Modifikasi pada `authStore` dan `client.ts`

**Selesai jika:** Sesi bertahan setelah aplikasi ditutup, dan pembersihan saat logout benar-benar menyeluruh.

---

# FASE 2 — Kerangka Aplikasi

> **Tujuan fase:** navigasi dan penanganan state jaringan siap. Fase ini yang menentukan apakah aplikasi terasa profesional atau tidak.

---

### FE-2.1 — Navigasi Tab

**Tujuan:** Struktur navigasi utama aplikasi.

**Langkah:**
1. Buat `app/(tabs)/_layout.tsx` dengan empat tab:
   - **Hari Ini** (`index.tsx`) — dashboard
   - **Kalender** (`calendar.tsx`)
   - **Insight** (`insights.tsx`)
   - **Pengaturan** (`settings.tsx`)
2. Gunakan ikon yang jelas dan label berbahasa Indonesia
3. Warna tab aktif mengikuti design token

**Output:** Layout tab beserta empat layar kosong.

**Selesai jika:** Navigasi antar tab berjalan mulus pada mode terang dan gelap.

---

### FE-2.2 — Komponen Feedback State

**Tujuan:** Aplikasi selalu punya jawaban visual untuk setiap kondisi. **Ini task terpenting untuk membuat aplikasi terasa production-grade.**

**Langkah:**

Buat komponen di `src/components/feedback/`:

| Komponen | Kapan Dipakai |
|---|---|
| `LoadingState` | Menerima prop `message`. Setelah 5 detik, otomatis mengganti pesan menjadi "Menghubungkan ke server, mohon tunggu sebentar…" |
| `ErrorState` | Menampilkan pesan ramah beserta tombol coba lagi |
| `EmptyState` | Menampilkan ilustrasi, penjelasan, dan ajakan tindakan |
| `OfflineBanner` | Banner persisten saat perangkat tidak terhubung internet |
| `ServerPausedState` | Kondisi khusus saat backend atau Supabase tidak dapat dijangkau, disertai penjelasan dan panduan tindakan |

**Ketentuan penting untuk `LoadingState`:**

Cold start Render membutuhkan 30–60 detik. Spinner tanpa konteks akan membuat user mengira aplikasi rusak. Karena itu:
- 0–5 detik: spinner biasa
- 5–15 detik: "Menghubungkan ke server…"
- Lebih dari 15 detik: "Server sedang aktif kembali, ini biasanya butuh waktu hingga satu menit"

Ini mengubah keterbatasan free tier menjadi pengalaman yang terkendali dan jujur kepada user.

**Output:** Lima komponen feedback.

**Selesai jika:** Setiap komponen dapat dirender terpisah, dan `LoadingState` benar-benar mengubah pesannya seiring waktu.

---

### FE-2.3 — Setup TanStack Query

**Tujuan:** Pengambilan data yang konsisten, dengan cache dan retry yang terkendali.

**Langkah:**
1. Setup `QueryClientProvider` di layout root
2. Konfigurasi default:
   - `staleTime`: 5 menit (data siklus tidak berubah cepat)
   - `retry`: 2 kali, dengan exponential backoff
   - `refetchOnWindowFocus`: dinonaktifkan (kurang relevan di mobile dan memboroskan kuota)
3. Tetapkan konvensi query key:
   ```
   ['cycles']
   ['cycles', 'prediction']
   ['daily-logs', from, to]
   ['insights', 'summary']
   ['symptoms']
   ```
4. Buat helper untuk melakukan invalidasi terkait setelah operasi tulis

**Output:** `src/api/queryClient.ts`, konvensi query key terdokumentasi.

**Selesai jika:** Query berhasil di-cache dan invalidasi berjalan setelah mutasi.

---

### FE-2.4 — Deteksi Jaringan

**Tujuan:** Aplikasi mengetahui kondisi konektivitasnya dan bersikap sesuai.

**Langkah:**
1. Pasang `@react-native-community/netinfo`
2. Buat hook `useNetworkStatus()`
3. Tampilkan `OfflineBanner` secara global saat perangkat offline
4. Saat offline, nonaktifkan tombol yang memicu operasi tulis dan berikan penjelasan singkat

**Ketentuan:** karena arsitektur kita cloud-only (lihat ADR-002 di PRD), kondisi offline harus dikomunikasikan dengan jujur. Jangan menampilkan form yang seolah bisa disimpan padahal akan gagal.

**Output:** `src/hooks/useNetworkStatus.ts`, integrasi banner global.

**Selesai jika:** Mengaktifkan mode pesawat memunculkan banner, dan aksi tulis dinonaktifkan dengan penjelasan.

---

# FASE 3 — Core Tracking

> **Tujuan fase:** aplikasi mulai berguna secara nyata.

---

### FE-3.1 — Tampilan Kalender

**Tujuan:** Representasi visual siklus yang langsung dapat dipahami.

**Butuh:** BE-3.5

**Langkah:**
1. Pasang `react-native-calendars` di `app/(tabs)/calendar.tsx`
2. Ambil log harian **langsung dari Supabase** (read sederhana, sesuai aturan arsitektur)
3. Terapkan penanda visual:

| Kondisi | Tampilan |
|---|---|
| Hari menstruasi tercatat | Latar penuh, warna `menstrual` |
| Prediksi menstruasi | Garis putus-putus, warna `predicted` |
| Jendela subur | Latar dengan opacity rendah, warna `ovulation` |
| Hari dengan log gejala | Titik kecil di bawah tanggal |
| Hari ini | Cincin pembatas |

4. Sediakan legenda yang menjelaskan seluruh penanda
5. Menekan sebuah tanggal membuka layar detail hari tersebut

**Output:** `app/(tabs)/calendar.tsx`, `src/components/calendar/`

**Selesai jika:** Kalender menampilkan data asli dengan penanda yang benar, dan legenda tersedia.

---

### FE-3.2 — Alur Pencatatan Menstruasi

**Tujuan:** Menandai awal dan akhir menstruasi dengan interaksi seminimal mungkin.

**Butuh:** BE-3.4

**Langkah:**
1. Sediakan tombol utama di dashboard: "Menstruasi dimulai hari ini"
2. Dari kalender, menekan tanggal membuka opsi "Tandai sebagai awal menstruasi"
3. Panggil `POST /api/v1/cycles` melalui Go API
4. Tangani error `CYCLE_OVERLAP` (409) dengan pesan yang jelas dan solutif
5. Setelah berhasil, invalidasi query `['cycles']` dan `['cycles', 'prediction']`
6. Sediakan alur untuk menandai akhir menstruasi
7. Tampilkan konfirmasi sebelum menyimpan, karena aksi ini memengaruhi seluruh prediksi

**Output:** `src/hooks/useCycle.ts`, komponen alur pencatatan.

**Selesai jika:** Pencatatan berhasil, kalender langsung diperbarui, dan kasus tumpang tindih tertangani dengan baik.

---

### FE-3.3 — Layar Log Harian

**Tujuan:** Pencatatan kondisi harian yang cepat, sesuai target G1 di PRD (selesai dalam ≤ 3 tap).

**Butuh:** BE-3.5

**Langkah:**
1. Buat `app/log/[date].tsx`
2. Susunan antarmuka dari atas ke bawah:
   - Tanggal dan hari siklus
   - Pilihan intensitas flow (tiga tombol besar)
   - Pilihan mood (baris chip)
   - Pilihan gejala (grid chip, multi-pilih)
   - Catatan bebas (dapat diperluas, batas 500 karakter dengan penghitung)
3. **Simpan otomatis** setiap kali ada perubahan, dengan debounce 800 ms — hindari tombol simpan yang harus ditekan manual
4. Tampilkan indikator "Tersimpan" yang halus setelah berhasil
5. Terapkan optimistic update agar antarmuka terasa responsif
6. Sediakan opsi hapus log

**Output:** `app/log/[date].tsx`, `src/hooks/useDailyLog.ts`

**Selesai jika:** Mencatat flow dan satu gejala dapat diselesaikan dalam tiga sentuhan, dan data tersimpan tanpa aksi eksplisit.

---

### FE-3.4 — Pemilih Gejala & Tag Kustom

**Tujuan:** Pemilihan gejala yang cepat, dengan kemampuan menambah kategori sendiri.

**Butuh:** BE-1.4, BE-3.6

**Langkah:**
1. Ambil daftar gejala langsung dari Supabase, gabungkan preset dan tag kustom
2. Kelompokkan berdasarkan kategori: fisik dan emosional
3. Tampilkan gejala yang paling sering dipakai user di bagian paling atas
4. Sediakan tombol "Tambah gejala lain" yang membuka input untuk tag kustom
5. Buat tag kustom melalui `POST /api/v1/symptoms`
6. Sediakan pengelolaan tag kustom (hapus) di halaman pengaturan

**Output:** `src/components/SymptomSelector.tsx`

**Selesai jika:** Gejala preset tampil, tag kustom dapat dibuat dan langsung muncul di daftar pilihan.

---

### FE-3.5 — Dashboard "Hari Ini"

**Tujuan:** Layar pertama yang menjawab pertanyaan utama user: "Saya sedang di fase apa?"

**Butuh:** BE-4.2

**Langkah:**

Susunan `app/(tabs)/index.tsx` dari atas ke bawah:

1. **Kartu utama** — hari ke berapa dalam siklus, fase saat ini, dan hitungan mundur menuju menstruasi berikutnya
2. **Aksi cepat** — tombol "Menstruasi dimulai" atau "Catat hari ini"
3. **Ringkasan log hari ini** — jika sudah ada, tampilkan sekilas dengan opsi ubah
4. **Widget wellness** — dikerjakan pada FE-7.1
5. **Tingkat keyakinan prediksi** — jika `low`, tampilkan penjelasan singkat bahwa akurasi akan meningkat seiring bertambahnya data

**Ketentuan penting — penanganan cold start:**

Terapkan pemuatan bertahap:
- Data dari Supabase (log hari ini) tampil **lebih dulu** karena cepat
- Data prediksi dari Go API menyusul, dengan skeleton pada bagiannya saja
- Layar **tidak boleh** kosong menunggu Go API selesai

**Output:** `app/(tabs)/index.tsx`

**Selesai jika:** Dashboard menampilkan sesuatu yang berguna dalam waktu kurang dari 1 detik, meskipun backend sedang cold start.

---

# FASE 4 — Tampilan Prediksi

---

### FE-4.1 — Overlay Prediksi di Kalender

**Tujuan:** User dapat melihat perkiraan siklus berikutnya, dengan pembeda yang jelas dari data aktual.

**Butuh:** BE-4.2

**Langkah:**
1. Ambil data dari `GET /api/v1/cycles/prediction`
2. Gambarkan pada kalender:
   - Prediksi menstruasi berikutnya
   - Perkiraan hari ovulasi
   - Jendela subur
3. **Wajib:** gaya visual prediksi harus jelas berbeda dari data aktual (garis putus-putus atau opacity lebih rendah)
4. Perbarui otomatis setelah ada pencatatan siklus baru

**Output:** Integrasi prediksi pada komponen kalender.

**Selesai jika:** Prediksi tampil dan secara visual tidak mungkin tertukar dengan data yang benar-benar tercatat.

---

### FE-4.2 — Indikator Fase & Tingkat Keyakinan

**Tujuan:** Menyampaikan tingkat kepercayaan prediksi secara jujur.

**Butuh:** BE-4.2

**Langkah:**
1. Tampilkan fase saat ini dengan warna sesuai design token
2. Tampilkan lencana tingkat keyakinan:

| Tingkat | Teks yang ditampilkan |
|---|---|
| `low` | "Perkiraan awal — akurasi meningkat setelah beberapa siklus tercatat" |
| `medium` | "Perkiraan cukup akurat" |
| `high` | "Perkiraan akurat berdasarkan siklus yang teratur" |

3. Sediakan penjelasan singkat yang dapat dibuka mengenai cara perhitungan dilakukan
4. **Wajib:** tampilkan disclaimer bahwa prediksi bukan alat kontrasepsi

**Output:** `src/components/PhaseIndicator.tsx`, `src/components/ConfidenceBadge.tsx`

**Selesai jika:** Tingkat keyakinan tampil sesuai data dan disclaimer terlihat jelas.

---

# FASE 5 — Notifikasi

---

### FE-5.1 — Alur Izin Notifikasi

**Tujuan:** Mendapatkan izin notifikasi tanpa mengganggu user di momen yang salah.

**Langkah:**
1. **Jangan** meminta izin saat aplikasi pertama kali dibuka
2. Minta izin ketika user pertama kali mengaktifkan reminder di halaman pengaturan, atau setelah siklus pertama berhasil dicatat
3. Tampilkan penjelasan kontekstual sebelum dialog sistem muncul
4. Tangani kondisi izin ditolak dengan menyediakan tautan ke pengaturan sistem

**Output:** `src/services/notification.ts`, `src/hooks/useNotificationPermission.ts`

**Selesai jika:** Izin diminta pada momen yang relevan, dan kondisi penolakan tertangani dengan baik.

---

### FE-5.2 — Penjadwal Notifikasi

**Tujuan:** Reminder muncul tepat waktu, sepenuhnya dari sisi perangkat.

**Langkah:**
1. Implementasi fungsi di `src/services/notification.ts`:
   - `scheduleAll(prediction, settings)`
   - `cancelAll()`
   - `rescheduleAll(prediction, settings)`
2. Jenis notifikasi yang dijadwalkan:

| Jenis | Waktu | Isi pesan |
|---|---|---|
| Menstruasi H-2 | 2 hari sebelum prediksi, pukul 09.00 | "Perkiraan menstruasi dalam 2 hari" |
| Menstruasi H-1 | 1 hari sebelum prediksi, pukul 09.00 | "Perkiraan menstruasi besok" |
| Jendela subur | Hari pertama jendela subur, pukul 09.00 | "Jendela subur dimulai hari ini" |
| Obat | Harian, jam pilihan user | Pesan kustom |

3. **Ketentuan privasi:** judul notifikasi cukup "LLunara". Detail berada di badan pesan, agar tidak terlalu terbuka di lock screen

**Output:** `src/services/notification.ts`

**Selesai jika:** Notifikasi terjadwal muncul tepat waktu, termasuk saat perangkat dalam kondisi offline.

---

### FE-5.3 — Penjadwalan Ulang Otomatis

**Tujuan:** Notifikasi selalu selaras dengan prediksi terbaru.

**Butuh:** BE-4.3

**Langkah:**
1. Setelah setiap operasi tulis siklus berhasil, ambil objek `prediction` dari response
2. Panggil `rescheduleAll()` dengan data tersebut
3. Jalankan juga penjadwalan ulang saat aplikasi kembali aktif dari background, jika prediksi berubah
4. Buat hook `useNotificationSync()` yang menangani ini secara terpusat

**Alasan:** notifikasi lokal bersifat statis. Jika prediksi berubah tetapi jadwal tidak diperbarui, user akan menerima pengingat pada tanggal yang salah — ini merusak kepercayaan terhadap aplikasi.

**Output:** `src/hooks/useNotificationSync.ts`

**Selesai jika:** Mengubah tanggal siklus menghasilkan jadwal notifikasi baru, dan jadwal lama benar-benar dibatalkan.

---

### FE-5.4 — Pengaturan Reminder

**Tujuan:** User punya kendali penuh atas notifikasi yang diterimanya.

**Langkah:**
1. Buat bagian reminder di halaman pengaturan
2. Sediakan sakelar terpisah untuk tiap jenis reminder
3. Sediakan pemilih waktu untuk reminder obat
4. Tampilkan daftar notifikasi yang sedang terjadwal, untuk transparansi
5. Simpan preferensi di Supabase melalui Go API, agar tetap ada saat ganti perangkat

**Output:** `src/components/settings/ReminderSettings.tsx`

**Selesai jika:** Menonaktifkan sebuah reminder benar-benar membatalkan notifikasi terjadwalnya.

---

# FASE 6 — Insight & Analytics

---

### FE-6.1 — Fondasi Grafik

**Tujuan:** Komponen grafik yang konsisten dan dapat dipakai ulang.

**Langkah:**
1. Pasang `react-native-gifted-charts`
2. Buat pembungkus di `src/components/charts/`:
   - `LineChartCard` — untuk tren panjang siklus
   - `BarChartCard` — untuk frekuensi gejala
   - `StackedBarCard` — untuk distribusi per fase
3. Seluruh warna diambil dari design token dan mendukung dark mode
4. Setiap grafik menyediakan ringkasan teks alternatif untuk pembaca layar

**Output:** Komponen grafik di `src/components/charts/`

**Selesai jika:** Grafik dapat dirender dengan data contoh pada kedua mode warna.

---

### FE-6.2 — Halaman Ringkasan Insight

**Tujuan:** Statistik siklus yang mudah dipahami orang awam.

**Butuh:** BE-5.1

**Langkah:**
1. Bangun `app/(tabs)/insights.tsx`
2. Tampilkan kartu statistik: rata-rata siklus, terpendek, terpanjang, tingkat keteraturan
3. Tampilkan grafik tren panjang siklus
4. Setiap angka disertai penjelasan satu kalimat dalam bahasa awam
5. Jika `has_sufficient_data` bernilai false, tampilkan `EmptyState` yang menjelaskan berapa siklus lagi yang dibutuhkan

**Ketentuan:** gunakan bahasa netral. Hindari kata seperti "tidak normal" atau "bermasalah" — cukup "bervariasi" atau "belum teratur".

**Output:** `app/(tabs)/insights.tsx`

**Selesai jika:** Halaman menampilkan data asli dan menangani kondisi data minim dengan baik.

---

### FE-6.3 — Insight Gejala & Mood

**Tujuan:** Menunjukkan pola gejala dan mood terhadap fase siklus.

**Butuh:** BE-5.2, BE-5.3

**Langkah:**
1. Tampilkan gejala yang paling sering muncul dalam bentuk grafik batang
2. Tampilkan distribusi gejala per fase siklus
3. Tampilkan pola mood per fase
4. Sediakan pemilih rentang waktu: 3 bulan, 6 bulan, 1 tahun
5. Tampilkan `sample_size` agar user memahami dasar dari angka yang ditampilkan

**Ketentuan wajib:** seluruh kalimat bersifat deskriptif. Contoh yang tepat: "Kram paling sering kamu catat pada fase menstruasi." Contoh yang **tidak boleh**: "Kram kamu disebabkan oleh fase menstruasi."

**Output:** Komponen insight gejala dan mood.

**Selesai jika:** Kedua bagian menampilkan data asli dengan kalimat yang deskriptif.

---

# FASE 7 — Wellness, Export & Pengaturan

---

### FE-7.1 — Wellness Tracking

**Tujuan:** Pencatatan gaya hidup yang ringan dan tanpa tekanan.

**Butuh:** BE-6.1

**Langkah:**
1. Tambahkan widget wellness di dashboard:
   - Air minum: tombol tambah/kurang dengan tampilan hitungan
   - Tidur: input angka sederhana
   - Berat badan: input angka, tidak perlu diisi setiap hari
2. Setiap metrik dapat dinonaktifkan dari pengaturan
3. Sinkronkan melalui `POST /api/v1/wellness`

**Ketentuan wajib (mengacu PRD Bagian 4.5):**
- **Jangan** tampilkan target harian yang ditentukan sistem
- **Jangan** tampilkan mekanik streak atau pesan yang menyalahkan saat user melewatkan hari
- **Jangan** tampilkan indikator "ideal" atau evaluasi terhadap berat badan
- Aplikasi hanya mencatat; penilaian sepenuhnya milik user

**Output:** `src/components/wellness/`

**Selesai jika:** Ketiga metrik dapat dicatat, dapat dinonaktifkan, dan tidak ada satu pun elemen yang menghakimi.

---

### FE-7.2 — Export Laporan

**Tujuan:** User dapat mengeluarkan datanya, baik untuk dokter maupun sebagai cadangan pribadi.

**Butuh:** BE-6.3

**Langkah:**
1. Buat layar export di halaman pengaturan
2. Sediakan pilihan rentang waktu: 3 bulan, 6 bulan, 1 tahun, atau kustom
3. Sediakan pilihan format: PDF atau CSV
4. Panggil `POST /api/v1/export`, simpan file melalui `expo-file-system`
5. Buka share sheet menggunakan `expo-sharing`
6. Tampilkan indikator progres selama proses berlangsung

**Ketentuan:** sertakan catatan yang menjelaskan bahwa export juga berfungsi sebagai cadangan pribadi, mengingat tier gratis tidak menyediakan backup otomatis.

**Output:** `app/settings/export.tsx`

**Selesai jika:** File berhasil dibuat dan dapat dibagikan melalui aplikasi lain.

---

### FE-7.3 — Halaman Pengaturan

**Tujuan:** Seluruh preferensi terkumpul di satu tempat.

**Langkah:**

Susun `app/(tabs)/settings.tsx` dengan bagian berikut:

| Bagian | Isi |
|---|---|
| Profil | Nama tampilan, tahun lahir |
| Siklus | Panjang siklus dan durasi menstruasi default |
| Reminder | Tautan ke pengaturan reminder |
| Gejala | Kelola tag kustom |
| Wellness | Sakelar aktif/nonaktif tiap metrik |
| Tampilan | Mode terang, gelap, atau ikuti sistem |
| Keamanan | Kunci aplikasi |
| Data | Export, hapus akun |
| Tentang | Versi, disclaimer, tautan repository |

**Output:** `app/(tabs)/settings.tsx` beserta sub-layarnya.

**Selesai jika:** Seluruh pengaturan tersimpan dan bertahan setelah aplikasi dibuka kembali.

---

### FE-7.4 — Kunci Aplikasi

**Tujuan:** Lapisan perlindungan tambahan untuk data yang bersifat pribadi.

**Langkah:**
1. Pasang `expo-local-authentication`
2. Sediakan opsi kunci menggunakan biometrik atau PIN
3. Minta autentikasi saat aplikasi dibuka dan saat kembali dari background lebih dari 5 menit
4. Sediakan opsi menyembunyikan pratinjau layar saat aplikasi berada di app switcher
5. Fitur ini bersifat opsional, tidak aktif secara default

**Output:** `src/services/appLock.ts`, integrasi di layout root.

**Selesai jika:** Ketika kunci aktif, aplikasi meminta autentikasi sebelum menampilkan data apapun.

---

### FE-7.5 — Hapus Akun

**Tujuan:** User punya kendali penuh untuk menghapus seluruh datanya.

**Butuh:** BE-6.4

**Langkah:**
1. Sediakan menu hapus akun di bagian Data
2. Tampilkan dialog konfirmasi bertingkat:
   - Jelaskan bahwa tindakan ini permanen
   - Sarankan melakukan export terlebih dahulu
   - Minta user mengetikkan kata konfirmasi
3. Panggil `DELETE /api/v1/account`
4. Setelah berhasil, keluarkan user dan bersihkan seluruh penyimpanan lokal

**Output:** `app/settings/delete-account.tsx`

**Selesai jika:** Akun benar-benar terhapus dan aplikasi kembali ke kondisi awal.

---

# FASE 8 — Polish & Rilis

---

### FE-8.1 — Dark Mode & Aksesibilitas

**Tujuan:** Aplikasi nyaman dipakai oleh lebih banyak kondisi pengguna.

**Langkah:**
1. Audit seluruh layar pada mode gelap
2. Verifikasi rasio kontras memenuhi WCAG AA (minimal 4.5:1)
3. Pastikan seluruh elemen interaktif punya `accessibilityLabel`
4. Uji dengan pembaca layar (TalkBack atau VoiceOver)
5. Uji dengan pengaturan ukuran font sistem yang diperbesar
6. Pastikan area sentuh minimal 44×44 pt di seluruh aplikasi

**Output:** Perbaikan lintas layar.

**Selesai jika:** Seluruh layar lolos audit kontras dan dapat dinavigasi menggunakan pembaca layar.

---

### FE-8.2 — Onboarding

**Tujuan:** User baru memahami cara pakai dan batasan aplikasi sejak awal.

**Langkah:**
1. Buat alur onboarding tiga langkah setelah registrasi:
   - Selamat datang dan penjelasan singkat manfaat aplikasi
   - Input data awal: tanggal menstruasi terakhir, perkiraan panjang siklus
   - **Disclaimer medis** sesuai PRD Bagian 14, yang harus disetujui secara eksplisit
2. Simpan status penyelesaian onboarding di preferensi profil
3. Sediakan opsi melewati langkah input data, dengan pengingat bahwa prediksi akan kurang akurat

**Output:** `app/onboarding/`

**Selesai jika:** User baru melalui alur ini sekali, dan disclaimer wajib disetujui sebelum lanjut.

---

### FE-8.3 — Build EAS

**Tujuan:** Menghasilkan aplikasi yang dapat dipasang di perangkat nyata.

**Langkah:**
1. Konfigurasikan `eas.json` dengan profil `development`, `preview`, dan `production`
2. Lengkapi `app.json`: nama aplikasi, ikon, splash screen, `bundleIdentifier`, `package`
3. Jalankan build Android dengan profil `preview` untuk menghasilkan APK
4. Biarkan EAS mengelola keystore secara otomatis
5. Pasang APK di perangkat dan lakukan pengujian menyeluruh

**Catatan kuota:** tier gratis EAS menyediakan 15 build Android dan 15 build iOS per bulan. Gunakan dengan bijak — lakukan pengujian melalui Expo Go semaksimal mungkin sebelum melakukan build.

**Output:** File APK yang dapat dipasang.

**Selesai jika:** Aplikasi terpasang di perangkat fisik dan seluruh fitur berfungsi menggunakan backend production.

---

### FE-8.4 — Dokumentasi

**Tujuan:** Repository frontend dapat dipahami oleh orang lain.

**Langkah:**
1. `README.md` berisi:
   - Deskripsi project dan tangkapan layar
   - Tech stack beserta alasan pemilihannya
   - Cara menjalankan lokal
   - Variabel environment yang dibutuhkan
   - Tautan ke repository backend dan `PRD.md`
2. Sertakan aturan arsitektur (kapan memakai Supabase langsung, kapan memakai Go API)
3. Tambahkan tangkapan layar untuk layar-layar utama
4. Cantumkan catatan mengenai cold start dan bagaimana aplikasi menanganinya — ini justru poin yang menarik untuk portofolio

**Output:** `README.md` yang lengkap.

**Selesai jika:** Orang lain dapat menjalankan project ini hanya dengan mengikuti README.

---

## Ringkasan Urutan Eksekusi

```
FASE 0  Bootstrap       FE-0.1 → 0.2 → 0.3 → 0.4 → 0.5 → 0.6 → 0.7
FASE 1  Auth            FE-1.1 → 1.2 → 1.3 → 1.4
FASE 2  Kerangka        FE-2.1 → 2.2 → 2.3 → 2.4
FASE 3  Core Tracking   FE-3.1 → 3.2 → 3.3 → 3.4 → 3.5
FASE 4  Prediksi        FE-4.1 → 4.2
FASE 5  Notifikasi      FE-5.1 → 5.2 → 5.3 → 5.4
FASE 6  Insight         FE-6.1 → 6.2 → 6.3
FASE 7  Wellness/Export FE-7.1 → 7.2 → 7.3 → 7.4 → 7.5
FASE 8  Polish          FE-8.1 → 8.2 → 8.3 → 8.4
```

## Urutan Kerja Gabungan yang Direkomendasikan

Karena dikerjakan seorang diri, kerjakan secara bergantian mengikuti urutan berikut:

```
 1. BE Fase 0  →  FE Fase 0        (pipeline terhubung ujung ke ujung)
 2. BE Fase 1                       (database siap)
 3. BE Fase 2  →  FE Fase 1        (autentikasi berfungsi)
 4. FE Fase 2                       (kerangka aplikasi)
 5. BE Fase 3  →  FE Fase 3        (pencatatan berfungsi)
 6. BE Fase 4  →  FE Fase 4        (prediksi tampil)
 7. FE Fase 5                       (notifikasi)
 8. BE Fase 5  →  FE Fase 6        (insight)
 9. BE Fase 6  →  FE Fase 7        (wellness, export, akun)
10. BE Fase 7  →  FE Fase 8        (hardening dan rilis)
```

**Alasan urutan ini:** setiap kali sebuah fase backend selesai, langsung dilanjutkan dengan fase frontend yang memakainya. Dengan begitu kamu selalu punya sesuatu yang bisa dilihat dan diuji, bukan menumpuk backend selama berminggu-minggu tanpa antarmuka.
