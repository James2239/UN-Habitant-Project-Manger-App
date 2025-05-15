from flask import Flask, request, jsonify, send_from_directory
import os
import sqlite3
from flask_cors import CORS

app = Flask(__name__, static_folder='frontend/build', static_url_path='/')
CORS(app)
DATABASE = 'projects.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return 'Project Management API is running.'

# --- API Endpoints ---

@app.route('/api/projects/all', methods=['GET'])
def get_all_projects():
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT * FROM Project')
    projects = []
    for row in cur.fetchall():
        project = dict(row)
        project_id = project['ProjectID']
        # Fetch countries
        cur.execute('''SELECT c.CountryName FROM Country c
                       JOIN ProjectCountry pc ON c.CountryID = pc.CountryID
                       WHERE pc.ProjectID = ?''', (project_id,))
        project['Countries'] = [r[0] for r in cur.fetchall()]
        # Fetch themes
        cur.execute('''SELECT t.ThemeName FROM Theme t
                       JOIN ProjectTheme pt ON t.ThemeID = pt.ThemeID
                       WHERE pt.ProjectID = ?''', (project_id,))
        project['Themes'] = [r[0] for r in cur.fetchall()]
        # Fetch donors
        cur.execute('''SELECT d.DonorName FROM Donor d
                       JOIN ProjectDonor pd ON d.DonorID = pd.DonorID
                       WHERE pd.ProjectID = ?''', (project_id,))
        project['Donors'] = [r[0] for r in cur.fetchall()]
        projects.append(project)
    conn.close()
    return jsonify(projects)

@app.route('/api/projects/country/<country>', methods=['GET'])
def get_projects_by_country(country):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('''SELECT p.* FROM Project p
        JOIN ProjectCountry pc ON p.ProjectID = pc.ProjectID
        JOIN Country c ON pc.CountryID = c.CountryID
        WHERE c.CountryName = ?''', (country,))
    projects = [dict(row) for row in cur.fetchall()]
    conn.close()
    return jsonify(projects)

@app.route('/api/projects/Approval Status/<status>', methods=['GET'])
def get_projects_by_status(status):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT * FROM Project WHERE ApprovalStatus = ?', (status,))
    projects = [dict(row) for row in cur.fetchall()]
    conn.close()
    return jsonify(projects)

# --- CRUD for Project ---

@app.route('/api/project', methods=['POST'])
def add_project():
    data = request.json
    conn = get_db()
    cur = conn.cursor()
    cur.execute('''INSERT INTO Project (ProjectID, ProjectTitle, PAASCode, ApprovalStatus, Fund, PAGValue, StartDate, EndDate, LeadOrgUnit, TotalExpenditure, TotalContribution, TotalContributionMinusExpenditure, TotalPSC)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        (data['ProjectID'], data['ProjectTitle'], data['PAASCode'], data['ApprovalStatus'], data['Fund'], data['PAGValue'], data['StartDate'], data['EndDate'], data['LeadOrgUnit'], data['TotalExpenditure'], data['TotalContribution'], data['TotalContributionMinusExpenditure'], data['TotalPSC']))
    # Handle countries if provided
    if 'Countries' in data and isinstance(data['Countries'], list):
        for country in data['Countries']:
            cur.execute('SELECT CountryID FROM Country WHERE CountryName=?', (country,))
            row = cur.fetchone()
            if row:
                country_id = row[0]
            else:
                cur.execute('INSERT INTO Country (CountryName) VALUES (?)', (country,))
                country_id = cur.lastrowid
            cur.execute('INSERT OR IGNORE INTO ProjectCountry (ProjectID, CountryID) VALUES (?, ?)', (data['ProjectID'], country_id))
    # Handle themes if provided
    if 'Themes' in data and isinstance(data['Themes'], list):
        for theme in data['Themes']:
            cur.execute('SELECT ThemeID FROM Theme WHERE ThemeName=?', (theme,))
            row = cur.fetchone()
            if row:
                theme_id = row[0]
            else:
                cur.execute('INSERT INTO Theme (ThemeName) VALUES (?)', (theme,))
                theme_id = cur.lastrowid
            cur.execute('INSERT OR IGNORE INTO ProjectTheme (ProjectID, ThemeID) VALUES (?, ?)', (data['ProjectID'], theme_id))
    # Handle donors if provided
    if 'Donors' in data and isinstance(data['Donors'], list):
        for donor in data['Donors']:
            cur.execute('SELECT DonorID FROM Donor WHERE DonorName=?', (donor,))
            row = cur.fetchone()
            if row:
                donor_id = row[0]
            else:
                cur.execute('INSERT INTO Donor (DonorName) VALUES (?)', (donor,))
                donor_id = cur.lastrowid
            cur.execute('INSERT OR IGNORE INTO ProjectDonor (ProjectID, DonorID) VALUES (?, ?)', (data['ProjectID'], donor_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Project added successfully.'})

@app.route('/api/project/<int:project_id>', methods=['PUT'])
def edit_project(project_id):
    data = request.json
    conn = get_db()
    cur = conn.cursor()
    cur.execute('''UPDATE Project SET ProjectTitle=?, PAASCode=?, ApprovalStatus=?, Fund=?, PAGValue=?, StartDate=?, EndDate=?, LeadOrgUnit=?, TotalExpenditure=?, TotalContribution=?, TotalContributionMinusExpenditure=?, TotalPSC=? WHERE ProjectID=?''',
        (data['ProjectTitle'], data['PAASCode'], data['ApprovalStatus'], data['Fund'], data['PAGValue'], data['StartDate'], data['EndDate'], data['LeadOrgUnit'], data['TotalExpenditure'], data['TotalContribution'], data['TotalContributionMinusExpenditure'], data['TotalPSC'], project_id))
    # Update countries if provided
    if 'Countries' in data and isinstance(data['Countries'], list):
        cur.execute('DELETE FROM ProjectCountry WHERE ProjectID=?', (project_id,))
        for country in data['Countries']:
            cur.execute('SELECT CountryID FROM Country WHERE CountryName=?', (country,))
            row = cur.fetchone()
            if row:
                country_id = row[0]
            else:
                cur.execute('INSERT INTO Country (CountryName) VALUES (?)', (country,))
                country_id = cur.lastrowid
            cur.execute('INSERT OR IGNORE INTO ProjectCountry (ProjectID, CountryID) VALUES (?, ?)', (project_id, country_id))
    # Update themes if provided
    if 'Themes' in data and isinstance(data['Themes'], list):
        cur.execute('DELETE FROM ProjectTheme WHERE ProjectID=?', (project_id,))
        for theme in data['Themes']:
            cur.execute('SELECT ThemeID FROM Theme WHERE ThemeName=?', (theme,))
            row = cur.fetchone()
            if row:
                theme_id = row[0]
            else:
                cur.execute('INSERT INTO Theme (ThemeName) VALUES (?)', (theme,))
                theme_id = cur.lastrowid
            cur.execute('INSERT OR IGNORE INTO ProjectTheme (ProjectID, ThemeID) VALUES (?, ?)', (project_id, theme_id))
    # Update donors if provided
    if 'Donors' in data and isinstance(data['Donors'], list):
        cur.execute('DELETE FROM ProjectDonor WHERE ProjectID=?', (project_id,))
        for donor in data['Donors']:
            cur.execute('SELECT DonorID FROM Donor WHERE DonorName=?', (donor,))
            row = cur.fetchone()
            if row:
                donor_id = row[0]
            else:
                cur.execute('INSERT INTO Donor (DonorName) VALUES (?)', (donor,))
                donor_id = cur.lastrowid
            cur.execute('INSERT OR IGNORE INTO ProjectDonor (ProjectID, DonorID) VALUES (?, ?)', (project_id, donor_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Project updated successfully.'})

@app.route('/api/project/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('DELETE FROM Project WHERE ProjectID=?', (project_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Project deleted successfully.'})

@app.route('/api/project/<int:project_id>', methods=['GET'])
def get_project(project_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT * FROM Project WHERE ProjectID=?', (project_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return jsonify({'error': 'Project not found'}), 404
    project = dict(row)
    # Fetch countries for this project
    cur.execute('''SELECT c.CountryName FROM Country c
                   JOIN ProjectCountry pc ON c.CountryID = pc.CountryID
                   WHERE pc.ProjectID = ?''', (project_id,))
    countries = [r[0] for r in cur.fetchall()]
    project['Countries'] = countries
    # Fetch themes for this project
    cur.execute('''SELECT t.ThemeName FROM Theme t
                   JOIN ProjectTheme pt ON t.ThemeID = pt.ThemeID
                   WHERE pt.ProjectID = ?''', (project_id,))
    themes = [r[0] for r in cur.fetchall()]
    project['Themes'] = themes
    # Fetch donors for this project
    cur.execute('''SELECT d.DonorName FROM Donor d
                   JOIN ProjectDonor pd ON d.DonorID = pd.DonorID
                   WHERE pd.ProjectID = ?''', (project_id,))
    donors = [r[0] for r in cur.fetchall()]
    project['Donors'] = donors
    conn.close()
    return jsonify(project)

# Serve React build static files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
