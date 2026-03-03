
const axios = require('axios');

async function test() {
    try {
        console.log("1. Logging in...");
        const loginRes = await axios.post('http://localhost:3001/api/auth/login', {
            email: "admin@cyber.edu",
            password: "password123"
        });
        const token = loginRes.data.token;
        console.log("   -> Login successful.");

        console.log("\n2. Fetching Inbox...");
        const inboxRes = await axios.get('http://localhost:3001/api/simulation/inbox', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`   -> Inbox size: ${inboxRes.data.length}`);

        console.log("\n3. Submitting Drill...");
        const answers = inboxRes.data.map(sim => ({
            simulationId: sim.id,
            verdict: sim.isPhishing ? 'PHISHING' : 'SAFE'
        }));

        const submitRes = await axios.post('http://localhost:3001/api/simulation/submit-drill',
            { answers },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("   -> Result:", submitRes.data.status);
        console.log("   -> Score:", submitRes.data.score + "/" + submitRes.data.total);

        console.log("\n4. Checking Progress Stats...");
        const statsRes = await axios.get('http://localhost:3001/api/training/status', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("   -> Risk Score:", statsRes.data.riskScore);
        console.log("   -> Excellence Score:", statsRes.data.excellenceScore);
        console.log("   -> Completed Modules:", statsRes.data.completedModules);
        console.log("   -> Total Modules:", statsRes.data.totalModules);
        console.log("   -> Modules List Length:", statsRes.data.modules.length);

        console.log("\n✅ TEST COMPLETED SUCCESSFULLY.");

    } catch (e) {
        console.error("\n❌ TEST FAILED");
        if (e.code === 'ECONNREFUSED') {
            console.error("   Connection refused. Is the server running on port 3001?");
        } else if (e.response) {
            console.error("   Status:", e.response.status);
            console.error("   Data:", JSON.stringify(e.response.data, null, 2));
        } else {
            console.error("   Error:", e.message);
        }
    }
}

test();
