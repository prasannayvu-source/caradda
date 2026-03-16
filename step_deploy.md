# CAR ADDA Deployment Guide (Complete Step-by-Step)

This guide is written for complete beginners. It will walk you through exactly how to take your CAR ADDA application and put it online using **Railway** (for the backend) and **Vercel** (for the frontend). It will also explain how to connect the two together step-by-step.

---

## 🛠 Prerequisites

Make sure you have the following information handy (you can find these in the `backend/.env` file on your computer):
- `SUPABASE_URL` 
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `JWT_SECRET`

You also need:
- A GitHub account where this repository is uploaded (`https://github.com/prasannayvu-source/caradda.git`).
- A free Railway Account (sign up at https://railway.app using GitHub).
- A free Vercel Account (sign up at https://vercel.com using GitHub).

---

## Part 1: Deploying the Backend on Railway

The backend handles the connections to your Supabase database, handles logins, creates bills, sends WhatsApp messages, and tracks inventory. 

### Step 1.1: Create a Railway Project
1. Log into your account at **[Railway.app](https://railway.app)**.
2. At the top-right corner, click on the **+ New Project** button.
3. Select **Deploy from GitHub repo**.
4. In the list of repositories, select **`prasannayvu-source/caradda`**. 
   - *(If you don't see it, click "Configure GitHub App" to give Railway permission to read that specific repository).*
5. Click **Deploy Now**.
   - *Note: Don't worry if the deployment says "Failed" right away. We haven't told Railway where the backend is located or given it our database secrets yet!*

### Step 1.2: Configure Railway Settings
1. Click on the newly created deployment box (it will say "caradda").
2. At the top of the menu, click on the **Settings** tab.
3. Scroll down to the **Build** section and look for **Root Directory**.
4. Click the Edit button (usually a small pencil icon) next to it, type `/backend`, and click the checkmark or **Save**. 
   - *This tells Railway "Hey, my Python backend code is in the 'backend' folder, not in the main folder."*

### Step 1.3: Add Environment Variables (Secrets)
1. Stay on the same project page, but at the top menu, click on the **Variables** tab.
2. Here, you will add the secrets from your local `backend/.env` file one by one. Click **+ New Variable** for each:
   - **VARIABLE NAME:** `SUPABASE_URL`
     - **VALUE:** `(Your exact Supabase URL, e.g., https://xxxxxxxxxxxx.supabase.co)`
   - **VARIABLE NAME:** `SUPABASE_SERVICE_ROLE_KEY`
     - **VALUE:** `(Your exact Supabase service role key)`
   - **VARIABLE NAME:** `SUPABASE_ANON_KEY`
     - **VALUE:** `(Your anon key)`
   - **VARIABLE NAME:** `JWT_SECRET`
     - **VALUE:** `(Your JWT secret)`
   - **VARIABLE NAME:** `FRONTEND_URL`
     - **VALUE:** `https://caradda-frontend.vercel.app` ← set this IMMEDIATELY, do not leave as localhost
     
3. After adding these variables, Railway is smart and will automatically start rebuilding your site correctly. 

### Step 1.4: Generate a Public URL for your Backend
1. Go back to the **Settings** tab.
2. Scroll to the **Environment** section and look for **Public Networking**.
3. Click the button that says **Generate Domain**.
4. Railway will generate a link for you (e.g., `caradda-production.up.railway.app`).
5. **CRITICAL:** Copy this exact link. You will need it in the next part. 

---

## Part 2: Deploying the Frontend on Vercel

The frontend is the visual interface (the buttons, charts, and pages) that you interact with.

### Step 2.1: Import the Project in Vercel
1. Log into your account at **[Vercel.com](https://vercel.com/dashboard)**.
2. On your dashboard, click the black **Add New...** button and select **Project**.
3. You will see a list of your GitHub repositories. Find **`prasannayvu-source/caradda`** and click the blue **Import** button.

### Step 2.2: Configure Vercel Settings
1. Wait for the configuration menu to load. Use the following settings exactly:
   - **Project Name:** Leave as `caradda` (or whatever you prefer).
   - **Framework Preset:** Scroll through the dropdown and select **Vite**.
   - **Root Directory:** Click the "Edit" button here. Select the `frontend` folder from the popup list and click "Continue".
2. **Build and Output Settings:** Leave these as the defaults (`npm run build` and `dist`).

### Step 2.3: Zero Configuration Architecture
*You do NOT need to set any environment variables in Vercel!* The application code has been smart-wired to automatically securely route all live traffic directly directly to your Railway server through Vercel's proxy edge network. This solves problems specifically with strict Internet Service Providers (like Jio Fiber) blocking Railway domains.

### Step 2.4: Deploy!
1. Click the big **Deploy** button at the bottom of the page.
2. Vercel will now download, build, and deploy your site. This will take about 1 to 2 minutes.
3. When it is finished, you will see a screen celebrating your deployment. Click **Continue to Dashboard**.
4. At the top of your Vercel dashboard for this project, you will see the **Domains** listing (e.g., `caradda.vercel.app`). 
5. **CRITICAL:** Copy this domain exactly, including the "https://". Do not include a slash `/` at the end! 

---

## Part 3: The Handshake (Connecting Both Sides Safely)

For security, the backend (Railway) needs permission to accept requests from your exact frontend domain, otherwise, it blocks the connections (this is called a CORS error). Let's do the final handshake.

### Step 3.1: Update Railway Variables
1. Go back to your project in **Railway**.
2. Go to the **Variables** tab.
3. Find the `FRONTEND_URL` variable you created earlier.
4. Click the small pencil icon to edit it.
5. Change it from `http://localhost:5173` to your **exact Vercel domain** from step 2.4.
   - *Example: `https://caradda.vercel.app`*
6. Press enter to save. Railway will automatically initiate a quick redeploy.

### You Are Done! 🎉
1. Wait just a moment for Railway's quick redeployment to finish.
2. Visit your new Vercel URL (e.g., `https://caradda.vercel.app`).
3. You should see the CAR ADDA login page, and it will be completely functional! 

*Note regarding PWA (Mobile Apps)*: Because the site is now served over a safe `HTTPS` connection, when you open the URL on your mobile phone (Safari or Chrome), the "Install CAR ADDA to Homescreen" prompt will trigger, and it will behave entirely like a native mobile app!
