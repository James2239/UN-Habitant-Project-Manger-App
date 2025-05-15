import React, { useEffect, useState } from 'react';
import { Table, Button, Pagination, Form, Modal } from 'react-bootstrap';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 'All'];

function ProjectTable() {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'edit', 'add', 'delete'
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/projects/all')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setTotalPages(pageSize === 'All' ? 1 : Math.ceil(data.length / pageSize));
        setPage(1);
      });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setTotalPages(pageSize === 'All' ? 1 : Math.ceil(projects.length / pageSize));
    setPage(1);
  }, [pageSize, projects]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    const value = e.target.value === 'All' ? 'All' : parseInt(e.target.value);
    setPageSize(value);
    setPage(1);
    setTotalPages(value === 'All' ? 1 : Math.ceil(projects.length / value));
  };

  const paginatedProjects = pageSize === 'All'
    ? projects
    : projects.slice((page - 1) * pageSize, page * pageSize);

  // CRUD Handlers
  const handleShowModal = (type, project = null) => {
    setModalType(type);
    if (type === 'view' && project) {
      // Fetch project details with countries
      fetch(`http://127.0.0.1:5000/api/project/${project.ProjectID}`)
        .then(res => res.json())
        .then(data => {
          setSelectedProject(data);
          setFormData(data);
          setShowModal(true);
        });
    } else {
      setSelectedProject(project);
      setFormData(project ? { ...project } : {});
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
    setFormData({});
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProject = () => {
    const payload = { ...formData };
    if (formData.Countries) {
      payload.Countries = formData.Countries.split(',').map(c => c.trim()).filter(Boolean);
    }
    if (formData.Themes) {
      payload.Themes = formData.Themes.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (formData.Donors) {
      payload.Donors = formData.Donors.split(',').map(d => d.trim()).filter(Boolean);
    }
    fetch('http://127.0.0.1:5000/api/project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        handleCloseModal();
        refreshProjects();
      });
  };

  const handleEditProject = () => {
    const payload = { ...formData };
    if (formData.Countries) {
      payload.Countries = formData.Countries.split(',').map(c => c.trim()).filter(Boolean);
    }
    if (formData.Themes) {
      payload.Themes = formData.Themes.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (formData.Donors) {
      payload.Donors = formData.Donors.split(',').map(d => d.trim()).filter(Boolean);
    }
    fetch(`http://127.0.0.1:5000/api/project/${selectedProject.ProjectID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        handleCloseModal();
        refreshProjects();
      });
  };

  const handleDeleteProject = () => {
    fetch(`http://127.0.0.1:5000/api/project/${selectedProject.ProjectID}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => {
        handleCloseModal();
        refreshProjects();
      });
  };

  const refreshProjects = () => {
    fetch('http://127.0.0.1:5000/api/projects/all')
      .then(res => res.json())
      .then(data => setProjects(data));
  };

  // Modal content
  const renderModalContent = () => {
    if (modalType === 'delete') {
      return (
        <div>
          <p>Are you sure you want to delete this project?</p>
          <Button variant="danger" onClick={handleDeleteProject}>Delete</Button>
        </div>
      );
    }
    if (modalType === 'view') {
      return (
        <div>
          {selectedProject && Object.entries(selectedProject).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
            </div>
          ))}
        </div>
      );
    }
    return (
      <Form>
        <Form.Group className="mb-2">
          <Form.Label>Project Title</Form.Label>
          <Form.Control name="ProjectTitle" value={formData.ProjectTitle || ''} onChange={handleFormChange} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>PAAS Code</Form.Label>
          <Form.Control name="PAASCode" value={formData.PAASCode || ''} onChange={handleFormChange} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Approval Status</Form.Label>
          <Form.Control name="ApprovalStatus" value={formData.ApprovalStatus || ''} onChange={handleFormChange} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Fund</Form.Label>
          <Form.Control name="Fund" value={formData.Fund || ''} onChange={handleFormChange} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>PAG Value</Form.Label>
          <Form.Control name="PAGValue" value={formData.PAGValue || ''} onChange={handleFormChange} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Start Date</Form.Label>
          <Form.Control name="StartDate" value={formData.StartDate || ''} onChange={handleFormChange} type="date" />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>End Date</Form.Label>
          <Form.Control name="EndDate" value={formData.EndDate || ''} onChange={handleFormChange} type="date" />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Lead Org Unit</Form.Label>
          <Form.Control name="LeadOrgUnit" value={formData.LeadOrgUnit || ''} onChange={handleFormChange} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Total Expenditure</Form.Label>
          <Form.Control name="TotalExpenditure" value={formData.TotalExpenditure || ''} onChange={handleFormChange} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Total Contribution</Form.Label>
          <Form.Control name="TotalContribution" value={formData.TotalContribution || ''} onChange={handleFormChange} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Total Contribution - Total Expenditure</Form.Label>
          <Form.Control name="TotalContributionMinusExpenditure" value={formData.TotalContributionMinusExpenditure || ''} onChange={handleFormChange} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Total PSC</Form.Label>
          <Form.Control name="TotalPSC" value={formData.TotalPSC || ''} onChange={handleFormChange} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Countries (comma separated)</Form.Label>
          <Form.Control
            name="Countries"
            value={formData.Countries || (formData.Countries === '' ? '' : (formData.Countries || (formData.CountriesArray ? formData.CountriesArray.join(', ') : '')))}
            onChange={handleFormChange}
            placeholder="e.g. Kenya, Uganda"
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Themes (comma separated)</Form.Label>
          <Form.Control
            name="Themes"
            value={formData.Themes || (formData.Themes === '' ? '' : (formData.Themes || (formData.ThemesArray ? formData.ThemesArray.join(', ') : (formData.Themes ? formData.Themes.join(', ') : ''))))}
            onChange={handleFormChange}
            placeholder="e.g. Urban Economy, Advocacy"
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Donors (comma separated)</Form.Label>
          <Form.Control
            name="Donors"
            value={formData.Donors || (formData.Donors === '' ? '' : (formData.Donors || (formData.DonorsArray ? formData.DonorsArray.join(', ') : (formData.Donors ? formData.Donors.join(', ') : ''))))}
            onChange={handleFormChange}
            placeholder="e.g. Donor1, Donor2"
          />
        </Form.Group>
        {(modalType === 'add') && (
          <Form.Group className="mb-2">
            <Form.Label>Project ID</Form.Label>
            <Form.Control name="ProjectID" value={formData.ProjectID || ''} onChange={handleFormChange} />
          </Form.Group>
        )}
        <Button variant="primary" onClick={modalType === 'edit' ? handleEditProject : handleAddProject}>
          {modalType === 'edit' ? 'Save Changes' : 'Add Project'}
        </Button>
      </Form>
    );
  };

  return (
    <div className="container mt-4">
      <h2>Projects</h2>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Form.Select style={{ width: 120 }} value={pageSize} onChange={handlePageSizeChange}>
          {PAGE_SIZE_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </Form.Select>
        <Button variant="success" onClick={() => handleShowModal('add')}>Add Project</Button>
        <span>Page {page} of {totalPages}</span>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ProjectID</th>
            <th>Project Title</th>
            <th>Approval Status</th>
            <th>Fund</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Lead Org Unit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProjects.map(project => (
            <tr key={project.ProjectID}>
              <td>{project.ProjectID}</td>
              <td>{project.ProjectTitle}</td>
              <td>{project.ApprovalStatus}</td>
              <td>{project.Fund}</td>
              <td>{project.StartDate}</td>
              <td>{project.EndDate}</td>
              <td>{project.LeadOrgUnit}</td>
              <td>
                <Button size="sm" variant="info" className="me-1" onClick={() => handleShowModal('view', project)}>View</Button>
                <Button size="sm" variant="warning" className="me-1" onClick={() => handleShowModal('edit', project)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => handleShowModal('delete', project)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {pageSize !== 'All' && totalPages > 1 && (
        <Pagination>
          <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
          <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
          {/* Show only 10 page numbers at a time */}
          {(() => {
            const pageNumbers = [];
            let start = Math.max(1, page - 4);
            let end = Math.min(totalPages, start + 9);
            if (end - start < 9) {
              start = Math.max(1, end - 9);
            }
            for (let i = start; i <= end; i++) {
              pageNumbers.push(
                <Pagination.Item
                  key={i}
                  active={page === i}
                  onClick={() => handlePageChange(i)}
                >
                  {i}
                </Pagination.Item>
              );
            }
            return pageNumbers;
          })()}
          <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
          <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} />
        </Pagination>
      )}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'add' && 'Add Project'}
            {modalType === 'edit' && 'Edit Project'}
            {modalType === 'view' && 'Project Details'}
            {modalType === 'delete' && 'Delete Project'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'view' ? (
            <div>
              {selectedProject && Object.entries(selectedProject).map(([key, value]) => (
                <div key={key}><strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}</div>
              ))}
            </div>
          ) : renderModalContent()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProjectTable;
