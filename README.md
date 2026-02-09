# Fridge to Fork 🥗

**Fridge to Fork** is a smart, AI-powered recipe generator designed to help you clear out your kitchen while discovering delicious new meals. By inputting the ingredients you have on hand, the app generates tailored recipe suggestions to minimize food waste and simplify meal planning.

**Live Demo:** [https://fridge-to-fork-01.netlify.app/](https://fridge-to-fork-01.netlify.app/)

---

## ✨ Features

* **Ingredient-Based Discovery:** Input the ingredients you have in your fridge or pantry to see what you can cook right now.
* **Adjustable Servings:** Scale your recipes easily with a servings controller (supporting 1 to 12 servings).
* **Triple-Recipe Output:** Every search generates three distinct recipe options, giving you variety in your meal planning.
* **Detailed Instructions:** Each recipe includes a description, a list of additional common pantry items needed, step-by-step cooking instructions, and estimated prep/cook time.
* **Responsive Design:** Optimized for a seamless experience on both desktop and mobile devices.

## 🛠️ Tech Stack

* **Frontend:** [React](https://reactjs.org/) 
* **AI Integration:** Google Gemini API
* **Backend & Hosting:** [Netlify](https://www.netlify.com/) (utilizing Netlify Functions for secure API proxying)
* **Styling:** Modern, custom CSS


## 🏗️ Architecture

```
Client (React App)  →  Netlify Serverless Function  →  Google Gemini API
                         (gemini-proxy.mjs)
                         keeps API key secure
```

The app uses a serverless proxy pattern to keep the Gemini API key secure. The React frontend sends requests to a Netlify Function, which forwards them to the Gemini API. This way, the API key is never exposed to the client.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`)
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/fridge-to-fork.git
cd fridge-to-fork
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ Never commit your `.env` file. Make sure it's listed in `.gitignore`.

### 4. Run locally with Netlify Dev

```bash
netlify dev
```

This starts both the React dev server and the Netlify Functions locally, so the API proxy works just like it does in production.

The app will be available at `http://localhost:8888`.

---

## 🌐 Deploying to Netlify

1. Push your repo to GitHub
2. Go to [Netlify](https://app.netlify.com/) and click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repo
4. Set the build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
5. Add your environment variable:
   - Go to **Site settings** → **Environment variables**
   - Add `GEMINI_API_KEY` with your API key
6. Deploy! Netlify will automatically detect the serverless function in `netlify/functions/`

---
## 🤝 Connect

Built by **Abi** — follow along for more projects and dev content!

[![Instagram](https://img.shields.io/badge/Instagram-@devanddesigns-E4405F?style=flat&logo=instagram&logoColor=white)](https://www.instagram.com/devanddesigns)
