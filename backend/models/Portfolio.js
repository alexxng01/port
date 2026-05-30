const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  profile: {
    name: { type: String, default: 'Rahul Mahato' },
    title: { type: String, default: 'Full Stack Developer' },
    bio: { type: String, default: 'Web Developer' },
    image: { type: String, default: '' },
    cv: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
  },
  about: {
    mainText: { type: String, default: 'Full Stack Developer' },
    paragraphs: { type: [String], default: ['Loading...'] },
  },
  services: [
    {
      id: { type: Number, default: Date.now },
      icon: { type: String, default: 'bx bx-code' },
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  technicalSkills: [
    {
      id: { type: Number, default: Date.now },
      name: { type: String, required: true },
      level: { type: Number, min: 0, max: 100, required: true },
      icon: { type: String, default: 'bx bx-code' },
    },
  ],
  professionalSkills: [
    {
      id: { type: Number, default: Date.now },
      name: { type: String, required: true },
      level: { type: Number, min: 0, max: 100, required: true },
    },
  ],
  projects: [
    {
      id: { type: Number, default: Date.now },
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String, default: '' },
      technologies: [String],
      liveLink: { type: String, default: '' },
      githubLink: { type: String, default: '' },
    },
  ],
  teamwork: [
    {
      id: { type: Number, default: Date.now },
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String, default: '' },
      role: { type: String, default: 'Member' },
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

portfolioSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Portfolio', portfolioSchema);