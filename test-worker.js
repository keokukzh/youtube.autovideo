// Test worker endpoint with CRON_SECRET
// Run with: node test-worker.js

const baseUrl = 'http://localhost:3004';

async function testWorker() {
  try {
    console.log('🧪 Testing Worker Endpoint with CRON_SECRET\n');

    const response = await fetch(`${baseUrl}/api/worker/process`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test_cron_secret_12345',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.text();

    console.log(`✅ Worker Status: ${response.status}`);
    console.log(`Response: ${data}`);

    if (response.status === 200) {
      console.log('\n🎉 Worker is working correctly!');
    } else if (response.status === 401) {
      console.log('\n⚠️  Worker requires correct CRON_SECRET');
    } else {
      console.log('\n❌ Worker has an issue');
    }
  } catch (error) {
    console.log(`❌ Worker test error: ${error.message}`);
  }
}

async function testCleanup() {
  try {
    console.log('\n🧪 Testing Cleanup Endpoint with CRON_SECRET\n');

    const response = await fetch(`${baseUrl}/api/cron/cleanup`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer test_cron_secret_12345',
      },
    });

    const data = await response.text();

    console.log(`✅ Cleanup Status: ${response.status}`);
    console.log(`Response: ${data}`);

    if (response.status === 200) {
      console.log('\n🎉 Cleanup is working correctly!');
    } else if (response.status === 401) {
      console.log('\n⚠️  Cleanup requires correct CRON_SECRET');
    } else {
      console.log('\n❌ Cleanup has an issue');
    }
  } catch (error) {
    console.log(`❌ Cleanup test error: ${error.message}`);
  }
}

async function runWorkerTests() {
  await testWorker();
  await testCleanup();
}

runWorkerTests();
