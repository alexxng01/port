import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { portfolioService } from '../../services/portfolioService';
import Modal from '../Common/Modal';

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    icon: 'bx bx-code',
    title: '',
    description: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await portfolioService.getPortfolio();
      setServices(response.data.services || []);
    } catch (error) {
      toast.error('Failed to load services');
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
    setEditingService(null);
    setFormData({ icon: 'bx bx-code', title: '', description: '' });
    setModalOpen(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      icon: service.icon,
      title: service.title,
      description: service.description,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this service?')) {
      try {
        await portfolioService.deleteService(id);
        toast.success('Service deleted');
        fetchServices();
      } catch (error) {
        toast.error('Failed to delete service');
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      if (editingService) {
        await portfolioService.updateService(editingService.id, formData);
        toast.success('Service updated');
      } else {
        await portfolioService.addService(formData);
        toast.success('Service added');
      }
      setModalOpen(false);
      fetchServices();
    } catch (error) {
      toast.error('Failed to save service');
    }
  };

  if (loading) return <div className="loader">Loading services...</div>;

  return (
    <>
      <div className="form-container">
        <h3>Add New Service</h3>
        <div className="form-group">
          <label>Icon (bx bx-code)</label>
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="bx bx-code"
          />
        </div>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          ></textarea>
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          + Add Service
        </button>
      </div>

      <div className="data-table">
        <h3>Services ({services.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Icon</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>
                  <i className={service.icon} style={{ fontSize: '24px', color: '#0ef' }}></i>
                </td>
                <td>
                  <strong>{service.title}</strong>
                </td>
                <td>{service.description.substring(0, 80)}...</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(service)}>
                    Edit
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(service.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingService ? 'Edit Service' : 'Add Service'}>
        <div className="form-group">
          <label>Icon</label>
          <input type="text" name="icon" value={formData.icon} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" rows="4" value={formData.description} onChange={handleChange}></textarea>
        </div>
        <button className="btn-primary" onClick={handleSubmit}>
          Save
        </button>
      </Modal>
    </>
  );
};

export default ServicesManager;