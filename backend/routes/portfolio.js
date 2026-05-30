const express = require('express');
const Portfolio = require('../models/Portfolio');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Helper to get or create portfolio document
const getPortfolio = async () => {
  let portfolio = await Portfolio.findOne();
  if (!portfolio) {
    portfolio = await Portfolio.create({});
  }
  return portfolio;
};

// @route   GET /api/portfolio
// @desc    Get all portfolio data
// @access  Public
router.get('/', async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    res.json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   PUT /api/portfolio/profile
// @desc    Update profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    portfolio.profile = { ...portfolio.profile, ...req.body };
    portfolio.updatedAt = Date.now();
    await portfolio.save();

    res.json({
      success: true,
      data: portfolio.profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   PUT /api/portfolio/about
// @desc    Update about section
// @access  Private
router.put('/about', protect, async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    portfolio.about = { ...portfolio.about, ...req.body };
    portfolio.updatedAt = Date.now();
    await portfolio.save();

    res.json({
      success: true,
      data: portfolio.about,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   POST /api/portfolio/services
// @desc    Add a service
// @access  Private
router.post('/services', protect, async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    const newService = {
      id: Date.now(),
      ...req.body,
    };
    portfolio.services.push(newService);
    portfolio.updatedAt = Date.now();
    await portfolio.save();

    res.json({
      success: true,
      data: newService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   PUT /api/portfolio/services/:id
// @desc    Update a service
// @access  Private
router.put('/services/:id', protect, async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    const serviceIndex = portfolio.services.findIndex(
      (s) => s.id === parseInt(req.params.id)
    );

    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    portfolio.services[serviceIndex] = {
      ...portfolio.services[serviceIndex],
      ...req.body,
    };
    portfolio.updatedAt = Date.now();
    await portfolio.save();

    res.json({
      success: true,
      data: portfolio.services[serviceIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   DELETE /api/portfolio/services/:id
// @desc    Delete a service
// @access  Private
router.delete('/services/:id', protect, async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    portfolio.services = portfolio.services.filter(
      (s) => s.id !== parseInt(req.params.id)
    );
    portfolio.updatedAt = Date.now();
    await portfolio.save();

    res.json({
      success: true,
      message: 'Service deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   POST /api/portfolio/technical-skills
// @desc    Add technical skill
// @access  Private
router.post('/technical-skills', protect, async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    const newSkill = {
      id: Date.now(),
      ...req.body,
    };
    portfolio.technicalSkills.push(newSkill);
    portfolio.updatedAt = Date.now();
    await portfolio.save();

    res.json({
      success: true,
      data: newSkill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   PUT /api/portfolio/technical-skills/:id
// @desc    Update technical skill
// @access  Private
router.put('/technical-skills/:id', protect, async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    const skillIndex = portfolio.technicalSkills.findIndex(
      (s) => s.id === parseInt(req.params.id)
    );

    if (skillIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    portfolio.technicalSkills[skillIndex] = {
      ...portfolio.technicalSkills[skillIndex],
      ...req.body,
    };
    portfolio.updatedAt = Date.now();
    await portfolio.save();

    res.json({
      success: true,
      data: portfolio.technicalSkills[skillIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   DELETE /api/portfolio/technical-skills/:id
// @desc    Delete technical skill
// @access  Private
router.delete('/technical-skills/:id', protect, async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    portfolio.technicalSkills = portfolio.technicalSkills.filter(
      (s) => s.id !== parseInt(req.params.id)
    );
    portfolio.updatedAt = Date.now();
    await portfolio.save();

    res.json({
      success: true,
      message: 'Skill deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Similar routes for professionalSkills
router.post('/professional-skills', protect, async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    const newSkill = { id: Date.now(), ...req.body };
    portfolio.professionalSkills.push(newSkill);
    portfolio.updatedAt = Date.now();
    await portfolio.save();
    res.json({ success: true, data: newSkill });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/professional-skills/:id', protect, async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    const skillIndex = portfolio.professionalSkills.findIndex(
      (s) => s.id === parseInt(req.params.id)
    );
    if (skillIndex === -1) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    portfolio.professionalSkills[skillIndex] = {
      ...portfolio.professionalSkills[skillIndex],
      ...req.body,
    };
    portfolio.updatedAt = Date.now();
    await portfolio.save();
    res.json({ success: true, data: portfolio.professionalSkills[skillIndex] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/professional-skills/:id', protect, async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    portfolio.professionalSkills = portfolio.professionalSkills.filter(
      (s) => s.id !== parseInt(req.params.id)
    );
    portfolio.updatedAt = Date.now();
    await portfolio.save();
    res.json({ success: true, message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Projects routes
router.post('/projects', protect, async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    const newProject = { id: Date.now(), ...req.body };
    portfolio.projects.push(newProject);
    portfolio.updatedAt = Date.now();
    await portfolio.save();
    res.json({ success: true, data: newProject });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/projects/:id', protect, async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    const projectIndex = portfolio.projects.findIndex(
      (p) => p.id === parseInt(req.params.id)
    );
    if (projectIndex === -1) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    portfolio.projects[projectIndex] = {
      ...portfolio.projects[projectIndex],
      ...req.body,
    };
    portfolio.updatedAt = Date.now();
    await portfolio.save();
    res.json({ success: true, data: portfolio.projects[projectIndex] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/projects/:id', protect, async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    portfolio.projects = portfolio.projects.filter(
      (p) => p.id !== parseInt(req.params.id)
    );
    portfolio.updatedAt = Date.now();
    await portfolio.save();
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Teamwork routes
router.post('/teamwork', protect, async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    const newTeamwork = { id: Date.now(), ...req.body };
    portfolio.teamwork.push(newTeamwork);
    portfolio.updatedAt = Date.now();
    await portfolio.save();
    res.json({ success: true, data: newTeamwork });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/teamwork/:id', protect, async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    const teamworkIndex = portfolio.teamwork.findIndex(
      (t) => t.id === parseInt(req.params.id)
    );
    if (teamworkIndex === -1) {
      return res.status(404).json({ success: false, message: 'Teamwork not found' });
    }
    portfolio.teamwork[teamworkIndex] = {
      ...portfolio.teamwork[teamworkIndex],
      ...req.body,
    };
    portfolio.updatedAt = Date.now();
    await portfolio.save();
    res.json({ success: true, data: portfolio.teamwork[teamworkIndex] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/teamwork/:id', protect, async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    portfolio.teamwork = portfolio.teamwork.filter(
      (t) => t.id !== parseInt(req.params.id)
    );
    portfolio.updatedAt = Date.now();
    await portfolio.save();
    res.json({ success: true, message: 'Teamwork deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;