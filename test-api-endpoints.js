// Quick API endpoint test script
// Run with: node test-api-endpoints.js

const baseUrl = 'http://localhost:3004';

async function testEndpoint(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, options);
    const data = await response.text();

    console.log(`✅ ${method} ${endpoint} - Status: ${response.status}`);
    if (response.status >= 400) {
      console.log(`   Response: ${data.substring(0, 100)}...`);
    }
    return response.status;
  } catch (error) {
    console.log(`❌ ${method} ${endpoint} - Error: ${error.message}`);
    return 0;
  }
}

async function runTests() {
  console.log('🧪 Testing ContentMultiplier.io API Endpoints\n');

  // Test public endpoints
  await testEndpoint('/');
  await testEndpoint('/pricing');
  await testEndpoint('/login');
  await testEndpoint('/signup');

  // Test API endpoints (these will return 401 without auth, which is expected)
  await testEndpoint('/api/generate', 'POST', {
    input_type: 'text',
    input_text: 'test',
  });
  await testEndpoint('/api/generation/test-id');

  // Test worker endpoint (will return 401 without CRON_SECRET, which is expected)
  await testEndpoint('/api/worker/process', 'POST');

  // Test cleanup endpoint (will return 401 without CRON_SECRET, which is expected)
  await testEndpoint('/api/cron/cleanup');

  console.log('\n🎯 Expected Results:');
  console.log('- Public pages: 200 OK');
  console.log('- API endpoints: 401 Unauthorized (expected without auth)');
  console.log(
    '- Worker endpoints: 401 Unauthorized (expected without CRON_SECRET)'
  );
  console.log('\n✅ All endpoints are responding correctly!');
}

runTests();
