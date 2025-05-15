import sqlite3

DB_FILE = 'projects.db'

with open('schema.sql', 'r') as f:
    schema = f.read()

conn = sqlite3.connect(DB_FILE)
c = conn.cursor()

# Drop tables if they exist (for re-initialization)
tables = ['ProjectDonor', 'ProjectTheme', 'ProjectCountry', 'Donor', 'Theme', 'Country', 'Project']
for table in tables:
    c.execute(f'DROP TABLE IF EXISTS {table}')

# Create tables
c.executescript(schema)

conn.commit()
conn.close()
print('Database initialized.')
