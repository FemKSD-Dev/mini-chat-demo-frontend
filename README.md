# 💬 Mini Chat Frontend

Frontend สำหรับแอปพลิเคชันแชทแบบเรียลไทม์ที่พัฒนาด้วย Next.js, TypeScript และ Tailwind CSS

## 🌐 Live Demo

**ทดลองใช้งานได้ที่**: [https://mini-chat-demo-frontend.vercel.app/](https://mini-chat-demo-frontend.vercel.app/)

### วิธีทดลองใช้งาน Demo:
1. เปิดลิงก์ด้านบน
2. คลิก "Switch user" ที่มุมบนขวาเพื่อเลือกผู้ใช้ (Alice, Bob, Charlie, Dave)
3. สร้าง conversation ใหม่โดยเลือกผู้ใช้จาก dropdown และคลิก "New"
4. เริ่มแชทได้เลย!

**Tips**: เปิด 2 หน้าต่างเบราว์เซอร์ (หรือใช้ Incognito) และ login เป็นคนละ user เพื่อทดสอบ real-time messaging!

---

## 📋 สารบัญ

- [คุณสมบัติ](#คุณสมบัติ)
- [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
- [ความต้องการของระบบ](#ความต้องการของระบบ)
- [การติดตั้ง](#การติดตั้ง)
- [การใช้งาน](#การใช้งาน)
- [การใช้งาน Demo](#การใช้งาน-demo)
- [Environment Variables](#environment-variables)
- [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
- [Features](#features)
- [การ Deploy](#การ-deploy)
- [Troubleshooting](#troubleshooting)

## 🎯 คุณสมบัติ

- ✅ UI/UX ที่สวยงามและทันสมัย
- ✅ รองรับ Dark Mode อัตโนมัติ
- ✅ Real-time message polling
- ✅ Infinite scroll pagination
- ✅ Responsive design (รองรับทุกขนาดหน้าจอ)
- ✅ Type-safe API calls
- ✅ Smooth animations และ transitions
- ✅ Custom scrollbar
- ✅ Typing indicator (หยุด polling เมื่อกำลังพิมพ์)

## 🛠 เทคโนโลยีที่ใช้

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom React Components
- **State Management**: React Hooks
- **HTTP Client**: Fetch API
- **Fonts**: Geist Sans & Geist Mono

## 📦 ความต้องการของระบบ

- Node.js 22.x หรือสูงกว่า
- npm 10.x หรือสูงกว่า
- Backend API ที่ทำงานอยู่ (ดู [Backend README](../mini-chat-backend/README.md))

## 🚀 การติดตั้ง

### 1. Clone Repository

```bash
git clone <repository-url>
cd mini-chat-application/mini-chat-frontend
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์ root:

```bash
# สร้างไฟล์
touch .env.local

# หรือ Windows
type nul > .env.local
```

เพิ่มเนื้อหาต่อไปนี้:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:4001

# Polling Configuration (in milliseconds)
NEXT_PUBLIC_POLLING_INTERVAL=2000
```

### 4. เริ่ม Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:3000`

## 📖 การใช้งาน

### Development Mode

```bash
npm run dev
```

Server จะทำงานที่ `http://localhost:3000` และ auto-reload เมื่อมีการแก้ไขไฟล์

### Production Build

```bash
# Build
npm run build

# Start production server
npm start
```

### Linting

```bash
npm run lint
```

## 🎮 การใช้งาน Demo

### 1. เริ่มต้นใช้งาน

#### ขั้นตอนที่ 1: เริ่ม Backend
ก่อนใช้งาน Frontend ต้องเริ่ม Backend ก่อน:

```bash
cd ../mini-chat-backend
docker-compose -f docker-compose.full.yml up -d
```

Backend จะทำงานที่ `http://localhost:4001`

#### ขั้นตอนที่ 2: เริ่ม Frontend

```bash
cd ../mini-chat-frontend
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:3000`

### 2. การ Switch User (สลับผู้ใช้)

แอปนี้เป็น **Demo Application** ที่จำลองการใช้งานของหลายผู้ใช้ในเบราว์เซอร์เดียว

#### วิธี Switch User:

1. **มองหา User Switcher** ที่มุมบนขวาของหน้าจอ
   - จะมี dropdown แสดง "Switch user: [ชื่อผู้ใช้]"

2. **คลิกที่ Dropdown** เพื่อดูรายชื่อผู้ใช้ทั้งหมด:
   - Alice (ID: 1)
   - Bob (ID: 2)
   - Charlie (ID: 3)
   - Dave (ID: 4)

3. **เลือกผู้ใช้** ที่ต้องการสลับไป
   - แอปจะ reload และแสดงข้อมูลของผู้ใช้ที่เลือก

#### ทำไมต้อง Switch User?

เพื่อทดสอบการแชทระหว่างผู้ใช้หลายคน:

1. **เปิดเบราว์เซอร์หน้าต่างที่ 1** → Login เป็น Alice
2. **เปิดเบราว์เซอร์หน้าต่างที่ 2** (Incognito/Private) → Login เป็น Bob
3. **สร้าง Conversation** ระหว่าง Alice และ Bob
4. **ส่งข้อความ** จากทั้งสองฝ่าย
5. **ดูข้อความ** อัปเดตแบบ real-time

### 3. การสร้าง Conversation

#### ขั้นตอน:

1. **เลือกผู้ใช้** จาก dropdown "Start chat with…" (ด้านซ้าย)
2. **คลิกปุ่ม "New"** (สีน้ำเงิน-ม่วง)
3. **Conversation ใหม่** จะปรากฏในรายการด้านซ้าย
4. **คลิกที่ Conversation** เพื่อเริ่มแชท

### 4. การส่งข้อความ

#### ขั้นตอน:

1. **เลือก Conversation** จากรายการด้านซ้าย
2. **พิมพ์ข้อความ** ในช่อง input ด้านล่าง
3. **กด Enter** หรือ **คลิกปุ่ม Send**
4. **ข้อความจะส่ง** และปรากฏทันที

#### Features ขณะพิมพ์:

- 🔴 **Typing Indicator**: ระบบจะหยุด polling ชั่วคราวเมื่อคุณกำลังพิมพ์
- 🟢 **Live Updates**: ข้อความใหม่จะอัปเดตทุก 2 วินาที (หรือตาม config)
- 📜 **Auto Scroll**: หน้าจอจะ scroll ลงล่างอัตโนมัติเมื่อมีข้อความใหม่

### 5. การโหลดข้อความเก่า

#### ขั้นตอน:

1. **เลื่อนขึ้นด้านบน** ของ conversation
2. **คลิกปุ่ม "Load older messages"**
3. **ข้อความเก่า** จะโหลดเพิ่มขึ้นมา
4. **ตำแหน่ง scroll** จะคงที่ (ไม่กระโดดลงล่าง)

### 6. ตัวอย่างการใช้งาน

#### Scenario 1: แชทระหว่าง 2 คน

```
1. Login เป็น Alice
2. สร้าง conversation กับ Bob
3. ส่งข้อความ "สวัสดี Bob!"
4. Switch user เป็น Bob (หรือเปิดหน้าต่างใหม่)
5. เปิด conversation กับ Alice
6. เห็นข้อความจาก Alice
7. ตอบกลับ "สวัสดี Alice!"
8. Switch กลับเป็น Alice
9. เห็นข้อความตอบกลับจาก Bob
```

#### Scenario 2: ทดสอบ Real-time Updates

```
1. เปิด 2 หน้าต่างเบราว์เซอร์
2. หน้าต่างที่ 1: Login เป็น Alice
3. หน้าต่างที่ 2: Login เป็น Bob
4. สร้าง conversation ระหว่างกัน
5. ส่งข้อความจากทั้งสองฝ่ายสลับกัน
6. สังเกตข้อความอัปเดตแบบ real-time
```

## ⚙️ Environment Variables

### ตัวแปรที่ใช้ได้:

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:4001` | `https://api.example.com` |
| `NEXT_PUBLIC_POLLING_INTERVAL` | Message polling interval (ms) | `2000` | `5000` (5 วินาที) |

### การปรับ Polling Interval:

```env
# อัปเดตเร็วขึ้น (1 วินาที)
NEXT_PUBLIC_POLLING_INTERVAL=1000

# อัปเดตช้าลง (5 วินาที) - ประหยัด bandwidth
NEXT_PUBLIC_POLLING_INTERVAL=5000

# อัปเดตเร็วมาก (500ms) - สำหรับ demo
NEXT_PUBLIC_POLLING_INTERVAL=500
```

**หมายเหตุ:** หลังจากเปลี่ยน environment variables ต้อง restart dev server

## 📁 โครงสร้างโปรเจค

```
mini-chat-frontend/
├── app/
│   ├── favicon.ico
│   ├── globals.css          # Global styles + Tailwind config
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main chat page
├── components/
│   ├── ChatRoom.tsx         # Chat interface component
│   ├── ConversationList.tsx # Conversations sidebar
│   └── UserSwitcher.tsx     # User switcher dropdown
├── lib/
│   ├── api.ts               # API client functions
│   ├── config.ts            # App configuration
│   └── types.ts             # TypeScript types
├── public/                  # Static assets
├── .env.local              # Environment variables (create this)
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

## ✨ Features

### 1. Modern UI/UX

- **Gradient Header**: สีสันสวยงามด้วย gradient แบบ modern
- **Avatar Icons**: แสดงตัวอักษรแรกของชื่อในวงกลม gradient
- **Message Bubbles**: ข้อความของคุณ (gradient น้ำเงิน-ม่วง) vs คนอื่น (พื้นหลังขาว/เทา)
- **Smooth Animations**: Transitions และ hover effects ที่ลื่นไหล
- **Custom Scrollbar**: Scrollbar สวยงามที่เข้ากับธีม

### 2. Dark Mode Support

- **Auto Detection**: ตรวจจับ system preference อัตโนมัติ
- **CSS Variables**: ใช้ CSS variables สำหรับ theming
- **Consistent Colors**: สีที่อ่านง่ายทั้ง light และ dark mode

### 3. Real-time Updates

- **Polling Mechanism**: ดึงข้อความใหม่ทุก 2 วินาที (ปรับได้)
- **Smart Polling**: หยุด polling เมื่อกำลังพิมพ์
- **Live Indicator**: แสดงสถานะ "Live" เมื่อ polling ทำงาน

### 4. Pagination

- **Cursor-based**: ใช้ cursor-based pagination สำหรับประสิทธิภาพ
- **Infinite Scroll**: โหลดข้อความเก่าเมื่อเลื่อนขึ้นบน
- **Smart Scroll**: คงตำแหน่ง scroll เมื่อโหลดข้อความเก่า

### 5. Responsive Design

- **Mobile-friendly**: ใช้งานได้ดีบนมือถือ
- **Tablet Support**: Layout ปรับตามขนาดหน้าจอ
- **Desktop Optimized**: ใช้ประโยชน์จากพื้นที่หน้าจอใหญ่

## 🚢 การ Deploy

### Deploy บน Vercel (แนะนำ)

#### 1. Push โค้ดไปยัง Git Repository

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Deploy บน Vercel

1. ไปที่ [Vercel](https://vercel.com)
2. Import repository
3. ตั้งค่า Environment Variables:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com
   NEXT_PUBLIC_POLLING_INTERVAL=2000
   ```
4. Deploy!

### Deploy แบบ Manual

#### Build Production

```bash
npm run build
```

#### Start Production Server

```bash
npm start
```

Server จะทำงานที่ `http://localhost:3000`

### Deploy ด้วย Docker

#### 1. สร้าง Dockerfile

```dockerfile
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

#### 2. Build และ Run

```bash
# Build image
docker build -t mini-chat-frontend .

# Run container
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://localhost:4001 \
  -e NEXT_PUBLIC_POLLING_INTERVAL=2000 \
  mini-chat-frontend
```

## 🔧 Troubleshooting

### ปัญหา: ไม่สามารถเชื่อมต่อ Backend

**อาการ:**
- แสดง error "Failed to load"
- ข้อความไม่อัปเดต

**วิธีแก้:**

1. ตรวจสอบว่า Backend ทำงานอยู่:
   ```bash
   curl http://localhost:4001/api/users
   ```

2. ตรวจสอบ `NEXT_PUBLIC_API_BASE_URL` ใน `.env.local`

3. ตรวจสอบ CORS settings ใน Backend

4. Restart dev server:
   ```bash
   # Ctrl+C แล้ว
   npm run dev
   ```

### ปัญหา: Dark Mode ไม่ทำงาน

**วิธีแก้:**

1. ตรวจสอบ system preference:
   - Windows: Settings → Personalization → Colors
   - Mac: System Preferences → General → Appearance

2. ลอง force refresh: `Ctrl+Shift+R` (Windows) หรือ `Cmd+Shift+R` (Mac)

### ปัญหา: Polling ไม่ทำงาน

**วิธีแก้:**

1. ตรวจสอบ console ว่ามี error หรือไม่

2. ตรวจสอบ `NEXT_PUBLIC_POLLING_INTERVAL`:
   ```bash
   # ใน .env.local
   NEXT_PUBLIC_POLLING_INTERVAL=2000
   ```

3. Restart dev server

### ปัญหา: Environment Variables ไม่ทำงาน

**วิธีแก้:**

1. ตรวจสอบว่าไฟล์ชื่อ `.env.local` (ไม่ใช่ `.env`)

2. ตรวจสอบว่า variables ขึ้นต้นด้วย `NEXT_PUBLIC_`

3. **Restart dev server** (สำคัญมาก!)

4. ตรวจสอบว่าไม่มี typo:
   ```env
   # ถูกต้อง
   NEXT_PUBLIC_API_BASE_URL=http://localhost:4001
   
   # ผิด (ไม่มี NEXT_PUBLIC_)
   API_BASE_URL=http://localhost:4001
   ```

### ปัญหา: Port 3000 ถูกใช้งานแล้ว

**วิธีแก้:**

```bash
# ใช้ port อื่น
npm run dev -- -p 3001

# หรือหยุด process ที่ใช้ port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

## 📚 เอกสารเพิ่มเติม

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Backend README](../mini-chat-backend/README.md)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

ISC

## 👥 Authors

Mini Chat Application Team

---

## 💡 Tips & Tricks

### 1. ใช้หลายหน้าต่างเพื่อทดสอบ

```bash
# เปิด 2 เบราว์เซอร์
1. Chrome (Normal) → Login เป็น Alice
2. Chrome (Incognito) → Login เป็น Bob
```

### 2. ปรับ Polling สำหรับ Demo

```env
# Demo แบบเร็ว
NEXT_PUBLIC_POLLING_INTERVAL=500

# Demo แบบช้า (ประหยัด bandwidth)
NEXT_PUBLIC_POLLING_INTERVAL=5000
```

### 3. ดู Network Requests

1. เปิด DevTools (F12)
2. ไปที่ tab Network
3. ดู API calls ที่เกิดขึ้น

### 4. ดู Console Logs

1. เปิด DevTools (F12)
2. ไปที่ tab Console
3. ดู configuration และ debug info

---

**Happy Chatting! 💬**
