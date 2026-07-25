# DESIGN.md — LLunara

**Design system & prompt untuk AI design tool (Stitch), lalu dilanjutkan di Figma.**

Konsep: **Human Interface (ketenangan) + Illustrative & Gamified UI (fun & happy).**
LLunara harus terasa seperti *safe space* yang menyegarkan dan menemani, bukan kalender medis yang kaku. Wanita menghadapi siklus, PMS, kram, dan perubahan hormon yang melelahkan — aplikasi ini hadir sebagai teman yang hangat, lucu, dan menenangkan.

Struktur dokumen:
- **Bagian A** — Design system lengkap (jadi acuan tetap saat implementasi kode)
- **Bagian B** — Prompt siap salin-tempel per layar untuk Stitch
- **Bagian C** — Panduan membuat aset & maskot, plus alur kerja Stitch → Figma → Claude

> **Catatan Stitch:** tempelkan **Prompt Global (B.0)** dulu di awal sesi, lalu kirim prompt per layar satu per satu. Prompt ditulis dalam bahasa Inggris karena Stitch memberi hasil terbaik dengan bahasa Inggris, tetapi seluruh teks antarmuka yang diminta tetap **Bahasa Indonesia**.

---

# BAGIAN A — Design System

## A.1 Arah Desain

Dua rasa yang digabung:

| Lapisan | Peran | Wujud |
|---|---|---|
| **Human Interface** | Ketenangan, kelapangan, rasa aman | Banyak ruang kosong, sudut membulat, warna lembut, tipografi ramah |
| **Illustrative & Gamified** | Fun, happy, personal | Maskot ekspresif, ilustrasi menggemaskan, reward yang menyenangkan |

Kuncinya adalah **keseimbangan**: ilustrasi dan maskot memberi kehangatan, tapi tata letak tetap lapang dan tenang. Lucu tapi tidak ramai. Ceria tapi tidak berisik.

**Prinsip yang dipegang:**

| Prinsip | Penerapan |
|---|---|
| Maskot adalah teman, bukan pengawas | Maskot menghibur dan menemani, tidak pernah menghakimi atau menuntut |
| Ruang kosong tetap dijaga | Ilustrasi diberi ruang bernapas, tidak menempel rapat |
| Gamifikasi hanya memberi, tidak mengambil | Reward saat hadir, tapi tidak ada hukuman saat absen |
| Warna lembut membawa emosi | Palet pastel yang hangat, bukan neon yang meletup |
| Empati di momen sulit | Saat PMS/kram, UI berubah lebih lembut dan menenangkan |

**Referensi rasa:** kehangatan Finch (self-care), keceriaan Duolingo (tanpa tekanannya), kelembutan Flo, dengan maskot bergaya *kawaii* yang bulat dan empuk seperti Nailong, Molang, atau Sanrio — tapi **karakter orisinal milik LLunara sendiri**.

### Prinsip gamifikasi yang aman (penting)

Karena ini aplikasi kesehatan yang dipakai justru di hari-hari melelahkan, gamifikasi dirancang dengan aturan tegas:

- **Beri reward untuk kehadiran, jangan hukum ketidakhadiran.** Bolong mencatat sehari tidak boleh mereset apa pun secara menyakitkan atau memunculkan pesan bersalah.
- **Tidak ada streak yang mempermalukan.** Kalaupun ada penanda konsistensi, wujudnya lembut dan bisa "dijeda", bukan angka yang runtuh ke nol dengan dramatis.
- **Maskot tetap ramah saat user pergi lama.** Saat dibuka kembali setelah lama, maskot menyambut dengan senang ("Senang kamu kembali"), bukan merajuk atau menyalahkan.
- **Momen sulit direspons dengan empati, bukan tugas.** Saat user mencatat kram atau mood buruk, sistem menawarkan kenyamanan, bukan memberi tantangan baru.

Ini bukan mengurangi keseruan — ini membuat keseruannya cocok untuk konteks kesehatan wanita. Justru inilah yang membedakan "gamifikasi yang matang" dari "gamifikasi yang bikin capek".

### Yang harus dihindari

- Warna neon atau terlalu jenuh yang membuat mata lelah
- Layout yang terlalu padat oleh stiker/ilustrasi
- Maskot yang meniru IP milik orang lain (Nailong, Sanrio, dll — jadikan inspirasi rasa, bukan disalin)
- Elemen gamifikasi yang menekan: hitungan streak yang runtuh, notifikasi menyalahkan, meteran "gagal"
- Bahasa yang menghakimi tubuh atau menilai "normal/tidak normal"

---

## A.2 Maskot — "Luna"

Nama LLunara berakar dari *luna* (bulan), dan siklus perempuan sering dikaitkan dengan siklus bulan. Maskotnya adalah makhluk bulan yang menggemaskan.

**Konsep karakter:**

| Aspek | Deskripsi |
|---|---|
| **Nama** | Luna |
| **Wujud** | Makhluk bulat empuk seperti marshmallow, berwarna krem keputihan dengan semburat merah muda di pipi. Bentuknya seperti bulan sabit yang menggemuk — sederhana, mudah diingat |
| **Mata** | Dua titik besar yang ramah, kadang berbinar |
| **Pipi** | Selalu ada rona merah muda lembut |
| **Detail khas** | Sedikit "poni" seperti awan kecil di atas kepala, atau bintik bintang kecil di dekatnya |
| **Kepribadian** | Lembut, hangat, sabar, sedikit jenaka. Seperti teman yang selalu ada tanpa menghakimi |

**Ekspresi Luna dipetakan ke keadaan (ini yang membuatnya hidup):**

| Keadaan | Ekspresi Luna |
|---|---|
| Hari biasa (folikular) | Tersenyum tenang, sedikit melayang |
| Masa subur (ovulasi) | Ceria, mata berbinar, ada kilau kecil di sekitarnya |
| Menjelang menstruasi (luteal) | Ekspresi lembut, memeluk bantal kecil |
| Hari menstruasi | Meringkuk nyaman dengan botol air hangat, eksphresi tenang dan "ditemani" |
| Mencatat mood buruk / kram | Ekspresi berempati, menyodorkan secangkir teh hangat |
| Empty state / belum ada data | Mengantuk, tidur dengan gelembung "zzz" |
| Kembali setelah lama absen | Melambai gembira, "senang kamu kembali" |
| Reward / pencapaian lembut | Mengangkat bintang kecil, ekspresi bangga yang hangat |

**Aturan maskot:**
- Luna hadir di momen yang tepat, bukan di setiap sudut layar — supaya tetap terasa spesial
- Luna tidak pernah memasang ekspresi kecewa, marah, atau menyalahkan kepada user
- Gaya gambar konsisten: garis lembut, tanpa outline tajam, warna flat dengan sedikit gradasi halus

---

## A.3 Palet Warna

Pastel hangat, lembut, menenangkan. Merah muda tetap jadi jangkar, tapi ditemani warna pendukung yang membuat suasana ceria tanpa berlebihan.

### Mode Terang

| Token | Hex | Penggunaan |
|---|---|---|
| `background` | `#FFF6F4` | Latar utama, krem merah muda hangat |
| `surface` | `#FFFFFF` | Kartu, sheet |
| `surfaceMuted` | `#FDECEF` | Bagian sekunder, chip nonaktif |
| `border` | `#F6DFE2` | Garis pemisah halus (1px) |
| `text` | `#4A3B42` | Teks utama, cokelat lembut (bukan hitam pekat, agar hangat) |
| `textMuted` | `#9B8890` | Teks sekunder |
| `primary` | `#F2789F` | Merah muda utama, ceria tapi tetap lembut |
| `primaryDeep` | `#D9578A` | Untuk teks di atas latar terang, agar kontras cukup |
| `primarySoft` | `#FCE1EA` | Latar chip terpilih, sorotan |
| `accentPeach` | `#FFB088` | Aksen hangat, ilustrasi |
| `accentLavender` | `#B9A6E8` | Aksen sejuk, fase ovulasi |
| `accentMint` | `#8FD4C1` | Aksen segar, konfirmasi/wellness |
| `accentButter` | `#FFD98E` | Aksen ceria, reward/bintang |
| `danger` | `#E4756A` | Aksi merusak (versi lembut, tidak menakutkan) |

### Mode Gelap

| Token | Hex | Penggunaan |
|---|---|---|
| `background` | `#241A20` | Latar utama, ungu kecokelatan hangat |
| `surface` | `#2F2229` | Kartu |
| `surfaceMuted` | `#3A2B33` | Bagian sekunder |
| `border` | `#4A3742` | Garis pemisah |
| `text` | `#F7ECEF` | Teks utama |
| `textMuted` | `#BCA6AF` | Teks sekunder |
| `primary` | `#F58CAC` | Merah muda, sedikit lebih terang untuk latar gelap |
| `primarySoft` | `#432E39` | Sorotan |
| `accentPeach` | `#E8A07E` | Aksen hangat |
| `accentLavender` | `#A896D4` | Aksen sejuk |
| `accentMint` | `#7FC0AE` | Aksen segar |
| `accentButter` | `#E0C077` | Aksen ceria |
| `danger` | `#E4756A` | Error |

### Warna Fase Siklus

Tiap fase punya warna **dan** pendamping ilustrasi kecil, agar tidak bergantung pada warna saja.

| Fase | Warna Terang | Warna Gelap | Motif ilustrasi |
|---|---|---|---|
| Menstruasi | `#F2789F` | `#F58CAC` | Tetesan lembut / bulan penuh |
| Folikular | `#FFC4B0` | `#E8A07E` | Tunas kecil tumbuh |
| Ovulasi / masa subur | `#B9A6E8` | `#A896D4` | Bunga mekar / bintang |
| Luteal | `#FFD98E` | `#E0C077` | Bulan sabit / awan |
| Prediksi | Warna fase terkait, opacity 45% + garis putus-putus | sama | Kontur, bukan isi penuh |

### Aturan Kontras (tetap wajib meski gaya ceria)

- Rasio kontras teks minimal **4.5:1** (WCAG AA)
- Untuk teks di atas latar terang, gunakan `primaryDeep` (bukan `primary`) agar cukup kontras
- **Warna tidak boleh jadi satu-satunya pembawa makna** — selalu sertai label teks, ikon, atau ilustrasi fase

---

## A.4 Tipografi

Ramah dan membulat untuk kesan hangat, tapi tetap rapi dan terbaca.

| Peran | Font | Ukuran | Berat | Tinggi baris |
|---|---|---|---|---|
| Display | Baloo 2 (rounded) | 32 | 600 | 1.2 |
| Heading | Baloo 2 | 24 | 600 | 1.3 |
| Title | Plus Jakarta Sans | 20 | 700 | 1.4 |
| Subtitle | Plus Jakarta Sans | 17 | 600 | 1.4 |
| Body | Plus Jakarta Sans | 15 | 400 | 1.6 |
| Label | Plus Jakarta Sans | 13 | 500 | 1.4 |
| Caption | Plus Jakarta Sans | 12 | 400 | 1.4 |

**Alternatif rounded jika Baloo 2 tidak tersedia:** Fredoka, Quicksand, atau Nunito.
**Alternatif untuk Plus Jakarta Sans:** Nunito Sans atau DM Sans.

**Aturan:**
- Font rounded (Baloo 2) hanya untuk judul, angka besar, dan sapaan — memberi karakter ceria
- Isi konten tetap sans-serif yang tenang agar mudah dibaca
- Angka besar di dashboard boleh memakai font rounded untuk kesan playful yang hangat

---

## A.5 Spasi, Bentuk & Bayangan

**Skala spasi:** 4, 8, 12, 16, 24, 32, 48. Padding tepi layar: 20px.

**Radius sudut (lebih membulat dari biasa, untuk kesan empuk):**

| Elemen | Radius |
|---|---|
| Chip, pil | penuh (999) |
| Tombol | 18 |
| Input | 16 |
| Kartu | 24 |
| Bottom sheet | 32 (sudut atas saja) |

**Bayangan:** lembut dan berwarna, memberi kesan "melayang" yang ringan.
```
shadowColor: #F2789F
shadowOpacity: 0.10
shadowRadius: 20
shadowOffset: 0, 6
```

**Sentuhan playful yang diperbolehkan:**
- Kartu boleh punya sedikit efek "mengambang" saat ditekan (skala 0.98)
- Elemen reward boleh punya animasi kecil (bounce lembut)
- Transisi antar layar halus, tidak patah-patah

---

## A.6 Sistem Gamifikasi

Semua mekanik di sini mengikuti prinsip "positive-only" di A.1.

| Mekanik | Cara kerja | Batasan aman |
|---|---|---|
| **Taman Luna** | Setiap kali mencatat, sebuah tanaman/bunga kecil tumbuh di taman Luna. Taman makin semarak seiring waktu | Tanaman **tidak layu** saat user absen — hanya berhenti tumbuh, lalu lanjut lagi saat kembali |
| **Koleksi mood** | Mood yang dicatat mengumpulkan "stiker suasana" yang lucu di album | Murni koleksi, tanpa target yang harus dikejar |
| **Momen lembut** | Saat siklus tercatat lengkap, Luna memberi animasi kecil yang hangat | Perayaan, bukan syarat. Absen tidak memicu hukuman |
| **Penanda konsistensi** | Indikator lembut "kamu sudah mencatat X hari bulan ini" | Berbentuk progres yang tenang, bukan streak yang runtuh ke nol |
| **Sambutan hangat** | Saat kembali setelah lama, Luna menyambut gembira | Tidak pernah ada pesan merajuk atau menyalahkan |

**Prinsip:** gamifikasi di sini menambah kehangatan dan alasan untuk kembali, tapi user yang sedang lelah atau sakit tidak pernah dibuat merasa gagal.

---

## A.7 Komponen Inti

| Komponen | Ketentuan |
|---|---|
| **Tombol utama** | Latar `primary`, teks putih, tinggi 54, radius 18, lebar penuh. Sedikit bounce saat ditekan |
| **Tombol sekunder** | Latar `surface`, garis 1.5px `primary`, teks `primaryDeep` |
| **Tombol ghost** | Tanpa latar/garis, teks `primaryDeep` |
| **Chip** | Tinggi 40, radius penuh. Nonaktif: `surfaceMuted` + `textMuted`. Aktif: `primarySoft` + `primaryDeep` + garis 1.5px `primary`. Boleh ada ikon/emoji kecil di kiri |
| **Kartu** | Latar `surface`, radius 24, padding 20, bayangan lembut berwarna |
| **Input** | Tinggi 54, radius 16, garis 1.5px `border`, fokus: garis `primary` |
| **Bottom sheet** | Radius atas 32, garis genggam kecil di atas |
| **Kartu maskot** | Kartu dengan Luna di satu sisi dan teks sapaan di sisi lain |

**Area sentuh minimal 44×44 pt untuk seluruh elemen interaktif.**

---

# BAGIAN B — Prompt untuk Stitch

## B.0 Prompt Global

> Kirim ini **pertama** di awal sesi Stitch.

```
I'm designing a mobile app called LLunara — a menstrual cycle tracking and
personal wellness app for women. Use this exact design system for every screen.

CONCEPT
A blend of a calm "human interface" and a warm, illustrative, lightly gamified
UI. LLunara is a refreshing safe space, not a stiff medical calendar. Women
deal with tiring cycles, PMS, cramps, and hormonal shifts — so the app should
feel like a gentle, cute companion that comforts rather than instructs.
Cozy and playful, but still calm and spacious. Never loud or cluttered.

MASCOT — "Luna"
A cute round marshmallow-like moon creature: soft cream-white body with pink
blush cheeks, two big friendly dot eyes, a tiny cloud tuft on top, sometimes a
small star nearby. Gentle, warm, patient, slightly playful. Kawaii style with
soft lines, no harsh outlines, flat colors with subtle soft shading.
Luna appears at meaningful moments (greeting, empty states, comfort during
cramps/bad mood, gentle rewards) — never on every corner, and NEVER with a
disappointed, angry, or scolding expression. This is an original character,
not based on any existing IP.

STRICTLY AVOID
Neon or oversaturated colors. Cluttered sticker-heavy layouts. Copying existing
mascots. Punishing gamification (collapsing streaks, guilt messages, "failure"
meters). Any language that judges the user's body.

COLORS — LIGHT MODE
background      #FFF6F4   (warm pinkish cream)
surface         #FFFFFF
surfaceMuted    #FDECEF
border          #F6DFE2
text            #4A3B42   (soft warm brown, not harsh black)
textMuted       #9B8890
primary         #F2789F   (cheerful but soft pink)
primaryDeep     #D9578A   (for text on light backgrounds — better contrast)
primarySoft     #FCE1EA
accentPeach     #FFB088
accentLavender  #B9A6E8
accentMint      #8FD4C1
accentButter    #FFD98E
danger          #E4756A

CYCLE PHASE COLORS
menstrual   #F2789F  (soft drop / full moon motif)
follicular  #FFC4B0  (little sprout motif)
ovulation   #B9A6E8  (blooming flower / star motif)
luteal      #FFD98E  (crescent moon / cloud motif)
predicted   same hue at 45% opacity with a dashed outline

TYPOGRAPHY
Headings, big numbers, greetings: Baloo 2 (rounded), semibold.
Body, labels, buttons: Plus Jakarta Sans.
Display 32 / Heading 24 / Title 20 / Subtitle 17 / Body 15 / Label 13 / Caption 12.
Rounded font only for headings and hero numbers — never for body copy.

SHAPE AND SPACE
Spacing scale 4, 8, 12, 16, 24, 32, 48. Screen edge padding 20px.
Corner radius: chips fully rounded, buttons 18, inputs 16, cards 24,
bottom sheets 32 on top corners only. Generous whitespace — cozy, not crowded.
Shadows are soft and pink-tinted (10% opacity, 20px blur), giving a gentle
floating feel.

GAMIFICATION (positive-only)
Rewards presence, never punishes absence. A "Luna's garden" that grows as the
user logs but never wilts when they're away. Collectible mood stickers. Gentle
celebration animations. A calm consistency indicator, never a collapsing
streak. When the user returns after a long time, Luna welcomes them warmly.

ACCESSIBILITY
Minimum 4.5:1 text contrast (use primaryDeep for text on light backgrounds).
Minimum 44x44pt touch targets. Color is never the only carrier of meaning —
always pair it with a label, icon, or illustration.

LANGUAGE
All interface copy in Indonesian (Bahasa Indonesia). Warm, gentle, never
judgmental. Never diagnose, prescribe, or evaluate the user's body.

Confirm you have this system, then wait for my screen requests.
```

---

## B.1 Onboarding

```
Design a 4-screen onboarding flow for LLunara using the design system above.
Introduce the mascot Luna here so the app feels warm from the first second.

SCREEN 1 — Welcome
Centered, spacious. Luna floating happily in the middle, waving, with a small
star nearby. Rounded heading "Hai, aku Luna!". Body text: "Aku akan menemanimu
memahami siklus dan suasana hatimu, satu hari kecil demi kecil." Primary button
"Senang bertemu!". Ghost link "Lewati".

SCREEN 2 — What LLunara does
Three soft cards stacked, each with a small illustration on the left and text
on the right: a moon calendar icon "Catat siklus dengan mudah", a blooming
flower "Kenali pola tubuhmu", a cozy Luna with tea "Ruang aman di hari-hari
berat". Primary button "Lanjut".

SCREEN 3 — First cycle data
Luna peeking from a corner, cheering gently. Rounded heading "Kapan menstruasi
terakhirmu?". A compact month calendar to pick one date (selected date filled
#F2789F, white number). Below, a soft card with two stepper inputs, numbers in
rounded font: "Panjang siklus" default 28, "Durasi menstruasi" default 5, each
with round minus/plus buttons. Primary button "Lanjut". Ghost link "Aku belum
ingat".

SCREEN 4 — Gentle disclaimer
Luna sitting calmly beside a soft card. Rounded heading "Sebelum mulai". Card
text: "LLunara adalah teman pencatatan pribadimu. Prediksinya adalah perkiraan
dari datamu — bukan alat kontrasepsi, bukan diagnosis, dan bukan pengganti
konsultasi dokter." A checkbox row "Aku mengerti". Primary button "Mulai
bersama Luna" stays disabled until checked — show the disabled state.

Show all four screens side by side.
```

---

## B.2 Login & Register

```
Design the auth screens for LLunara using the design system above. Keep them
warm and simple, with a small Luna presence so they don't feel cold.

SCREEN 1 — Login
Top: small Luna waving next to the wordmark "LLunara" in Baloo 2 rounded 32px.
Muted subtitle "Senang kamu kembali!". Two inputs (54px tall, radius 16):
"Email" and "Kata sandi" with a show/hide eye icon. Primary button "Masuk".
Centered small text "Belum punya akun?" + "Daftar" link in #D9578A.

SCREEN 2 — Register
Same warmth. Subtitle "Ayo mulai perjalananmu". Inputs: "Email", "Kata sandi",
"Ulangi kata sandi", with caption "Minimal 8 karakter". Primary button "Daftar".

SCREEN 3 — Error state
Login screen with a gentle validation error: email input has a #E4756A border
and caption "Email atau kata sandi salah". Keep it soft — Luna still calm in
the corner, no alarming red banners.

Show all three side by side.
```

---

## B.3 Dashboard — "Hari Ini"

> Layar paling penting. Minta beberapa variasi.

```
Design the main dashboard for LLunara — the "Hari Ini" tab. This is the heart
of the app and the mascot's home base. Cozy, warm, spacious.

LAYOUT, top to bottom:

1. GREETING ROW
Rounded 20px greeting "Selamat pagi, Nadia" with a tiny sun/moon icon.
Muted 13px date "Selasa, 24 Juli" underneath.

2. LUNA HERO CARD (focal point)
A large rounded card (radius 24) with a soft pink-tinted shadow. On the left,
Luna in her current-phase expression (here: calm, gently floating, follicular).
On the right, text stacked:
- Small label "Hari ke-" in muted
- A big rounded number "9" (Baloo 2, 48px)
- A phase pill with a tiny sprout icon: "Fase folikular", soft #FFC4B0 bg
- One line: "Perkiraan menstruasi 19 hari lagi"
At the bottom of the card, a soft segmented progress bar in the four phase
colors at low saturation, with a small marker dot on today. The bar has fully
rounded ends.

3. PRIMARY ACTION
Full-width primary button with a small heart/drop icon: "Menstruasi dimulai
hari ini".

4. TODAY'S LOG CARD
Card titled "Catatan hari ini". Filled version: a row of cute chips
"Sedang", "Tenang", "Kram", each with a tiny icon, plus a ghost "Ubah" link.

5. LUNA'S GARDEN (gamification, gentle)
A wide short card titled "Taman Luna" showing a cozy little garden strip with a
few small plants/flowers that have grown from past logging, and Luna watering
one. Caption in muted 12px: "Tumbuh setiap kali kamu mencatat." NO progress
percentage, NO streak counter, NO wilting plants.

6. WELLNESS ROW
Three small rounded cards side by side, each with a cute thin-line icon in an
accent color, a rounded number, and a muted label: water drop "6" "gelas",
moon "7,5" "jam", a soft scale "—" "berat". No goals, no rings, no percentages.

Give me two layout variations of this screen.
```

---

## B.4 Kalender

```
Design the calendar screen for LLunara. Warm and readable, with phase motifs so
meaning never depends on color alone.

TOP
Month "Juli 2026" in Baloo 2 rounded 24px on the left, round chevron buttons on
the right. A tiny Luna peeking from the top corner is welcome.

CALENDAR GRID
Weekday headers in 12px muted. Date cells are 44x44pt rounded cells with cozy
spacing:
- Logged period day: solid #F2789F fill, white number, a tiny drop motif
- Predicted period day: transparent, 1.5px dashed #F2789F border, #D9578A number
- Fertile window: soft #B9A6E8 at 20% opacity, dark number
- Predicted ovulation day: soft lavender fill + a tiny flower/star motif
- Day with symptoms: a small dot below the number
- Today: 1.5px #F2789F ring
- Plain days: undecorated

LEGEND (required)
A wrapping legend below the grid: small swatch or motif + 12px label for
"Menstruasi", "Prediksi", "Masa subur", "Ada catatan".

BOTTOM SUMMARY CARD
Card "Siklus saat ini" with three stats in a row, rounded numbers + muted
captions: "9"/"hari berjalan", "28"/"rata-rata siklus", "5"/"rata-rata
menstruasi".

TAP STATE
A bottom sheet (radius 32 top, grab handle) with the selected date as a rounded
heading, the phase name with its motif, and two buttons: primary "Catat hari
ini", secondary "Tandai awal menstruasi". A small Luna in the sheet corner
matching the phase mood.
```

---

## B.5 Log Harian

```
Design the daily log screen for LLunara. It must feel fast and gentle — logging
in three taps or less. Luna reacts empathetically to what's logged.

HEADER
Round back chevron. Center: date "Selasa, 24 Juli" in rounded 20px, "Hari ke-9"
12px muted below. Right: a soft "Tersimpan" pill in #8FD4C1 with a check —
appears automatically because the screen autosaves. No save button.

SECTION 1 — Intensitas
Label "Intensitas". Three big rounded option cards (80px tall, radius 18):
"Ringan", "Sedang", "Berat", each with a soft drop motif that fills more across
the three. Show "Sedang" selected: #FCE1EA bg, 1.5px #F2789F border, #D9578A text.

SECTION 2 — Suasana hati
Label "Suasana hati". A horizontally scrolling row of cute chips, each with a
small face/emoji motif: "Senang", "Tenang", "Biasa", "Sensitif", "Cemas",
"Sedih", "Mudah marah". Single select. Show "Tenang" selected.

SECTION 3 — Gejala
Label "Gejala". A wrapping grid of multi-select chips in two groups. "Fisik":
"Kram", "Sakit kepala", "Nyeri payudara", "Kembung", "Jerawat", "Kelelahan",
"Nyeri punggung", "Mual". "Emosional": "Sulit tidur", "Nafsu makan berubah".
Show "Kram" and "Kelelahan" selected. End with a dashed chip + plus icon:
"Tambah lain".

LUNA EMPATHY MOMENT
Because "Kram" is selected, show a soft inline card near the bottom: Luna
offering a cup of tea, with gentle text "Semoga kramnya cepat reda. Istirahat
ya." This is comfort, not a task — no button required.

SECTION 4 — Catatan
Label "Catatan". A multiline text area (radius 16, min 100px), placeholder
"Tulis apa pun yang ingin kamu ingat…", char counter "0/500" bottom-right.

Bottom: ghost button in #E4756A "Hapus catatan hari ini".
```

---

## B.6 Insight

```
Design the insights screen for LLunara. Descriptive and neutral in tone, but
warm and illustrated — charts feel friendly, not clinical.

HEADER
"Insight" in Baloo 2 rounded 24px, small Luna with a magnifying glass beside it.
Below, a pill range selector "3 bulan" / "6 bulan" / "1 tahun", "6 bulan"
selected with #FCE1EA bg.

SECTION 1 — Ringkasan siklus
A 2x2 grid of soft stat cards, each a rounded number (28px) + 13px muted label:
"28"/"rata-rata siklus", "26–31"/"rentang siklus", "5"/"rata-rata menstruasi",
"Cukup teratur"/"keteraturan".

SECTION 2 — Tren panjang siklus
Card with a friendly line chart: single #F2789F line, 2.5px, gentle curve,
rounded dots. Very light gridlines, no border, no legend. Below: one plain
sentence "Panjang siklusmu cukup konsisten dalam 6 bulan terakhir."

SECTION 3 — Gejala paling sering
Card with a horizontal bar chart, rounded bars in #F2789F at 75% opacity, five
bars: Kram, Kelelahan, Kembung, Sakit kepala, Jerawat.

SECTION 4 — Gejala per fase
Card with a stacked horizontal bar chart using the four phase colors. Below:
"Kram paling sering kamu catat pada fase menstruasi." Muted caption
"Berdasarkan 47 catatan."

EMPTY STATE version
Luna sleeping with a "zzz" bubble, rounded heading "Belum cukup data", body
"Catat 2 siklus lagi untuk melihat pola siklusmu", secondary button "Ke
kalender".

Show both the filled screen and the empty state.
```

---

## B.7 Taman Luna (Layar Gamifikasi)

```
Design the "Taman Luna" screen for LLunara — the gentle gamification hub. It
must feel rewarding and cozy, and must NEVER punish or shame.

HEADER
"Taman Luna" in Baloo 2 rounded 24px. Muted subtitle "Tumbuh bersama setiap
catatanmu."

MAIN GARDEN
A large soft scene: a cozy little garden where Luna tends plants. Plants and
flowers of varying growth represent past logging over time. The scene is calm
and pastel, with a few accent-colored blooms (peach, lavender, mint, butter).
Luna is watering or resting among them, content.

COLLECTION STRIP — "Stiker suasana"
Below the garden, a horizontally scrolling row of collected cute mood stickers
(small round illustrations), some filled (collected) and some as soft dashed
placeholders (not yet collected). Caption "Kumpulkan suasana harimu." No
counter that shames missing ones — placeholders look inviting, not like failure.

GENTLE CONSISTENCY CARD
A soft card: "Bulan ini kamu sudah mencatat 12 hari" with a calm rounded
progress arc (not a number that resets to zero). Small warm text from Luna:
"Setiap hari kecil berarti. Tidak apa-apa kalau ada yang terlewat."

Absolutely no collapsing streaks, no red warnings, no guilt language anywhere.
```

---

## B.8 Loading & Error States

> Backend free tier bisa "tidur", request pertama sampai 60 detik. Buat momen ini terasa hangat, bukan rusak.

```
Design four connection-state screens for LLunara. The backend sleeps when idle,
so the first request can take up to 60 seconds. Make the wait feel warm and
intentional, with Luna keeping the user company.

SCREEN 1 — Loading, early (0–5s)
Centered Luna doing a slow, calm idle animation pose (gently floating). No text.
Lots of whitespace.

SCREEN 2 — Loading, extended (5–15s)
Same Luna, now with body text below in muted "Menghubungkan ke server…". Calm,
no percentages.

SCREEN 3 — Loading, long (over 15s)
Luna cozy with a cup of tea, patient. Text "Server sedang bangun, sebentar ya —
biasanya sampai satu menit." Caption 12px "Datamu aman." Reassuring, never
alarming.

SCREEN 4 — Error with retry
Luna holding a slightly tangled string of lights, gently confused but not sad.
Rounded heading "Tidak bisa terhubung". Body "Coba periksa koneksimu, lalu coba
lagi." Secondary button "Coba lagi".

OFFLINE BANNER
A slim full-width bar below the status bar, #FDECEF bg, 1px bottom border, a
tiny Luna face icon + 13px text "Kamu sedang offline". Quiet notice, not an alarm.

Show all four screens plus the banner.
```

---

## B.9 Pengaturan

```
Design the settings screen for LLunara. Orderly and calm, with soft rounded
cards. A tiny Luna at the top is welcome.

HEADER
"Pengaturan" in Baloo 2 rounded 24px.

Grouped sections. Each group: a 13px muted uppercase label above a white rounded
card (radius 24). Rows separated by 1px hairlines inset 20px on the left. Each
row 56px tall: a soft accent-colored thin-line icon, a label, and a chevron /
muted value / toggle on the right.

GROUP "PROFIL": Nama tampilan → "Nadia"; Tahun lahir → "1998"
GROUP "SIKLUS": Panjang siklus default → "28 hari"; Durasi menstruasi → "5 hari"
GROUP "PENGINGAT": Menstruasi akan datang → toggle on; Masa subur → toggle off;
Pengingat obat → toggle on + "09:00"; Kelola pengingat → chevron
GROUP "TAMPILAN": Tema → "Ikuti sistem"
GROUP "KEAMANAN": Kunci aplikasi → toggle off
GROUP "DATA": Ekspor data → chevron; Hapus akun → label in #E4756A + chevron
GROUP "TENTANG": Versi → "1.0.0"; Disclaimer → chevron

Active toggles use #F2789F. Keep every row calm and evenly spaced.
```

---

## B.10 Ekspor Laporan

```
Design the export screen for LLunara. Warm and simple.

Header: round back chevron, title "Ekspor data" in rounded 20px.
Intro muted text "Buat laporan untuk dibawa ke dokter, atau simpan sebagai
cadangan pribadi." A small Luna holding a document is welcome.

SECTION "Rentang waktu"
Four selectable rows in a card with radio indicators (#F2789F): "3 bulan
terakhir", "6 bulan terakhir", "1 tahun terakhir", "Pilih tanggal sendiri".
Show "6 bulan terakhir" selected.

SECTION "Format"
Two big rounded option cards side by side (100px tall) with a soft document
icon, title, caption: "PDF"/"Ringkasan untuk dokter", "CSV"/"Data mentah
lengkap". Show PDF selected (#FCE1EA bg, #F2789F border).

Bottom: primary button "Buat laporan", caption "Ekspor berkala juga berguna
sebagai cadangan datamu." In-progress state: disabled button with a small
spinner and "Menyiapkan laporan…".
```

---

## B.11 Style Sheet — Maskot, Ikon & Ilustrasi

```
Create a cohesive art style sheet for LLunara.

MASCOT LUNA — expression sheet
Draw Luna (the cream-white round moon creature with pink blush cheeks, big dot
eyes, tiny cloud tuft) in one consistent kawaii style across these expressions,
laid out as a grid:
1. Calm smile, gently floating (default / follicular)
2. Cheerful, sparkly eyes, small star nearby (ovulation)
3. Soft and cozy hugging a little pillow (luteal)
4. Curled up comfortably with a warm water bottle (period day)
5. Empathetic, offering a cup of tea (cramps / bad mood)
6. Sleepy, sleeping with a "zzz" bubble (empty state)
7. Waving happily (welcome back)
8. Proudly holding up a little star (gentle reward)
Keep the SAME character, proportions, and palette across all eight. Soft lines,
no harsh outlines, flat colors with subtle soft shading. Transparent background.

ICONS
Thin-line style, 1.5px stroke, rounded caps, 24x24 grid, gently rounded and
friendly (not sharp, not chunky). Needed: home, calendar, chart, garden/plant,
settings, water drop, moon, scale, bell, lock, document, share, plus, chevron,
close, check, info, heart, sprout, star, flower.

PHASE MOTIFS
Four tiny illustrated motifs, one per cycle phase, in the phase colors: a soft
drop / full moon (menstrual), a little sprout (follicular), a blooming flower /
star (ovulation), a crescent moon / cloud (luteal).

MOOD STICKERS
A set of small round collectible mood sticker illustrations matching the mood
options (senang, tenang, biasa, sensitif, cemas, sedih, mudah marah), cute and
expressive, same art style as Luna.

Present everything together as one style sheet on a soft #FFF6F4 background.
```

---

## B.12 App Icon & Splash

```
Design an app icon and splash screen for LLunara.

APP ICON
1024x1024. Soft vertical gradient from #FFF6F4 to #FCE1EA. Centered: Luna's
face (the round cream moon creature with pink blush cheeks and a tiny cloud
tuft), simple and adorable, instantly recognizable at 60x60. A tiny star accent
is welcome. No text in the icon. Warm, cute, memorable.

SPLASH SCREEN
Solid #FFF6F4 background. Luna floating gently in the center at ~96x96, with the
wordmark "LLunara" in Baloo 2 rounded 24px just below in #4A3B42. Nothing else.
```

---

## B.13 Checklist Setelah Generate

- [ ] Suasana terasa hangat & menyenangkan, tapi tetap lapang (tidak ramai)
- [ ] Luna konsisten di semua layar (bentuk, proporsi, warna sama)
- [ ] Luna tidak pernah tampil kecewa/marah/menyalahkan
- [ ] Prediksi jelas beda dari data aktual (garis putus-putus / opacity)
- [ ] Legenda kalender ada; tiap fase punya motif, bukan warna saja
- [ ] Taman Luna tidak punya tanaman layu / streak runtuh / bahasa bersalah
- [ ] Widget wellness tanpa target, persentase, atau ring
- [ ] Momen empati Luna muncul saat kram/mood buruk dicatat
- [ ] Teks insight deskriptif, bukan preskriptif
- [ ] Disclaimer medis tampil di onboarding
- [ ] Loading state punya 3 tingkat pesan + Luna menemani
- [ ] Semua teks Bahasa Indonesia
- [ ] Kontras teks 4.5:1 (pakai `primaryDeep` untuk teks di latar terang)
- [ ] Area sentuh minimal 44×44 pt

---

# BAGIAN C — Aset, Maskot & Alur Kerja

## C.1 Tantangan Utama: Konsistensi Karakter

Membuat satu gambar Luna itu mudah. Tantangan sebenarnya adalah membuat Luna **tetap sama** di 8 ekspresi berbeda, di ikon, dan di setiap empty state. Karakter yang berubah-ubah bentuk akan langsung terasa murahan. Jadi saat memilih tool, kriteria nomor satu bukan "yang paling lucu", tapi **"yang bisa menjaga karakter tetap konsisten across banyak pose"**.

## C.2 Rekomendasi Tool untuk Aset

Bagi aset menjadi dua jenis, karena tool terbaiknya berbeda:

**A. Maskot Luna (butuh konsistensi karakter)**

Untuk karakter yang sama di banyak pose, cari tool dengan fitur *character consistency* / *character reference*. Alur yang paling andal saat ini: buat **satu gambar master Luna** yang benar-benar kamu suka, lalu gunakan itu sebagai *reference image* untuk menghasilkan pose dan ekspresi lain, supaya karakternya terkunci.

Opsi yang layak dicoba (banyak punya free tier — cek dulu karena kuota sering berubah):
- Tool dengan fitur *character reference*/*consistency* eksplisit, yang bisa menjaga karakter across banyak gambar dari satu gambar acuan
- Generator bergaya *kawaii*/cartoon untuk eksplorasi awal
- Yang bisa *image-to-video* jika nanti kamu mau Luna beranimasi kecil di onboarding

Karena kamu sudah punya Claude di alur kerja, kamu juga bisa memakai fitur pembuatan gambar untuk mengeksplorasi konsep awal Luna sebelum menguncinya di tool khusus konsistensi.

**B. Ikon UI (butuh gaya seragam & format bersih)**

Untuk ikon antarmuka (home, kalender, dll), jangan pakai generator gambar — hasilnya sulit seragam dan formatnya berat. Lebih baik pakai **icon set siap pakai** yang gratis dan konsisten:
- Set ikon gratis populer bergaya rounded/thin-line yang bisa diwarnai sesuai palet kamu
- Pilih **satu** set saja untuk seluruh aplikasi, demi keseragaman

Ini juga sesuai dengan task FE-0.5 — ikon UI adalah komponen, bukan ilustrasi.

## C.3 Tips Memilih Tool (agar tidak boros waktu & uang)

- **Uji konsistensi dulu.** Sebelum jatuh cinta pada satu tool, minta 5 pose Luna yang sama. Kalau karakternya sudah berubah di pose ketiga, tool itu tidak cocok untuk maskot.
- **Cari export PNG transparan.** Wajib agar Luna bisa ditempel di atas UI apa pun.
- **Perhatikan lisensi & hak komersial**, terutama karena ini masuk portofolio publik.
- **Jangan meniru IP.** Nailong, Molang, Sanrio boleh jadi *inspirasi rasa* (bulat, empuk, pastel), tapi Luna harus orisinal — ini juga nilai plus di portofolio.
- **Cek free tier hari ini**, jangan andalkan info lama — kuota dan syarat kartu kredit sering berubah.

## C.4 Alur Kerja: Stitch → Figma → Claude

Rencana kamu sudah bagus. Ini urutan yang aku sarankan agar mulus:

1. **Kunci Luna lebih dulu.** Buat style sheet maskot (prompt B.11) sampai kamu benar-benar puas, sebelum menggenerate layar. Kalau layar digenerate sebelum Luna final, kamu akan mengulang banyak hal.
2. **Generate layar di Stitch** memakai Prompt Global (B.0) + prompt per layar. Untuk maskot di dalam layar, kamu bisa menyebut "Luna" — nanti diganti aset final di Figma.
3. **Bawa ke Figma.** Rapikan spacing, ganti placeholder maskot dengan aset Luna final (PNG transparan), samakan warna ke token di A.3.
4. **Hubungkan Claude ke Figma.** Untuk langkah ini kamu butuh Figma MCP connector. Aku bisa bantu cek dan menyiapkan koneksinya saat kamu sudah di tahap itu — tinggal bilang, nanti aku carikan connector yang tepat.
5. **Iterasi bareng Claude.** Setelah terhubung, aku bisa bantu audit konsistensi spacing, kontras, penerapan token, dan kesesuaian dengan aturan di dokumen ini.

## C.5 Konsistensi ke Kode

Setelah desain final:
1. Pindahkan seluruh warna, spasi, radius, tipografi ke `src/constants/theme.ts` (task **FE-0.4**)
2. Simpan aset Luna & motif fase di `assets/`, ikon UI sebagai satu set (task **FE-0.5**)
3. State koneksi B.8 → komponen di `src/components/feedback/` (task **FE-2.2**)
4. **Jangan** menyalin nilai warna langsung ke komponen — selalu lewat token
5. Pastikan tiap warna punya pasangan mode gelap sebelum komponen dianggap selesai
