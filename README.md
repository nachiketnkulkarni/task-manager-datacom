# 🌍 Fullstack - Task Management Application

Welcome to the complete system — backend + frontend, together at last.

---

## 🧑‍💻 Local Setup Guide

Let’s run both parts together on your local machine:

---

### 🔹 Step 1: Start the Backend

```bash
cd backend
npm install
npm run dev
```

Backend API will be ready at: [http://localhost:3000](http://localhost:3000)

---

### 🔹 Step 2: Launch the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend UI is live at: [http://localhost:5173](http://localhost:5173)

Make sure your Vite proxy is pointing to your local backend!

---

## 🚀 Deploying to AWS (Step-by-Step)

### 🔸 Backend: Lambda + API Gateway

1. Install Serverless Framework

```bash
npm install -g serverless
```

2. Ensure `handler.js` exists and exports your Express app

3. Deploy to AWS:

```bash
serverless deploy
```

You’ll receive a live API URL. Use this in your frontend for API requests.

---

### 🔸 Frontend: S3 + Optional CloudFront

1. Build your frontend app:

```bash
npm run build
```

2. Upload the content of `dist/` folder to an S3 bucket

3. Enable static site hosting and make the files public

---

## 💡 Assumptions

- Serverless deployment is set up with `serverless.yml`
- Swagger annotations are present for API testing
- React is talking to the backend via Axios and Vite proxy in local mode

---

You’re now equipped to run and deploy a full production-ready task app! 💪

Happy hacking!
