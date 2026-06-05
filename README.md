# 🚌 শেরপুর বাস সময়সূচী
## Sherpur Bus Schedule — Web & PWA App

ঢাকা থেকে শেরপুর বাসের সময়সূচী, ফোন নম্বর এবং গন্তব্য একসাথে খুঁজে পান।

**Live features:**
- 🔍 Search by bus name, destination, phone number
- 🕐 Filter by Morning / Afternoon / Night
- 📍 Filter by destination (শেরপুর, বকশীগঞ্জ, ঝিনাইগাতী, etc.)
- 📱 Installable as Android/iOS app (PWA)
- ⚙️ Password-protected admin panel to add/edit/delete buses + upload images
- 🗄️ Supabase free database (with static data fallback)

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/sherpur-bus.git
cd sherpur-bus
npm install
```

### 2. Setup Supabase (Free Database)
1. Go to [supabase.com](https://supabase.com) → Create free account → New project
2. Go to **SQL Editor** → Run this SQL:

```sql
CREATE TABLE buses (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  terminal TEXT NOT NULL,
  period TEXT NOT NULL,
  time TEXT NOT NULL,
  destination TEXT NOT NULL,
  phone TEXT NOT NULL,
  route TEXT NOT NULL DEFAULT 'dhaka-to-sherpur',
  session TEXT NOT NULL CHECK (session IN ('morning','afternoon','night')),
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON buses FOR SELECT USING (true);
CREATE POLICY "Admin insert" ON buses FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update" ON buses FOR UPDATE USING (true);
CREATE POLICY "Admin delete" ON buses FOR DELETE USING (true);
```

3. Create Storage bucket:
   - Go to **Storage** → New bucket → Name: `bus-images` → Public: ✅

4. Copy your keys:
   - Go to **Settings** → **API**
   - Copy `Project URL` and `anon public` key

### 3. Configure Environment
```bash
cp .env.example .env
```
Edit `.env`:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_ADMIN_PASSWORD=your-strong-password
```

### 4. Seed Initial Data (Optional)
To upload the 64 buses from the schedule images into Supabase, go to Supabase → **SQL Editor** and run the seed SQL from `supabase-seed.sql` (see below).

### 5. Run Locally
```bash
npm run dev
```
Open http://localhost:5173

---

## 📦 Deploy to Vercel (Free)

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/sherpur-bus.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → Import your GitHub repo
3. Add Environment Variables (same as `.env`)
4. Click **Deploy** ✅

Your site will be live at `https://sherpur-bus.vercel.app`

---

## 📱 Install as App

**Android:** Open site in Chrome → Menu (⋮) → "Add to Home Screen"  
**iOS:** Open in Safari → Share (□↑) → "Add to Home Screen"

---

## 📁 Project Structure

```
sherpur-bus/
├── src/
│   ├── components/
│   │   └── BusCard.jsx          # Individual bus display card
│   ├── pages/
│   │   ├── Home.jsx             # Public search & filter page
│   │   └── Admin.jsx            # Password-protected admin panel
│   ├── lib/
│   │   └── supabase.js          # Database connection & queries
│   ├── data/
│   │   └── buses.js             # Static fallback data (64 buses)
│   ├── App.jsx                  # Router & navigation
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles + Bengali fonts
├── index.html
├── vite.config.js               # Vite + PWA config
├── vercel.json                  # Vercel SPA routing
├── .env.example                 # Environment variables template
└── package.json
```

---

## 🔐 Admin Panel

Go to `/admin` → Enter password (default: `sherpur2024`)

**Change password:** Set `VITE_ADMIN_PASSWORD` in your `.env` file

Admin can:
- ➕ Add new bus with name, time, phone, terminal, destination, image
- ✏️ Edit existing bus info
- 🗑️ Delete a bus
- 📸 Upload bus photo (requires Supabase storage)

---

## 🗃️ Supabase Seed SQL

To pre-load all 64 buses into your database, go to Supabase SQL Editor and run:

```sql
INSERT INTO buses (name, terminal, period, time, destination, phone, route, session) VALUES
('মোরাদ মহিমা','মহাখালী টার্মিনাল','ভোর','4:00','পাইকুড়া','01725-131692','dhaka-to-sherpur','morning'),
('মোজাদ্দেদীয়া','মহাখালী টার্মিনাল','ভোর','4:00','ভায়াডাঙ্গা','01733-119609','dhaka-to-sherpur','morning'),
('মমতা','মহাখালী টার্মিনাল','ভোর','4:00','ভায়াডাঙ্গা','01766-426070','dhaka-to-sherpur','morning'),
('সিমিন','মহাখালী টার্মিনাল','ভোর','4:30','ঝিনাইগাতী','01703-258282','dhaka-to-sherpur','morning'),
('যমুনা','মহাখালী টার্মিনাল','ভোর','4:30','বকশীগঞ্জ','01738-085162','dhaka-to-sherpur','morning'),
('সরকার','মহাখালী টার্মিনাল','ভোর','4:20','ভায়াডাঙ্গা','01880-688869','dhaka-to-sherpur','morning'),
('সিয়াম এন্টারপ্রাইজ','মহাখালী টার্মিনাল','ভোর','4:30','বকশীগঞ্জ','01998-023223','dhaka-to-sherpur','morning'),
('মেঘলা','মহাখালী টার্মিনাল','ভোর','4:30','বকশীগঞ্জ','01728-432686','dhaka-to-sherpur','morning'),
('মিম','মহাখালী টার্মিনাল','ভোর','4:30','ভায়াডাঙ্গা','01996-981398','dhaka-to-sherpur','morning'),
('সিমিন','মহাখালী টার্মিনাল','ভোর','4:40','ঝিনাইগাতী','01999-376839','dhaka-to-sherpur','morning'),
('নাহিয়ান এক্সপ্রেস','মহাখালী টার্মিনাল','ভোর','4:50','বকশীগঞ্জ','01906-988796','dhaka-to-sherpur','morning'),
('মাফি ২','মহাখালী টার্মিনাল','সকাল','6:30','বকশীগঞ্জ','01998-979797','dhaka-to-sherpur','morning'),
('সিয়াম','মহাখালী টার্মিনাল','সকাল','6:20','ঝিনাইগাতী','01998-023229','dhaka-to-sherpur','morning'),
('সাদিকা ১','মহাখালী টার্মিনাল','সকাল','6:30','শেরপুর','01932-119181','dhaka-to-sherpur','morning'),
('জননী এন্টারপ্রাইজ','মহাখালী টার্মিনাল','সকাল','6:30','বকশীগঞ্জ','01303-481893','dhaka-to-sherpur','morning'),
('নুরজাহান','মহাখালী টার্মিনাল','সকাল','6:30','তিনানী','01325-482296','dhaka-to-sherpur','morning'),
('ক্রাউন ডিলাক্স','মহাখালী টার্মিনাল','সকাল','7:00','বকশীগঞ্জ','01996-431393','dhaka-to-sherpur','morning'),
('মনিমুক্তা ২','মহাখালী টার্মিনাল','সকাল','7:15','শেরপুর','01939-811811','dhaka-to-sherpur','morning'),
('অবকাশ এক্সপ্রেস','মহাখালী টার্মিনাল','সকাল','7:30','ঝিনাইগাতী','01998-153976','dhaka-to-sherpur','morning'),
('সুপ্রীম নাইটকোচ','মহাখালী টার্মিনাল','সকাল','8:00','শেরপুর','01996-830383','dhaka-to-sherpur','morning'),
('শেরপুর রেড লাইন','গুলিস্তান (দৈনিক বাংলা মোড়)','সকাল','8:00','শেরপুর','01933-691686','dhaka-to-sherpur','morning'),
('নাহিদ','মহাখালী টার্মিনাল','সকাল','8:00','বকশীগঞ্জ','01999-760908','dhaka-to-sherpur','morning'),
('প্রিয় এক্সপ্রেস','মহাখালী টার্মিনাল','সকাল','8:00','বকশীগঞ্জ','01729-363888','dhaka-to-sherpur','morning'),
('প্রাইম','নাবিস্কো, মহাখালী','সকাল','8:30','শেরপুর','01929-550822','dhaka-to-sherpur','morning'),
('মনিমুক্তা-১','মহাখালী টার্মিনাল','সকাল','10:00','শেরপুর','01930-690161','dhaka-to-sherpur','morning'),
('এফ জেড লাইন','মহাখালী টার্মিনাল','সকাল','11:30','শেরপুর','01930-830393','dhaka-to-sherpur','morning'),
('শেরপুর ওমেন চেম্বার অফ কমার্স','গুলিস্তান (দৈনিক বাংলা মোড়)','দুপুর','12:00','শেরপুর','01300-823516','dhaka-to-sherpur','afternoon'),
('গজনী এক্সপ্রেস','মহাখালী টার্মিনাল','দুপুর','12:00','ঝিনাইগাতী','01782-228938','dhaka-to-sherpur','afternoon'),
('মুনরাজ ২','মহাখালী টার্মিনাল','দুপুর','12:20','শেরপুর','01965-818382','dhaka-to-sherpur','afternoon'),
('শ্রীবদী বহুমুখী শিল্প ও বণিক সমিতি','মহাখালী টার্মিনাল','দুপুর','1:00','ভায়াডাঙ্গা','01938-386698','dhaka-to-sherpur','afternoon'),
('শেরপুর টেনিস ক্লাব','গুলিস্তান (দৈনিক বাংলা মোড়)','দুপুর','1:05','শেরপুর','01990-998998','dhaka-to-sherpur','afternoon'),
('এসি সুপার ডিলাক্স','মহাখালী টার্মিনাল','দুপুর','1:10','শেরপুর','01935-621796','dhaka-to-sherpur','afternoon'),
('এস এ ২','মহাখালী টার্মিনাল','দুপুর','1:35','শেরপুর','01928-391118','dhaka-to-sherpur','afternoon'),
('ঝিনাইগাতী এক্সপ্রেস','মহাখালী টার্মিনাল','দুপুর','1:45','ঝিনাইগাতী','01996-239823','dhaka-to-sherpur','afternoon'),
('শেরপুর চেম্বার অফ কমার্স ২','গুলিস্তান (দৈনিক বাংলা মোড়)','দুপুর','2:00','শেরপুর','01998-558890','dhaka-to-sherpur','afternoon'),
('এসি ডিলাক্স','মহাখালী টার্মিনাল','দুপুর','2:00','শেরপুর','01938-390666','dhaka-to-sherpur','afternoon'),
('জনতা পরিবহন','মহাখালী টার্মিনাল','দুপুর','2:00','তিনানী','01325-482298','dhaka-to-sherpur','afternoon'),
('ঝিনাইগাতী ক্ষুদ্রবণিক সমবায় সমিতি','মহাখালী টার্মিনাল','দুপুর','2:00','ঝিনাইগাতী','01939-430069','dhaka-to-sherpur','afternoon'),
('শাহীমণি','দক্ষিণখান','দুপুর','2:15','ভায়াডাঙ্গা','01999-353808','dhaka-to-sherpur','afternoon'),
('প্রিয় এক্সপ্রেস','মহাখালী টার্মিনাল','দুপুর','2:30','বকশীগঞ্জ','01930-866962','dhaka-to-sherpur','afternoon'),
('সিমিন','গুলিস্তান','দুপুর','2:30','ঝিনাইগাতী','01890-190909','dhaka-to-sherpur','afternoon'),
('ঝিনাইগাতী ডিলাক্স','বংশবাজার','দুপুর','2:30','ঝিনাইগাতী','01990-811810','dhaka-to-sherpur','afternoon'),
('মোরাদ মহিমা','মহাখালী টার্মিনাল','বিকেল','3:00','ভায়াডাঙ্গা','01903-816680','dhaka-to-sherpur','afternoon'),
('শেরপুর চেম্বার অফ কমার্স ১','গুলিস্তান (দৈনিক বাংলা মোড়)','বিকেল','3:15','শেরপুর','01935-818925','dhaka-to-sherpur','afternoon'),
('ক্রীড়া সংস্থা এসি','গুলিস্তান (স্টেডিয়াম গেট ২)','বিকেল','3:30','শেরপুর','01303-990329','dhaka-to-sherpur','afternoon'),
('অপু ট্রাভেলস','মহাখালী টার্মিনাল','বিকেল','4:00','ঝিনাইগাতী','01300-826483','dhaka-to-sherpur','afternoon'),
('কালেক্টর','গুলিস্তান (দৈনিক বাংলা মোড়)','বিকেল','4:00','শেরপুর','01929-382803','dhaka-to-sherpur','afternoon'),
('যমুনা','মহাখালী টার্মিনাল','বিকেল','4:00','বকশীগঞ্জ','01996-905093','dhaka-to-sherpur','afternoon'),
('সারাহ-মনি এক্সপ্রেস','মহাখালী টার্মিনাল','বিকেল','4:00','ঝিনাইগাতী','01909-382093','dhaka-to-sherpur','afternoon'),
('শেরপুর জেলা বাস মিনিবাস মালিক সমিতি','গুলিস্তান (স্টেডিয়াম গেট ২)','বিকেল','4:30','শেরপুর','01983-728082','dhaka-to-sherpur','afternoon'),
('অবকাশ এক্সপ্রেস','মহাখালী টার্মিনাল','বিকেল','4:00','ঝিনাইগাতী','01938-292956','dhaka-to-sherpur','afternoon'),
('হিমালয় ক্লাসিক','মহাখালী টার্মিনাল','বিকেল','4:00','বকশীগঞ্জ','01979-988908','dhaka-to-sherpur','afternoon'),
('জননী এন্টারপ্রাইজ','মহাখালী টার্মিনাল','বিকেল','4:30','বকশীগঞ্জ','01722-860099','dhaka-to-sherpur','afternoon'),
('মাফি ১','মহাখালী টার্মিনাল','সন্ধ্যা','6:30','বকশীগঞ্জ','01310-625492','dhaka-to-sherpur','night'),
('জননী এন্টারপ্রাইজ','মহাখালী টার্মিনাল','সন্ধ্যা','6:30','বকশীগঞ্জ','01303-490300','dhaka-to-sherpur','night'),
('ক্রাউন ডিলাক্স','মহাখালী টার্মিনাল','সন্ধ্যা','7:30','বকশীগঞ্জ','01939-195555','dhaka-to-sherpur','night'),
('ক্রাউন ডিলাক্স','মহাখালী টার্মিনাল','রাত','8:30','বকশীগঞ্জ','01933-386836','dhaka-to-sherpur','night'),
('নাঈম','দক্ষিণখান','রাত','9:20','বালিজুড়ি','01791-799989','dhaka-to-sherpur','night'),
('ক্রাউন ডিলাক্স','মহাখালী টার্মিনাল','রাত','10:00','বকশীগঞ্জ','01930-615096','dhaka-to-sherpur','night'),
('সিয়াম এন্টারপ্রাইজ','গাজীপুর চৌঃ','রাত','10:40','বকশীগঞ্জ','01998-023228','dhaka-to-sherpur','night'),
('সাদিকা ২','মহাখালী টার্মিনাল','রাত','11:30','শেরপুর','01936-990161','dhaka-to-sherpur','night'),
('জাবির','মহাখালী টার্মিনাল','রাত','11:45','কর্ণজোড়া','01908-992500','dhaka-to-sherpur','night'),
('তাকিফ','মহাখালী টার্মিনাল','রাত','1:00','ঝিনাইগাতী','01998-522980','dhaka-to-sherpur','night'),
('ঝিনাইগাতী এক্সপ্রেস','মহাখালী টার্মিনাল','রাত','1:30','ঝিনাইগাতী','01986-200303','dhaka-to-sherpur','night');
```

---

## 🤝 Contributing

Feel free to open issues or pull requests. Data corrections welcome!

**Source:** Bus Fan of Sherpur Group (বাস ফ্যান অফ শেরপুর গ্রুপ)
