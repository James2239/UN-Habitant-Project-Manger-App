import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function Dashboard() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/projects/all')
      .then(res => res.json())
      .then(data => {
        // Logging the first few projects for debugging
        console.log('Fetched projects:', data.slice(0, 5));
        setProjects(data);
      });
  }, []);

  // Helper to count by key (for arrays in project)
  const countBy = (arr, key) => {
    const counts = {};
    arr.forEach(item => {
      let values = item[key];
      if (!values) return;
      if (Array.isArray(values)) {
        values.forEach(v => {
          v = v && v.trim();
          if (v) counts[v] = (counts[v] || 0) + 1;
        });
      } else if (typeof values === 'string') {
        values.split(',').forEach(v => {
          v = v && v.trim();
          if (v) counts[v] = (counts[v] || 0) + 1;
        });
      }
    });
    return counts;
  };

  // Prepare data for charts
  const countryCounts = countBy(projects, 'Countries');
  const orgUnitCounts = countBy(projects, 'LeadOrgUnit');
  const themeCounts = countBy(projects, 'Themes');

  // Debug: log the counts
  console.log('countryCounts:', countryCounts);
  console.log('themeCounts:', themeCounts);

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      <div className="row">
        <div className="col-12 mb-4">
          <h5>Projects by Country</h5>
          <div style={{ height: '500px' }}>
            <Bar
              data={{
                labels: Object.keys(countryCounts),
                datasets: [{
                  label: 'Projects',
                  data: Object.values(countryCounts),
                  backgroundColor: '#009EDB',
                }],
              }}
              options={{
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const country = context.label;
                        const count = context.parsed.y;
                        // List project titles for this country
                        const projectTitles = projects.filter(p => {
                          let countries = p.Countries;
                          if (typeof countries === 'string') countries = countries.split(',');
                          return Array.isArray(countries) && countries.map(c => c.trim()).includes(country);
                        }).map(p => p.ProjectTitle);
                        return [
                          `Projects: ${count}`,
                          ...projectTitles.map(title => `- ${title}`)
                        ];
                      }
                    }
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { ticks: { autoSkip: false }, title: { display: true, text: 'Country' } },
                  y: { title: { display: true, text: 'Number of Projects' }, beginAtZero: true }
                },
              }}
            />
          </div>
        </div>
        <div className="col-12 mb-4">
          <h5>Projects by Lead Org Unit</h5>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <Pie
              data={{
                labels: Object.keys(orgUnitCounts),
                datasets: [{
                  label: 'Projects',
                  data: Object.values(orgUnitCounts),
                  backgroundColor: [
                    '#009EDB', '#005B82', '#e6f6fc', '#222', '#6c757d', '#17a2b8', '#ffc107', '#28a745', '#dc3545', '#343a40'
                  ],
                }],
              }}
              options={{
                responsive: true,
                plugins: { legend: { position: 'bottom' } },
              }}
            />
          </div>
        </div>
        <div className="col-12 mb-4">
          <h5>Projects by Theme</h5>
          <div style={{ height: '400px' }}>
            <Bar
              data={{
                labels: Object.keys(themeCounts),
                datasets: [{
                  label: 'Projects',
                  data: Object.values(themeCounts),
                  backgroundColor: '#005B82',
                }],
              }}
              options={{
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const theme = context.label;
                        const count = context.parsed.y;
                        // List project titles for this theme
                        const projectTitles = projects.filter(p => {
                          let themes = p.Themes;
                          if (typeof themes === 'string') themes = themes.split(',');
                          return Array.isArray(themes) && themes.map(t => t.trim()).includes(theme);
                        }).map(p => p.ProjectTitle);
                        return [
                          `Projects: ${count}`,
                          ...projectTitles.map(title => `- ${title}`)
                        ];
                      }
                    }
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { ticks: { autoSkip: false }, title: { display: true, text: 'Theme' } },
                  y: { title: { display: true, text: 'Number of Projects' }, beginAtZero: true }
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
