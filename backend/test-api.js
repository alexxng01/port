const axios = require('axios');

const API_URL = 'http://localhost:5002';

async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');
  
  // Test health check
  try {
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check:', health.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    if (error.response) console.log('   Status:', error.response.status);
  }
  
  // Test public test endpoint
  try {
    const test = await axios.get(`${API_URL}/api/test`);
    console.log('✅ Test endpoint:', test.data);
  } catch (error) {
    console.log('❌ Test endpoint failed:', error.message);
  }
  
  // Test login
  try {
    console.log('\n📝 Testing login with admin@gmail.com / Admin@123...');
    const login = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'admin@gmail.com',
      password: 'Admin@123'
    });
    console.log('✅ Login successful!');
    console.log('   Response:', login.data);
    
    if (login.data.token) {
      console.log('   Token:', login.data.token.substring(0, 50) + '...');
      
      // Test protected route with token
      console.log('\n🔒 Testing protected route...');
      const me = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${login.data.token}` }
      });
      console.log('✅ Protected route accessible');
      console.log('   User:', me.data.user);
    }
  } catch (error) {
    console.log('❌ Login failed');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Message:', error.response.data?.message);
    } else {
      console.log('   Error:', error.message);
    }
  }
  
  // Test portfolio endpoint (public)
  try {
    console.log('\n📁 Testing portfolio endpoint...');
    const portfolio = await axios.get(`${API_URL}/api/portfolio`);
    console.log('✅ Portfolio endpoint working');
    console.log('   Data received:', Object.keys(portfolio.data).join(', '));
  } catch (error) {
    console.log('❌ Portfolio endpoint failed');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Message:', error.response.data?.message);
    }
  }
  
  console.log('\n✨ API testing complete!');
}

// Run tests
testAPI();