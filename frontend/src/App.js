import React from 'react';
import ProjectTable from './ProjectTable';
import UNHabitatNavbar from './UNHabitatNavbar';
import Dashboard from './Dashboard';
import { useState } from 'react';

function App() {
  const [page, setPage] = useState('projects');
  return (
    <div>
      <UNHabitatNavbar setPage={setPage} />
      {page === 'dashboard' ? <Dashboard /> : <ProjectTable />}
    </div>
  );
}

export default App;
