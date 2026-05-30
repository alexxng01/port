import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { portfolioService } from '../../services/portfolioService';
import Modal from '../Common/Modal';

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    technologies: [],
    liveLink: '',
    githubLink: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await portfolioService.getPortfolio();
      setProjects(response.data.projects || []);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdd = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      technologies: [],
      liveLink: '',
      githubLink: '',
    });
    setModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image || '',
      technologies: project.technologies || [],
      liveLink: project.liveLink || '',
      githubLink: project.githubLink || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await portfolioService.deleteProject(id);
        toast.success('Project deleted');
        fetchProjects();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill title and description');
      return;
    }

    const techArray = formData.technologies
      ? formData.technologies.split(',').map((t) => t.trim())
      : [];

    const projectData = {
      ...formData,
      technologies: techArray,
    };

    try {
      if (editingProject) {
        await portfolioService.updateProject(editingProject.id, projectData);
        toast.success('Project updated');
      } else {
        await portfolioService.addProject(projectData);
        toast.success('Project added');
      }
      setModalOpen(false);
      fetchProjects();
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  if (loading) return <div className="loader">Loading projects...</div>;

  return (
    <>
      <div className="form-container">
        <h3>Add New Project</h3>
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Technologies</label>
          <input
            type="text"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB"
          />
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          + Add Project
        </button>
      </div>

      <div className="data-table">
        <h3>Projects ({projects.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Technologies</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <strong>{project.title}</strong>
                </td>
                <td>{(project.technologies || []).join(', ')}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(project)}>
                    Edit
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(project.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingProject ? 'Edit Project' : 'Add Project'}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" rows="4" value={formData.description} onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Technologies (comma separated)</label>
          <input type="text" name="technologies" value={formData.technologies} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Live Demo URL</label>
          <input type="text" name="liveLink" value={formData.liveLink} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>GitHub URL</label>
          <input type="text" name="githubLink" value={formData.githubLink} onChange={handleChange} />
        </div>
        <button className="btn-primary" onClick={handleSubmit}>
          Save
        </button>
      </Modal>
    </>
  );
};

export default ProjectsManager;