# 👨‍💻 Backend - Task Management API

Welcome to the engine room of the Task Management App! This is where all the core logic lives — authentication, data management, and business rules.

---

## 🚀 Getting Started Locally

Here’s how you can get the backend running on your machine:

1. Navigate to the backend folder:

```bash
cd backend
```

2. Create a `.env` file with the following content:

```env
PORT=3000
MONGO_URI=your_mongodb_uri
DEFAULT_PAGE_LIMIT=10
```

3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm run dev
```

✨ Your backend will now be live at [http://localhost:3000](http://localhost:3000)

---

## 📘 Interactive API Docs with Swagger

After starting the server, visit:

👉 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Here you’ll find interactive docs — a great way to explore and test the API.

---

## 🚀 Deploying the Backend to AWS (Lambda Style!)

Want to go live? Here’s how:

1. Install the Serverless Framework:

```bash
npm install -g serverless
```

2. Ensure you have a `handler.js` like this:

```js
import serverless from "serverless-http";
import app from "./server.js";
export const handler = serverless(app);
```

3. Deploy with one simple command:

```bash
serverless deploy
```

You’ll get a live URL to hit your endpoints. Boom, you’re in the cloud!

---

## 🤝 Assumptions

- You're using MongoDB Atlas or a publicly accessible DB.
- Swagger JSDoc annotations are already added in your route files.
- `type: "module"` is set in your package.json for ESModule syntax.

---

That’s it! You’re ready to conquer tasks like a pro 👨‍🔧
