# UN-Habitat Project Manager - Deployment Instructions

## Prerequisites
- Python 3.8+
- Node.js 16+
- npm 8+
- (Optional) Git

## 1. Clone or Download the Repository
If using Git:
```powershell
git clone <your-repo-url>
cd UN_Assessment_Test
```
Or download and unzip the source code, then open the folder in your terminal.

## 2. Set Up the Backend (Flask + SQLite)

### a. Create a Virtual Environment (Recommended)
```powershell
python -m venv venv
.\venv\Scripts\Activate
```

### b. Install Python Dependencies
```powershell
pip install -r requirements.txt
```

### c. Initialize the Database
```powershell
python init_db.py
python import_excel.py
```

### d. Start the Flask Server
```powershell
python app.py
```
The backend will run at http://127.0.0.1:5000/

## 3. Set Up the Frontend (React)
```powershell
cd frontend
npm install
npm start
```
The frontend will run at http://localhost:3000/

## 4. Access the Application
- Open http://localhost:3000/ in your browser.
- The React frontend will communicate with the Flask backend.

## 5. Production Build (Optional)
To build the frontend for production:
```powershell
cd frontend
npm run build
```
This creates a `build/` folder with static files. You can serve these with any static file server or configure Flask to serve them.

## Alternative: Serve React Build with Flask

You can deploy the entire app as a single Flask service that serves both the backend API and the React frontend.

1. **Build the React frontend:**
   ```powershell
   cd frontend
   npm run build
   cd ..
   ```
   This creates a `frontend/build/` directory with static files.

2. **Ensure Flask is configured to serve the React build** (already set up in `app.py`):
   - Flask will serve files from `frontend/build` and route all unknown paths to `index.html`.

3. **Start the Flask server:**
   ```powershell
   python app.py
   ```
   - Visit [http://127.0.0.1:5000/](http://127.0.0.1:5000/) to use the app.

4. **Deploy to production:**
   - Use a WSGI server (e.g., Gunicorn) and a reverse proxy (e.g., Nginx) for production.
   - All static frontend files and API endpoints are served from the same Flask app.

This approach simplifies deployment and hosting, as you only need to run and expose the Flask service.

## 6. Notes
- Ensure both backend and frontend are running for full functionality.
- For deployment to a server (e.g., Azure, Heroku, DigitalOcean), use a production WSGI server (e.g., Gunicorn) for Flask and a static file server (e.g., Nginx) for the React build.
- Update CORS settings in `app.py` if deploying to a different domain.

## 7. Troubleshooting
- If you see database errors, rerun `init_db.py` and `import_excel.py`.
- If ports are in use, change the port in `app.py` or `frontend/package.json` (proxy setting).

---

For any issues, please check the README or contact the project maintainer.
