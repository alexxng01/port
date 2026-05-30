import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { portfolioService } from '../../services/portfolioService';

const SkillsManager = () => {
  const [technicalSkills, setTechnicalSkills] = useState([]);
  const [professionalSkills, setProfessionalSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTechSkill, setNewTechSkill] = useState({ name: '', level: 50, icon: 'bx bx-code' });
  const [newProfSkill, setNewProfSkill] = useState({ name: '', level: 50 });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await portfolioService.getPortfolio();
      setTechnicalSkills(response.data.technicalSkills || []);
      setProfessionalSkills(response.data.professionalSkills || []);
    } catch (error) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const addTechnicalSkill = async () => {
    if (!newTechSkill.name) {
      toast.error('Enter skill name');
      return;
    }
    try {
      await portfolioService.addTechnicalSkill(newTechSkill);
      toast.success('Technical skill added');
      setNewTechSkill({ name: '', level: 50, icon: 'bx bx-code' });
      fetchSkills();
    } catch (error) {
      toast.error('Failed to add skill');
    }
  };

  const updateTechnicalSkill = async (id, skill) => {
    try {
      await portfolioService.updateTechnicalSkill(id, skill);
      toast.success('Skill updated');
      fetchSkills();
    } catch (error) {
      toast.error('Failed to update skill');
    }
  };

  const deleteTechnicalSkill = async (id) => {
    if (window.confirm('Delete this skill?')) {
      try {
        await portfolioService.deleteTechnicalSkill(id);
        toast.success('Skill deleted');
        fetchSkills();
      } catch (error) {
        toast.error('Failed to delete skill');
      }
    }
  };

  const addProfessionalSkill = async () => {
    if (!newProfSkill.name) {
      toast.error('Enter skill name');
      return;
    }
    try {
      await portfolioService.addProfessionalSkill(newProfSkill);
      toast.success('Professional skill added');
      setNewProfSkill({ name: '', level: 50 });
      fetchSkills();
    } catch (error) {
      toast.error('Failed to add skill');
    }
  };

  const updateProfessionalSkill = async (id, skill) => {
    try {
      await portfolioService.updateProfessionalSkill(id, skill);
      toast.success('Skill updated');
      fetchSkills();
    } catch (error) {
      toast.error('Failed to update skill');
    }
  };

  const deleteProfessionalSkill = async (id) => {
    if (window.confirm('Delete this skill?')) {
      try {
        await portfolioService.deleteProfessionalSkill(id);
        toast.success('Skill deleted');
        fetchSkills();
      } catch (error) {
        toast.error('Failed to delete skill');
      }
    }
  };

  if (loading) return <div className="loader">Loading skills...</div>;

  return (
    <>
      <div className="form-container">
        <h3>Technical Skills</h3>
        <div id="technicalSkillsList">
          {technicalSkills.map((skill) => (
            <div className="skill-item-row" key={skill.id}>
              <input
                type="text"
                defaultValue={skill.name}
                onBlur={(e) => updateTechnicalSkill(skill.id, { ...skill, name: e.target.value })}
              />
              <input
                type="number"
                defaultValue={skill.level}
                style={{ width: '100px' }}
                onBlur={(e) => updateTechnicalSkill(skill.id, { ...skill, level: parseInt(e.target.value) })}
              />
              <button className="btn-danger" onClick={() => deleteTechnicalSkill(skill.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '20px' }}>
          <h4>Add Technical Skill</h4>
          <div className="skill-item-row">
            <input
              type="text"
              placeholder="Skill name"
              value={newTechSkill.name}
              onChange={(e) => setNewTechSkill({ ...newTechSkill, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Level"
              style={{ width: '100px' }}
              value={newTechSkill.level}
              onChange={(e) => setNewTechSkill({ ...newTechSkill, level: parseInt(e.target.value) })}
            />
            <button className="btn-primary" onClick={addTechnicalSkill}>
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="form-container">
        <h3>Professional Skills</h3>
        <div id="professionalSkillsList">
          {professionalSkills.map((skill) => (
            <div className="skill-item-row" key={skill.id}>
              <input
                type="text"
                defaultValue={skill.name}
                onBlur={(e) => updateProfessionalSkill(skill.id, { ...skill, name: e.target.value })}
              />
              <input
                type="number"
                defaultValue={skill.level}
                style={{ width: '100px' }}
                onBlur={(e) => updateProfessionalSkill(skill.id, { ...skill, level: parseInt(e.target.value) })}
              />
              <button className="btn-danger" onClick={() => deleteProfessionalSkill(skill.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '20px' }}>
          <h4>Add Professional Skill</h4>
          <div className="skill-item-row">
            <input
              type="text"
              placeholder="Skill name"
              value={newProfSkill.name}
              onChange={(e) => setNewProfSkill({ ...newProfSkill, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Level"
              style={{ width: '100px' }}
              value={newProfSkill.level}
              onChange={(e) => setNewProfSkill({ ...newProfSkill, level: parseInt(e.target.value) })}
            />
            <button className="btn-primary" onClick={addProfessionalSkill}>
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SkillsManager;