require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('URI:', process.env.MONGODB_URI.replace(/\/\/(.*)@/, '//***:***@'));
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB!');
    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();