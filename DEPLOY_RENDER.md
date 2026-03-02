# Deploying Property Bazaar to Render

Since your database is already hosted, follow these steps to deploy your Backend and Frontend to Render.

## 🚀 Step 1: Deploy the Backend (Web Service)

The backend provides the API and handles data logic.

1. **Log in to [Render Dashboard](https://dashboard.render.com/)**.
2. Click **+ New** and select **Web Service**.
3. Select your GitHub repository: `hafizmubasharimran/Property-Bazaar`.
4. Fill in the following settings:
   - **Name**: `property-bazaar-backend`
   - **Language**: `Node`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Click **Advanced** and add the following **Environment Variables** (these are your actual live credentials):
   - `DB_HOST`: `216.106.180.123`
   - `DB_USER`: `webdevco_realuser`
   - `DB_PASSWORD`: `adeel@490A`
   - `DB_NAME`: `webdevco_real`
   - `JWT_SECRET`: `property_bazaar_secret_key_789`
   - `EMAIL_HOST`: `smtp.gmail.com`
   - `EMAIL_PORT`: `465`
   - `EMAIL_USER`: `adeelgwa@gmail.com`
   - `EMAIL_PASS`: `mgologwwfxcexwdc`
   - `PORT`: `3001`
6. Click **Create Web Service**.

> [!IMPORTANT]
> Once the backend is deployed, Render will give you a URL (e.g., `https://property-bazaar-backend.onrender.com`). **Copy this URL** for the next step.

---

## 🎨 Step 2: Deploy the Frontend (Static Site)

The frontend is the actual website users interact with.

1. Click **+ New** and select **Static Site**.
2. Select the same GitHub repository.
3. Fill in the following settings:
   - **Name**: `property-bazaar-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Click **Advanced** and add the following **Environment Variables**:
   - `VITE_API_URL`: (Paste your Backend URL from Step 1)
   - `VITE_BYTEZ_API_KEY`: `9b9fcd249b61ec762cb4314b43269e54`
5. Click **Create Static Site**.

---

## ✅ Deployment Checklist

- [ ] Backend is "Live" with green status.
- [ ] Frontend is "Live" with green status.
- [ ] You can visit the Frontend URL and see your website.
- [ ] You can log in/signup (verify DB connection works).

---

## 🛠 Troubleshooting

- **CORS Error**: If the frontend cannot talk to the backend, ensure the `VITE_API_BASE_URL` is correct and the backend allows CORS from your frontend URL.
- **Build Failure**: Check the logs in Render dashboard. Common issues are missing dependencies or incorrect Root Directory settings.
