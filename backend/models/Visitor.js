const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    default: 'Unknown',
  },
  country: {
    type: String,
    default: 'Unknown',
  },
  deviceType: {
    type: String,
    enum: ['Desktop', 'Mobile', 'Tablet', 'Unknown'],
    default: 'Unknown',
  },
  browser: {
    type: String,
    default: 'Unknown',
  },
  pageVisited: {
    type: String,
    default: '/',
  },
  referrer: {
    type: String,
    default: '',
  },
  visitDate: {
    type: Date,
    default: Date.now,
  },
});

visitorSchema.index({ visitDate: -1 });
visitorSchema.index({ ipAddress: 1, visitDate: -1 });

module.exports = mongoose.model('Visitor', visitorSchema);