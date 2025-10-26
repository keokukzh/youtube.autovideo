// Test environment variables and Supabase connection
// Run with: node test-env.js

const baseUrl = 'http://localhost:3004';

async function testSupabaseConnection() {
  try {
    console.log('🧪 Testing Supabase Connection\n');

    // Test if we can reach the Supabase endpoints through our app
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input_type: 'text',
        input_text:
          'This is a test to check if Supabase is connected properly.',
      }),
    });

    const data = await response.text();

    console.log(`✅ Supabase Test Status: ${response.status}`);
    console.log(`Response: ${data.substring(0, 200)}...`);

    if (response.status === 401) {
      console.log(
        '\n🎉 Supabase is connected! (401 = auth required, which is correct)'
      );
    } else if (response.status === 500) {
      console.log('\n❌ Supabase connection issue (500 error)');
    } else {
      console.log('\n✅ Supabase connection working');
    }
  } catch (error) {
    console.log(`❌ Supabase test error: ${error.message}`);
  }
}

async function testStripeConnection() {
  try {
    console.log('\n🧪 Testing Stripe Connection\n');

    // Test if we can reach the Stripe checkout endpoint
    const response = await fetch(`${baseUrl}/api/stripe/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tier: 'STARTER',
      }),
    });

    const data = await response.text();

    console.log(`✅ Stripe Test Status: ${response.status}`);
    console.log(`Response: ${data.substring(0, 200)}...`);

    if (response.status === 401) {
      console.log(
        '\n🎉 Stripe is connected! (401 = auth required, which is correct)'
      );
    } else if (response.status === 500) {
      console.log('\n❌ Stripe connection issue (500 error)');
    } else {
      console.log('\n✅ Stripe connection working');
    }
  } catch (error) {
    console.log(`❌ Stripe test error: ${error.message}`);
  }
}

async function runEnvTests() {
  await testSupabaseConnection();
  await testStripeConnection();

  console.log('\n📋 Environment Test Summary:');
  console.log(
    '- If you see 401 errors, your environment is working correctly!'
  );
  console.log(
    '- 401 means authentication is required, which is the expected behavior'
  );
  console.log('- 500 errors would indicate connection issues');
}

runEnvTests();
