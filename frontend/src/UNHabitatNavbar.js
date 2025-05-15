import React from 'react';

function UNHabitatNavbar({ setPage }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4" style={{ borderBottom: '3px solid #009EDB' }}>
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center" href="#" onClick={() => setPage('projects')}>
          <img src="/logo192.png" alt="UN-Habitat Logo" width="40" height="40" className="me-2" />
          <span style={{ color: '#009EDB', fontWeight: 700, fontSize: 22 }}>UN-Habitat Project Manager</span>
        </a>
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <button className="btn btn-link nav-link" style={{ color: '#009EDB', fontWeight: 600 }} onClick={() => setPage('projects')}>Projects</button>
          </li>
          <li className="nav-item">
            <button className="btn btn-link nav-link" style={{ color: '#009EDB', fontWeight: 600 }} onClick={() => setPage('dashboard')}>Dashboard</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default UNHabitatNavbar;
