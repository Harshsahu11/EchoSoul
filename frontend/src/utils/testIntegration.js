import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function testIntegration() {
  console.log("🧪 Testing Frontend-Backend Integration...\n");

  try {
    // Test 1: Health Check
    console.log("1️⃣ Testing API Health Check...");
    const health = await axios.get(`${API_URL}/`);
    console.log("✅ API is alive:", health.data);
    console.log("   CORS Headers:", health.headers);

    // Test 2: User Registration
    console.log("\n2️⃣ Testing User Registration...");
    const testEmail = `test_${Date.now()}@echosoul.com`;
    const registerRes = await axios.post(`${API_URL}/api/user/register`, {
      name: "Test User",
      email: testEmail,
      password: "TestPassword123",
      phone: "9876543210",
    });
    console.log("✅ Registration successful");
    console.log("   Token received:", registerRes.data.token ? "✓" : "✗");
    console.log("   User data:", registerRes.data.user);

    // Test 3: User Login
    console.log("\n3️⃣ Testing User Login...");
    const loginRes = await axios.post(`${API_URL}/api/user/login`, {
      email: testEmail,
      password: "TestPassword123",
    });
    console.log("✅ Login successful");
    console.log("   Token:", loginRes.data.token ? "Received ✓" : "Missing ✗");
    console.log("   User:", loginRes.data.user?.name);

    // Test 4: Get Services
    console.log("\n4️⃣ Testing Get Services...");
    const servicesRes = await axios.get(`${API_URL}/api/service/list`);
    console.log("✅ Services retrieved");
    console.log("   Count:", servicesRes.data.services?.length || 0);

    console.log(
      "\n✅ ALL TESTS PASSED! Frontend-Backend Integration is Working!\n",
    );
  } catch (error) {
    console.error("\n❌ Test failed:");
    console.error("Status:", error.response?.status);
    console.error("Message:", error.response?.data?.message || error.message);
    console.error("Full error:", error);
  }
}

testIntegration();
