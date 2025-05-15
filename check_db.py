import sqlite3

conn = sqlite3.connect('projects.db')
c = conn.cursor()

# Check if Project table exists
c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Project';")
if c.fetchone() is None:
    print('Project table does not exist.')
else:
    # Count rows in Project table
    c.execute('SELECT COUNT(*) FROM Project;')
    count = c.fetchone()[0]
    print(f'Project table row count: {count}')
    # Show a few rows if any
    if count > 0:
        c.execute('SELECT * FROM Project LIMIT 3;')
        for row in c.fetchall():
            print(row)
    else:
        print('No data in Project table.')
conn.close()
