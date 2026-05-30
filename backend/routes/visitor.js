const express = require('express');
const Visitor = require('../models/Visitor');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/visitor
// @desc    Track visitor
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { city, country, deviceType, browser, pageVisited, referrer } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Check if same IP visited today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingVisitor = await Visitor.findOne({
      ipAddress,
      visitDate: { $gte: today },
    });

    if (!existingVisitor) {
      await Visitor.create({
        ipAddress,
        city: city || 'Unknown',
        country: country || 'Unknown',
        deviceType: deviceType || 'Unknown',
        browser: browser || 'Unknown',
        pageVisited: pageVisited || '/',
        referrer: referrer || '',
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/visitor/stats
// @desc    Get visitor statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalVisitors = await Visitor.countDocuments();
    const todayVisitors = await Visitor.countDocuments({
      visitDate: { $gte: today },
    });

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const count = await Visitor.countDocuments({
        visitDate: { $gte: date, $lt: nextDate },
      });
      last7Days.push({
        date: date.toISOString().split('T')[0],
        count,
      });
    }

    const topCountries = await Visitor.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const deviceStats = await Visitor.aggregate([
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
    ]);

    const recentVisitors = await Visitor.find()
      .sort({ visitDate: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        total: totalVisitors,
        today: todayVisitors,
        last7Days,
        topCountries: topCountries.map(c => ({ country: c._id, count: c.count })),
        devices: deviceStats.map(d => ({ device: d._id, count: d.count })),
        recent: recentVisitors,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;