# 🎓 Campus OS - Singularity V1.0

Campus OS is a next-generation, AI-powered multi-tenant college management system built for the modern educational ecosystem. It features a stunning Cyberpunk/Glassmorphism UI and integrates advanced AI capabilities for administrative tasks and student career counseling.

## 🚀 Key Features & Modules

### 1. 🔐 Multi-Tenant Role-Based Access Control (RBAC)
- **Superadmin:** Oversees all colleges in the system.
- **Admin:** Manages data, students, and faculty specific to their assigned college.
- **Faculty:** Accesses academic modules and grading systems.
- **Student:** Accesses exams, hostel, placements, and academic records.

### 2. 🤖 AI Integration (NVIDIA NIM - Llama 3.1)
- **AI Resume Matcher (Placements):** Students can upload their PDF resumes. The system parses the PDF and uses the NVIDIA Llama 3.1 model to score their resume against current job descriptions (e.g., Google, Microsoft) and extracts missing keywords.
- **Context-Aware Admin Assistant:** A floating AI Chatbot widget available in the portal. It fetches **Live Database Statistics** directly from Supabase (Total Identities, Enrolled Students, Pending Users) and feeds it into the AI's context window. This ensures the AI provides real-time, non-hallucinated answers regarding college data.
- **Graceful Degradation (Demo Mode):** If the NVIDIA API key is missing, the AI modules automatically fall back to a "Demo Mode" providing mock responses, ensuring presentations never break.

### 3. 📝 Exam Portal & Live Proctoring
- **Student View:** View active exams, previous results, and participate in ongoing exams. Features a mock webcam interface for live AI proctoring status.
- **Admin/Faculty View:** Monitor live exams, view total candidates, active sessions, and flagged suspicious activities (e.g., multiple faces detected, tab switching).

### 4. 🏨 Hostel Administration
- **Student View:** Check room details, mess status, late entry warnings, and apply for leaves/outpasses dynamically.
- **Warden View:** A comprehensive dashboard to review and Approve/Reject pending outpass requests. It tracks total residents, present students, and triggers emergency security broadcasts.

### 5. 💼 Placement Cell
- **Admin View:** Track student placement eligibility and freeze/unfreeze students from participating in placement drives due to academic probation.
- **Student View:** Apply for live job postings and utilize the AI Resume Matcher to check their probability of getting shortlisted before applying.

### 6. 🎨 UI/UX & Aesthetics
- Built with a premium dark-mode, glassmorphism aesthetic.
- Features dynamic animations, glowing borders, and reactive hover states.
- Fully responsive design using Tailwind CSS and custom CSS variables.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS, Vanilla CSS (`index.css` for custom glassmorphism tokens), Lucide React (Icons)
- **Backend/API:** Next.js Serverless Route Handlers
- **Database & Auth:** Supabase (PostgreSQL, Auth, Row Level Security)
- **AI Processing:** NVIDIA API (Llama-3.1-8b-instruct via OpenAI SDK format)
- **File Parsing:** `pdf-parse` for extracting text from uploaded resumes.

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd campus-os
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NVIDIA_API_KEY=your_nvidia_api_key
```

### 4. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

---

## 🗄️ Database Schema (Supabase)

The project relies on several key tables configured in Supabase:
- `users`: Managed by Supabase Auth (`auth.users`), extended with `user_metadata` for roles (`student`, `faculty`, `admin`, `superadmin`) and `college_name`.
- `hostel_residents`: Tracks room allocation, late entries, and mess plans.
- `hostel_leaves`: Tracks outpass requests (`start_date`, `end_date`, `reason`, `status`).
- `hostel_alerts`: Tracks security and disciplinary alerts.

*(Note: Row Level Security (RLS) and Service Role keys are utilized to ensure Admins can only view data from their specific college).*

---

## 👨‍💻 Developed For
Built as a comprehensive hackathon project showcasing the integration of Modern Web Technologies, AI, and Cloud Databases to solve real-world college administration problems.
