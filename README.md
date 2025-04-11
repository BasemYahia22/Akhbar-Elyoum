
# 📚 Akhbar Elyoum Academy – Credit Hour System

A modern web application for managing student enrollment, course registration, academic performance tracking, and GPA calculation based on the Credit Hour System. This project uses a React frontend with RESTful API integration.

## ✨ Frontend Features

### 🔹 General
- Professional UI with Akhbar Elyoum Academy's official logo and branding.
- Fully responsive design built with **Tailwind CSS**.
- Smooth routing using **React Router v7**.

### 🔹 Authentication
- Unified login page for Students, Professors, and Admins.
- Academy logo and name prominently displayed.

### 🔹 Student Dashboard
- Displays:
  - Name, major, academic level.
  - GPA, CGPA, credit hours (registered/passed).
- Circular progress bars for academic indicators.
- Course registration with:
  - Prerequisite and GPA checks.
  - Real-time notifications for restrictions.
- Grade tracking:
  - Midterm, assignment, and final grades.
  - Grade symbol guide included.
- Option to request grade review.

### 🔹 Professor Dashboard
- Add midterm and assignment grades.
- Automatic final grade calculation.
- Provide student feedback.
- Modify grades before finalization.

### 🔹 Admin Dashboard
- User Management:
  - Add/update Students, Professors, and Admins.
  - Account activation/deactivation.
- Course Management:
  - Add/update Courses.
  - Course activation/deactivation.
  - Set prerequisites.
- Monitor login and academic activity.
- Monitor student grades.
- Add schedules.

---

## ⚙️ Technologies Used

### 🖥 Frontend
- **React 19** – Building dynamic UI components.
- **Vite** – Fast development server and build tool.
- **Tailwind CSS 3.4.17** – Utility-first CSS framework for styling.
- **React Router v7** – Page routing and navigation.
- **Redux Toolkit** – Efficient global state management.
- **Redux Persist** – Persisting Redux state across sessions.
- **Axios** – Making HTTP requests to the RESTful API.
- **FontAwesome** – Icon library for UI elements.
- **React Circular Progressbar** – Visualizing academic indicators.

### 🛠 Development Tools
- **ESLint** – Code linting and style consistency.
- **PostCSS & Autoprefixer** – CSS processing and compatibility.
- **@vitejs/plugin-react** – React support in Vite.
- **TypeScript types for React** – Enhanced type safety (optional).
- **Git** – Version control and source code management.

---

## 🚀 How to Run the Project

### 📥 Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- MySQL Workbench
  * Download this my sql workbranch : https://dev.mysql.com/downloads/workbench/
  * download Server : https://dev.mysql.com/downloads/installer/
  * Video for Install : https://www.youtube.com/watch?v=hiS_mWZmmI0

- Backend RESTful API must be running (provide API base URL)

---

### 🔧 Setup Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/BasemYahia22/Akhbar-Elyoum.git
cd Akhbar-Elyoum
```

#### 2. Install Frontend Dependencies

```bash
npm install
```

#### 3. Configure Environment

Create a `.env` file in the root and add your backend API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

#### 4. Run the Frontend

```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## ⚙️ Running the Backend (RESTful API)

> Make sure you’re on the `backend` branch or in the `backend` folder.

#### 1. Clone or Switch to Backend Branch

```bash
git clone -b backend https://github.com/BasemYahia22/Akhbar-Elyoum.git
cd Akhbar-Elyoum
```

#### 2. Install Backend Dependencies

Make sure you're using a virtual environment and Flask is installed.

```bash
python -m venv .venv
.venv\Scripts\activate  # Use 'source .venv/bin/activate' on Mac/Linux
pip install -r requirements.txt
```

#### 3. Run the Backend Server

```bash
flask --app backend run --debug
```

The backend will run on: [http://localhost:5000](http://localhost:5000)

---

## ✅ Final Notes

- Make sure both frontend and backend are running for the app to function correctly.
- You can use tools like **Postman** to test the API separately.
- Ensure CORS is enabled on the backend for API calls from the frontend.

---
