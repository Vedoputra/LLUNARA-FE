# LLunara API Reference

Referensi seluruh endpoint backend LLunara (`llunara-be`) untuk kebutuhan integrasi FE mobile.

- **Base URL (production):** `https://llunara-be.vercel.app`
- **Base URL (local dev):** `http://localhost:8080`
- Semua endpoint bisnis berada di bawah prefix **`/api/v1`** dan **wajib** membawa header `Authorization`, kecuali `GET /health`.

Status: seluruh endpoint di bawah ini sudah diimplementasikan, diuji (unit test + integration test terhadap Supabase asli + E2E manual), dan live di production per 2026-07-25.

---

## Autentikasi

Backend **tidak** punya sistem login sendiri — autentikasi sepenuhnya didelegasikan ke **Supabase Auth**. Alur untuk FE:

1. FE login/register langsung ke Supabase Auth (pakai Supabase client SDK di sisi FE, dengan `SUPABASE_URL` + `SUPABASE_PUBLISHABLE_KEY`).
2. Supabase mengembalikan `access_token` (JWT, ditandatangani ES256).
3. Setiap request ke backend LLunara menyertakan token itu di header:

```
Authorization: Bearer <access_token>
```

4. Backend memverifikasi JWT terhadap JWKS Supabase (bukan tanda tangan HS256/shared secret) dan mengekstrak `user_id` dari klaim `sub`. Backend tidak pernah mempercayai `user_id` yang dikirim client secara eksplisit di body/query — selalu diambil dari token.

Kalau token tidak ada, salah format, atau tidak valid → `401 UNAUTHORIZED` (lihat format error di bawah).

**Penting:** token yang sama dipakai untuk semua endpoint. Tidak ada refresh-token endpoint di backend LLunara — refresh token ditangani langsung oleh Supabase client SDK di FE.

---

## Format Response

### Sukses

Hampir semua endpoint membungkus data dalam amplop `data`:

```json
{ "data": { ... } }
```

atau untuk list:

```json
{ "data": [ ... ] }
```

**Pengecualian (perlu diperhatikan FE):**
- `GET /api/v1/me` **tidak** memakai amplop `data` — responsnya langsung `{"user_id": "..."}`.
- `GET /health` juga tidak memakai amplop `data`.
- `POST /api/v1/export` mengembalikan **file binary** (CSV/PDF), bukan JSON sama sekali.
- Endpoint `DELETE` selalu `204 No Content` tanpa body.

### Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data yang dikirim tidak valid",
    "details": { "start_date": "harus format YYYY-MM-DD" }
  }
}
```

`details` bersifat opsional (bisa tidak ada tergantung jenis error).

### Kode Error

| Code | HTTP Status | Kapan muncul |
|---|---|---|
| `UNAUTHORIZED` | 401 | Token tidak ada / tidak valid / kedaluwarsa |
| `FORBIDDEN` | 403 | Mencoba mengubah/menghapus resource milik user lain, atau resource yang tidak boleh diubah (mis. preset symptom) |
| `NOT_FOUND` | 404 | Resource dengan ID tersebut tidak ada (atau bukan milik user) |
| `VALIDATION_ERROR` | 422 | Body/query request tidak valid |
| `CYCLE_OVERLAP` | 409 | `start_date` siklus baru bertumpuk dengan siklus yang sudah tercatat |
| `INSUFFICIENT_DATA` | 422 | Data belum cukup untuk operasi tertentu |
| `INTERNAL_ERROR` | 500 | Kesalahan tak terduga di server — pesan ke client selalu generik, detail asli hanya di log server |

Semua field tanggal di seluruh API menggunakan format **`YYYY-MM-DD`** (mis. `2026-01-15`), bukan ISO datetime — kecuali `created_at`/`updated_at` yang pakai RFC3339 (`2026-01-15T10:30:00Z`).

---

## Health Check

### `GET /health`

Tanpa autentikasi. Menyentuh database (bukan sekadar static JSON) — cocok untuk uptime monitor / keep-alive ping.

**Response 200:**
```json
{ "status": "ok", "version": "0.1.0", "timestamp": "2026-07-25T02:19:06Z" }
```

**Response 503** (database bermasalah): `"status": "degraded"`.

---

## Auth Test

### `GET /api/v1/me`

Membuktikan token valid dan mengembalikan `user_id` yang diekstrak backend dari JWT.

**Response 200 (tanpa amplop `data`):**
```json
{ "user_id": "460b7001-1287-4a11-89bc-3a2624fa02bc" }
```

---

## Cycles (Siklus Menstruasi)

### `POST /api/v1/cycles`

Mulai siklus baru (mencatat hari pertama menstruasi).

**Body:**
```json
{ "start_date": "2026-01-01" }
```
- `start_date`: wajib, format `YYYY-MM-DD`.

**Response 201:**
```json
{
  "data": {
    "cycle": {
      "id": "33bd50d8-fcce-4f93-8988-33da1b8e5012",
      "start_date": "2026-01-01",
      "end_date": null,
      "cycle_length": null,
      "period_length": null,
      "is_outlier": false,
      "created_at": "2026-07-25T02:19:27Z"
    },
    "prediction": { "...": "lihat GET /cycles/prediction di bawah" }
  }
}
```

Setiap kali menulis siklus (create/update), response **selalu** menyertakan prediksi terbaru sekaligus — FE tidak perlu request kedua untuk refresh prediksi.

**Errors khusus:** `422 VALIDATION_ERROR` (format tanggal salah), `409 CYCLE_OVERLAP` (tanggal bertumpuk dengan siklus lain yang sudah tercatat).

---

### `GET /api/v1/cycles`

Daftar riwayat siklus user, terbaru dulu (maks 100 entri, tidak ada paginasi query param saat ini).

**Response 200:**
```json
{ "data": [ { "id": "...", "start_date": "2026-01-01", "end_date": "2026-01-05", "cycle_length": 28, "period_length": 5, "is_outlier": false, "created_at": "..." } ] }
```

---

### `GET /api/v1/cycles/prediction`

Prediksi siklus berikutnya berdasarkan riwayat. **Selalu 200**, bahkan kalau user belum punya riwayat sama sekali (field-field jadi `null` dan `confidence: "low"`) — bukan error.

**Response 200:**
```json
{
  "data": {
    "next_period_start": "2026-01-29",
    "next_period_end": "2026-02-02",
    "estimated_ovulation": "2026-01-15",
    "fertile_window": { "start": "2026-01-10", "end": "2026-01-16" },
    "current_phase": "luteal",
    "day_of_cycle": 25,
    "confidence": "low",
    "based_on_cycles": 0,
    "average_cycle_length": 28
  }
}
```
- `current_phase`: salah satu dari `menstrual`, `follicular`, `ovulation`, `luteal`.
- `confidence`: `low`, `medium`, atau `high` — makin banyak & makin konsisten riwayat siklus, makin tinggi.

---

### `PATCH /api/v1/cycles/{id}`

Mencatat kapan menstruasi berakhir (`end_date`).

**Body:**
```json
{ "end_date": "2026-01-05" }
```

**Response 200:** sama shape-nya dengan `POST /cycles` (`cycle` + `prediction` terbaru).

**Errors:** `404 NOT_FOUND` jika `id` tidak ada / bukan milik user.

---

### `DELETE /api/v1/cycles/{id}`

**Response 204.** Errors: `404 NOT_FOUND`.

---

## Daily Logs (Catatan Harian)

### `POST /api/v1/daily-logs`

Upsert — kalau tanggal tersebut sudah ada catatannya, akan **ditimpa** (bukan merge) dengan field yang dikirim. Otomatis dikaitkan ke siklus yang sedang berjalan pada tanggal tersebut (`cycle_id`), kalau ada.

**Body:**
```json
{
  "date": "2026-01-01",
  "flow_intensity": "medium",
  "mood": "senang",
  "notes": "catatan bebas, maks 500 karakter",
  "symptom_ids": ["85296ca3-fdf6-423f-8e3d-e5e8fb3c1c78"]
}
```
- `date`: wajib.
- `flow_intensity`: opsional, salah satu dari `light`, `medium`, `heavy`.
- `mood`: opsional, string bebas.
- `notes`: opsional, maks 500 karakter.
- `symptom_ids`: opsional, array UUID (harus ID symptom yang valid — lihat `GET /symptoms`). Mengirim array ini akan **menggantikan seluruh** relasi gejala hari itu (bukan menambah).

**Response 200:**
```json
{
  "data": {
    "id": "30772e85-5a62-44fa-aa15-120a71bf8bf5",
    "date": "2026-01-01",
    "cycle_id": "33bd50d8-fcce-4f93-8988-33da1b8e5012",
    "flow_intensity": "medium",
    "mood": "senang",
    "notes": "catatan e2e",
    "symptom_ids": ["85296ca3-fdf6-423f-8e3d-e5e8fb3c1c78"],
    "created_at": "2026-07-25T02:19:29Z",
    "updated_at": "2026-07-25T02:19:29Z"
  }
}
```

---

### `GET /api/v1/daily-logs?from=YYYY-MM-DD&to=YYYY-MM-DD`

Kedua query param **wajib**.

**Response 200:** `{ "data": [ DailyLogResponse, ... ] }`

---

### `DELETE /api/v1/daily-logs/{date}`

`{date}` di path, format `YYYY-MM-DD` (mis. `/api/v1/daily-logs/2026-01-01`).

**Response 204.**

---

## Symptoms (Tag Gejala)

Ada dua jenis: **preset** (disediakan sistem, `is_custom: false`, milik semua user) dan **custom** (dibuat user sendiri, `is_custom: true`).

### `GET /api/v1/symptoms`

Mengembalikan gabungan preset + tag custom milik user yang login.

**Response 200:**
```json
{ "data": [ { "id": "...", "name": "kram", "category": "physical", "is_custom": false } ] }
```
- `category`: `physical`, `emotional`, atau `other`.

---

### `POST /api/v1/symptoms`

Membuat tag gejala custom baru.

**Body:**
```json
{ "name": "nyeri punggung", "category": "physical" }
```
- `name`: wajib, maks 50 karakter.
- `category`: wajib, salah satu dari `physical`, `emotional`, `other`.

**Response 201:** `{ "data": SymptomResponse }`

**Errors khusus:** `422 VALIDATION_ERROR` jika nama duplikat (case-insensitive, dibandingkan ke preset maupun tag milik sendiri) atau sudah mencapai batas **30 tag custom per user**.

---

### `DELETE /api/v1/symptoms/{id}`

Hanya bisa hapus tag custom milik sendiri.

**Response 204.** Errors: `403 FORBIDDEN` (mencoba hapus preset atau tag milik user lain), `404 NOT_FOUND`.

---

## Insights (Analisis)

### `GET /api/v1/insights/summary`

Statistik deskriptif siklus, dihitung dari seluruh riwayat (bukan window bergulir).

**Response 200 (data cukup):**
```json
{
  "data": {
    "has_sufficient_data": true,
    "average_cycle_length": 28.0,
    "shortest_cycle": 27,
    "longest_cycle": 30,
    "average_period_length": 5.0,
    "total_cycles": 6,
    "regularity": "regular",
    "cycle_length_trend": [ { "start_date": "2026-01-01", "cycle_length": 28 } ]
  }
}
```
- `regularity`: `regular`, `moderate`, atau `irregular`.

**Response 200 (data belum cukup — minimal 2 siklus dengan `cycle_length` tercatat):**
```json
{ "data": { "has_sufficient_data": false, "message": "Butuh minimal 2 siklus...", "total_cycles": 1 } }
```

---

### `GET /api/v1/insights/symptoms?months=6`

`months`: opsional, integer 1–24, default 6.

**Response 200:**
```json
{
  "data": {
    "symptoms": [
      {
        "symptom_id": "...",
        "name": "kram",
        "count": 12,
        "phase_distribution": { "menstrual": 10, "luteal": 2 },
        "most_common_cycle_day": 2,
        "sample_size": 12
      }
    ],
    "months": 6,
    "sample_size": 45
  }
}
```
Diurutkan dari gejala paling sering muncul.

---

### `GET /api/v1/insights/mood?months=6`

`months`: opsional, integer 1–24, default 6.

**Response 200:** selalu mengembalikan **4 fase** (`menstrual`, `follicular`, `ovulation`, `luteal`), walau sample size-nya 0.
```json
{
  "data": {
    "by_phase": [
      {
        "phase": "menstrual",
        "mood_counts": { "senang": 3, "lelah": 5 },
        "mood_percentage": { "senang": 37.5, "lelah": 62.5 },
        "dominant_mood": "lelah",
        "sample_size": 8
      }
    ],
    "months": 6
  }
}
```

---

## Wellness (Air Minum, Tidur, Berat Badan)

### `POST /api/v1/wellness`

Upsert, tapi **merge** per field (bukan replace) — mengirim `water_glasses` saja tidak akan menghapus `sleep_hours`/`weight_kg` yang sudah tersimpan untuk tanggal itu sebelumnya. Field yang tidak dikirim (`omitempty`) diabaikan, bukan di-clear.

**Body:**
```json
{ "date": "2026-01-01", "water_glasses": 6, "sleep_hours": 7.5, "weight_kg": 55.5 }
```
- `date`: wajib.
- `water_glasses`: opsional, integer 0–30.
- `sleep_hours`: opsional, 0–24.
- `weight_kg`: opsional, 20–300.

**Response 200:** `{ "data": WellnessLogResponse }`

---

### `GET /api/v1/wellness?from=YYYY-MM-DD&to=YYYY-MM-DD`

**Response 200:** `{ "data": [ WellnessLogResponse, ... ] }`

---

## Export

### `POST /api/v1/export?format=csv|pdf&from=YYYY-MM-DD&to=YYYY-MM-DD`

Tidak ada body. Response **bukan JSON** — file binary langsung (`Content-Disposition: attachment`), FE harus handle sebagai file download/share, bukan di-parse sebagai JSON.

- `format`: opsional, default `csv`. Nilai lain selain `csv`/`pdf` → `422 VALIDATION_ERROR`.
- `from`, `to`: wajib. Rentang maksimal ~2 tahun (732 hari); `to` harus >= `from`.

**CSV:** `Content-Type: text/csv`. Satu baris per hari yang punya data (daily log dan/atau wellness log), berisi tanggal, hari siklus, fase, flow, mood, gejala, catatan, dan metrik wellness.

**PDF:** `Content-Type: application/pdf`. Laporan ringkas: header (periode, tanggal dibuat), ringkasan statistik siklus, tabel riwayat siklus, 5 gejala paling sering, dan footer disclaimer medis wajib.

**Errors:** `422 VALIDATION_ERROR` (format tidak dikenal, rentang tanggal tidak valid/terlalu panjang).

---

## Reminders (Preferensi Pengingat)

**Penting — ini bukan push notification.** Backend hanya menyimpan preferensi; notifikasi dijadwalkan **secara lokal di perangkat** oleh FE lewat `expo-notifications` (menggabungkan data ini dengan `GET /cycles/prediction`). Backend tidak punya cron dan tidak pernah mengirim apa pun ke perangkat.

### `GET /api/v1/reminders`

Daftar seluruh preferensi reminder milik user. User baru → `{ "data": [] }` (bukan error; FE tampilkan semua toggle dalam keadaan mati).

**Response 200:**
```json
{
  "data": [
    {
      "id": "8b68d460-154f-412a-a735-0341b0acd05d",
      "type": "period_upcoming",
      "is_enabled": true,
      "time_of_day": null,
      "days_before": 2,
      "custom_message": null,
      "created_at": "2026-07-25T06:38:27Z",
      "updated_at": "2026-07-25T06:38:27Z"
    }
  ]
}
```
- `type`: salah satu dari `period_upcoming`, `fertile_window`, `medication`, `checkup`.

---

### `PUT /api/v1/reminders` (upsert)

Menyimpan/memperbarui **satu** preferensi reminder. Idempoten berdasarkan `type` — satu baris per tipe (mengirim `type` yang sama dua kali akan meng-update baris yang sama, bukan membuat baris baru). Untuk mematikan reminder tanpa menghapusnya, kirim ulang dengan `is_enabled: false`.

**Body:**
```json
{
  "type": "period_upcoming",
  "is_enabled": true,
  "time_of_day": "09:00",
  "days_before": 2,
  "custom_message": "Pil KB"
}
```
- `type`: wajib, salah satu dari 4 nilai di atas.
- `is_enabled`: wajib (boolean).
- `time_of_day`: opsional, format `HH:MM`. **Wajib diisi untuk `type: "medication"`** — kalau kosong, `422 VALIDATION_ERROR`.
- `days_before`: opsional, integer 0–14. Dipakai untuk `period_upcoming`/`fertile_window`.
- `custom_message`: opsional, maks 200 karakter.

**Response 200:** `{ "data": ReminderResponse }`

**Errors:** `422 VALIDATION_ERROR` (type/jam/days_before tidak valid, atau `medication` tanpa `time_of_day`).

---

### `DELETE /api/v1/reminders/{id}`

Menghapus satu baris preferensi (alternatif dari mematikan lewat `is_enabled: false`).

**Response 204.** Errors: `404 NOT_FOUND` (id bukan milik user / tidak ada).

---

## Garden (Taman Luna)

### `GET /api/v1/garden`

Data gamifikasi ringan — kebun yang tumbuh, kartu konsistensi, koleksi stiker mood. Seluruh angka **diturunkan dari `daily_logs`** (bukan tabel gamifikasi terpisah). **Selalu 200**, termasuk untuk user baru tanpa catatan sama sekali (semua angka `0`, `uncollected_moods` berisi semua preset).

**Response 200:**
```json
{
  "data": {
    "total_logged_days": 34,
    "logged_days_this_month": 12,
    "new_this_week": 3,
    "collected_moods": ["senang", "tenang"],
    "uncollected_moods": ["biasa", "sensitif", "cemas", "sedih", "mudah marah"],
    "message": "Setiap hari kecil berarti. Tidak apa-apa kalau ada yang terlewat."
  }
}
```
- `total_logged_days` — total hari unik tercatat sepanjang waktu (skala kebun keseluruhan).
- `logged_days_this_month` — hari unik tercatat bulan berjalan.
- `new_this_week` — hari unik tercatat dalam 7 hari terakhir (termasuk hari ini).
- `collected_moods` / `uncollected_moods` — mood preset yang sudah vs belum pernah dicatat. Preset lengkap: `senang`, `tenang`, `biasa`, `sensitif`, `cemas`, `sedih`, `mudah marah`.
- `message` — kalimat hangat dari Luna, saat ini statis.

**Prinsip wajib (positive-only):** endpoint ini **tidak pernah** mengembalikan apa pun yang mengukur ketidakhadiran — tidak ada `missed_days`, tidak ada `current_streak` yang bisa putus. Definisi "1 bunga/unit pertumbuhan" untuk visual kebun sepenuhnya urusan FE (mis. `total_logged_days` dipetakan ke jumlah tanaman) — backend hanya menyediakan angka mentahnya.

---

## Account

### `DELETE /api/v1/account`

**Hard delete** — menghapus seluruh data user (cycles, daily logs, wellness logs, tag gejala custom) dan akun autentikasinya di Supabase. **Tidak bisa dibatalkan.** Setelah ini, login ulang dengan kredensial yang sama akan gagal.

**Response 204.**

> Catatan implementasi: karena JWT bersifat stateless, token yang sedang dipakai saat request ini masih "valid" secara kriptografis sampai masa berlakunya habis (±1 jam) — tapi karena semua data sudah dihapus, request lain dengan token itu hanya akan mengembalikan data kosong, tidak ada risiko kebocoran data user lain. FE sebaiknya tetap langsung logout/clear token lokal setelah delete berhasil.

---

## Yang Belum Ada (perlu diketahui FE)

- **CORS belum dikonfigurasi.** Tidak masalah untuk native app (Expo Go / build APK/IPA). Kalau butuh testing lewat browser atau Expo Web, request akan diblokir browser — beri tahu kalau ini dibutuhkan.
- **Tidak ada rate limiting** di sisi backend saat ini.
- **Tidak ada endpoint refresh token** — itu ditangani langsung oleh Supabase client SDK di FE, bukan lewat backend LLunara.
