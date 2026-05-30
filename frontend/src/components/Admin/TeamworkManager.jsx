import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { portfolioService } from '../../services/portfolioService';
import Modal from '../Common/Modal';

const TeamworkManager = () => {
  const [teamwork, setTeamwork] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeamwork, setEditingTeamwork] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    role: '',
  });

  useEffect(() => {
    fetchTeamwork();
  }, []);

  const fetchTeamwork = async () => {
    try {
      const response = await portfolioService.getPortfolio();
      setTeamwork(response.data.teamwork || []);
    } catch (error) {
      toast.error('Failed to load teamwork');
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
    setEditingTeamwork(null);
    setFormData({ title: '', description: '', image: '', role: '' });
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingTeamwork(item);
    setFormData({
      title: item.title,
      description: item.description,
      image: item.image || '',
      role: item.role || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this teamwork entry?')) {
      try {
        await portfolioService.deleteTeamwork(id);
        toast.success('Teamwork deleted');
        fetchTeamwork();
      } catch (error) {
        toast.error('Failed to delete teamwork');
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill title and description');
      return;
    }

    try {
      if (editingTeamwork) {
        await portfolioService.updateTeamwork(editingTeamwork.id, formData);
        toast.success('Teamwork updated');
      } else {
        await portfolioService.addTeamwork(formData);
        toast.success('Teamwork added');
      }
      setModalOpen(false);
      fetchTeamwork();
    } catch (error) {
      toast.error('Failed to save teamwork');
    }
  };

  if (loading) return <div className="loader">Loading teamwork...</div>;

  return (
    <>
      <div className="form-container">
        <h3>Add TeamWork Entry</h3>
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
          <label>Role</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} />
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          + Add TeamWork
        </button>
      </div>

      <div className="data-table">
        <h3>TeamWork ({teamwork.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Role</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamwork.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.title}</strong>
                </td>
                <td>{item.role || 'Member'}</td>
                <td>{item.description.substring(0, 60)}...</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingTeamwork ? 'Edit TeamWork' : 'Add TeamWork'}>
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
          <label>Role</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} />
        </div>
        <button className="btn-primary" onClick={handleSubmit}>
          Save
        </button>
      </Modal>
    </>
  );
};

export default TeamworkManager;