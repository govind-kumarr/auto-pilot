# Auto-Pilot 🚀

**Automating Job Applications with AI**

Auto-Pilot is designed to simplify and accelerate the job application process. Instead of manually reading job posts, writing emails, and sending resumes hundreds of times, Auto-Pilot handles it intelligently using AI.

---

## Features ✨

- **Google Sign-In** – Quickly access your account without creating new credentials.
- **Resume Upload** – Upload your resume once; Auto-Pilot uses it for multiple applications.
- **LinkedIn Job Post Analysis** – Paste LinkedIn job post URLs, and the app automatically extracts roles and key details.
- **AI-Powered Email Generation** – Auto-generates personalized email subject lines and body content tailored to the job post.
- **Manual or Auto Send** – Copy emails manually or send them directly after review.
- **Role Selection** – Choose which roles to apply for if a post lists multiple positions.

---

## How It Works ⚙️

1. User signs in with Google.
2. Uploads their resume.
3. Pastes LinkedIn job post URLs into the app.
4. Auto-Pilot analyzes the posts and extracts job roles.
5. User selects desired roles.
6. Auto-Pilot generates a personalized email with subject, body, and resume link.
7. User can either:
   - Copy the email content manually, or
   - Click **Send Email** to send it after review.

---

## Tech Stack 🛠️

- **Frontend & Backend:** NextJS
- **Automation & AI:** Puppeteer + AI modules for parsing and email generation
- **Authentication:** Google OAuth
- **Database:** MongoDB

---

## Getting Started 🚀

1. Clone the repository:
   ```bash
   git clone https://github.com/govind-kumarr/auto-pilot.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (Google OAuth credentials, etc.)
4. Start the app:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`

---

