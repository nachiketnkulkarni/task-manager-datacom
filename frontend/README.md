# 💻 Frontend - Task Management App (React)

Hey there! This is the user-facing side of the app — where tasks come to life through smooth forms, sleek tables, and fast interactions.

---

## 🛠 Running the Frontend Locally

1. Open your terminal and navigate into the frontend:

```bash
cd frontend
```

2. Install all the goodies:

```bash
npm install
```

3. Start the app:

```bash
npm run dev
```

🚀 You’ll find your app live at [http://localhost:5173](http://localhost:5173)

---

## 🔄 Connecting to the Backend

Make sure `vite.config.ts` includes this proxy:

```ts
server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
```

Make sure `axios.ts` updated to includes base url of api:

```ts
const api = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
  },
});
```

This lets the frontend talk to your local backend without CORS issues.

---

## 🚀 Deploying to AWS (S3)

Let’s get this live!

1. Build the production app:

```bash
npm run build
```

2. Go to AWS S3 and:

- Create a new bucket
- Enable static website hosting
- Upload your `dist/` folder
- Set `index.html` as the entry point

---

## 🤝 Assumptions

- Backend is already deployed and accessible over the web
- You’re familiar with basic AWS S3 hosting
- Your `dist` folder is your final app build

---

That’s all — now your users can start managing tasks like champions! 🏆
