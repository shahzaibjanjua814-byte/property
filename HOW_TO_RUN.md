# How to Run the Project Locally

This project is a monorepo containing a React frontend and an Express/Node.js backend. You can run the project either using Docker (the easiest way) or manually using npm/bun.

## Option 1: Using Docker (Recommended)
If you have Docker Desktop installed, this is the fastest way to get both the frontend and backend running together.

1. Open a terminal or command prompt in the root directory (`Property-Bazaar-main\Property-Bazaar-main`)
2. Run the following command:
   ```bash
   docker-compose up
   ```
   *(To rebuild the containers if you made structural changes or added new packages, run `docker-compose up --build`)*

3. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Option 2: Running Manually (Without Docker)

If you prefer to run the Node.js servers directly on your machine, you will need to start both the frontend and backend in separate terminal windows.

### Step 1: Start the Backend Server
1. Open a new terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` (if not already done) and fill in your environment variables.
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The backend should now be running on port 3001.*

### Step 2: Start the Frontend Server
1. Open a **second** terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend should now be accessible at http://localhost:3000 (or whichever port Vite gives you).*

---

### Troubleshooting
- **Database Connection**: Make sure your local MySQL or database details specified in `backend/.env` are correct and running if you chose the manual method. (With Docker, it may handle database containerization depending on your `docker-compose.yml` configuration).
- **Environment Variables**: Make sure both `frontend` and `backend` directories have the `.env` configuration they need. There are `.env.example` files provided as templates.
