import assert from 'assert';

const BASE_URL = 'http://localhost:5000/api/v1';

async function runTests() {
  console.log('🧪 Starting API Verification Suite...\n');

  // Test 1: Health Check
  const healthRes = await fetch(`${BASE_URL}/health`);
  const health = await healthRes.json();
  assert.strictEqual(health.status, 'ok', 'Health check failed');
  console.log('✅ 1. Health Check Endpoint Passed');

  // Test 2: Traveler Login
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@travel.com', password: 'Traveler123!' }),
  });
  const loginData = await loginRes.json();
  assert.strictEqual(loginData.success, true, 'Traveler login failed');
  assert.ok(loginData.token, 'Token was not issued');
  console.log(`✅ 2. Traveler Login Passed (User: ${loginData.user.name}, Role: ${loginData.user.role})`);

  // Test 3: Admin Login
  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@travel.com', password: 'Admin123!' }),
  });
  const adminLoginData = await adminLoginRes.json();
  assert.strictEqual(adminLoginData.success, true, 'Admin login failed');
  assert.strictEqual(adminLoginData.user.role, 'ADMIN', 'Admin role mismatch');
  const adminToken = adminLoginData.token;
  console.log(`✅ 3. Admin Login & RBAC Token Passed`);

  // Test 4: Destination Search & Filtering
  const searchRes = await fetch(`${BASE_URL}/destinations?query=Santorini`);
  const searchData = await searchRes.json();
  assert.strictEqual(searchData.success, true, 'Destination search failed');
  assert.ok(searchData.data.length > 0, 'No search results for Santorini');
  const santorini = searchData.data[0];
  console.log(`✅ 4. Destination Search Passed (Found: ${santorini.name}, ${santorini.country})`);

  // Test 5: Destination Detail by ID (Hotels, Attractions, Travel Info)
  const detailRes = await fetch(`${BASE_URL}/destinations/${santorini.id}`);
  const detailData = await detailRes.json();
  assert.strictEqual(detailData.success, true, 'Destination detail failed');
  assert.ok(detailData.data.hotels.length > 0, 'Hotels missing in detail');
  assert.ok(detailData.data.attractions.length > 0, 'Attractions missing in detail');
  assert.ok(detailData.data.travelInfo, 'Travel info missing in detail');
  console.log(`✅ 5. Destination Detail Aggregation Passed (${detailData.data.hotels.length} hotels, ${detailData.data.attractions.length} attractions, Travel Info: ${detailData.data.travelInfo.currency})`);

  // Test 6: Nearby Haversine Proximity
  const nearbyRes = await fetch(`${BASE_URL}/destinations/${santorini.id}/nearby-destinations`);
  const nearbyData = await nearbyRes.json();
  assert.strictEqual(nearbyData.success, true, 'Nearby calculation failed');
  assert.ok(nearbyData.data.length > 0, 'No nearby destinations computed');
  console.log(`✅ 6. Haversine Proximity Calculation Passed (Closest hub: ${nearbyData.data[0].name} at ${nearbyData.data[0].distanceKm} km)`);

  // Test 7: Admin RBAC Protected Endpoint (Admin Stats)
  const statsRes = await fetch(`${BASE_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const statsData = await statsRes.json();
  assert.strictEqual(statsData.success, true, 'Admin stats failed');
  console.log(`✅ 7. Admin Stats Endpoint Passed (Destinations: ${statsData.data.stats.destinations}, Hotels: ${statsData.data.stats.hotels}, Attractions: ${statsData.data.stats.attractions})`);

  // Test 8: Admin CRUD - Create and Delete Destination
  const createRes = await fetch(`${BASE_URL}/admin/destinations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      name: 'Reykjavik Test',
      country: 'Iceland',
      region: 'Capital Region',
      continent: 'Europe',
      latitude: 64.1466,
      longitude: -21.9426,
      tagline: 'Land of Fire and Ice',
      description: 'Reykjavik is the world’s northernmost capital of a sovereign state, famed for geothermal lagoons and northern lights.',
      imageUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1600&q=80',
      rating: 4.8,
    }),
  });
  const createData = await createRes.json();
  assert.strictEqual(createData.success, true, 'Admin create destination failed');
  const createdId = createData.data.id;
  console.log(`✅ 8. Admin Create Destination Passed (ID: ${createdId})`);

  // Clean up created destination
  const deleteRes = await fetch(`${BASE_URL}/admin/destinations/${createdId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const deleteData = await deleteRes.json();
  assert.strictEqual(deleteData.success, true, 'Admin delete destination failed');
  console.log(`✅ 9. Admin Delete Destination Cleanup Passed`);

  console.log('\n🎉 ALL 9 INTEGRATION TESTS PASSED PERFECTLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
