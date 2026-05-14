# 🌿 Taskflow

A modern full-stack MERN productivity workspace built for collaborative project and task management.

Taskflow helps teams organize projects, manage tasks, assign members, track progress, and collaborate in a clean and cozy interface.

---

## ✨ Features

### 🔐 Authentication

* JWT-based authentication
* Login & signup system
* Persistent sessions
* Role-based access (Admin / Member)

### 📋 Task Management

* Create, edit, and delete tasks
* Assign tasks to team members
* Set priorities and due dates
* Time tracking support
* Task status workflow
* Comment system

### 📁 Project Management

* Create, edit, and delete projects
* Add/remove project members
* Project color customization
* Deadline management

### 👥 Team Collaboration

* Team member management
* Member role badges
* Workspace notifications
* Activity-focused dashboard

### 🎨 UI / UX

* Fully responsive interface
* Modern soft-themed design
* Toast notifications
* Persistent login sessions
* Clean modular React architecture

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* CSS3
* Axios

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs

---

## 📂 Project Structure

```bash
Taskflow/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── utils/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```bash
npm run dev
```

---

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Future Improvements

* Drag & drop Kanban board
* Real-time collaboration
* Analytics dashboard
* Dark mode
* File uploads
* Activity history

---

## 📸 Screenshots

Add your screenshots here after deployment.

---

## 👨‍💻 Author

Developed by Vikas Singh.

---

## 📄 License

This project is for educational and portfolio purposes.
