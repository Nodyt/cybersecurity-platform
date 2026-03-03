
const axios = require('axios');

async function check() {
    try {
        console.log("1. Authenticating...");
        const loginRes = await axios.post('http://localhost:3001/api/auth/login', {
            email: "admin@cyber.edu",
            password: "password123"
        });
        const token = loginRes.data.token;
        console.log("   -> Authenticated.");

        console.log("2. Fetching Status (Headers Check)...");
        const statusRes = await axios.get('http://localhost:3001/api/training/status', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("\n--- SECURITY HEADERS ---");
        // Log all headers for debugging, specifically looking for CSP
        const csp = statusRes.headers['content-security-policy'];
        console.log("Content-Security-Policy:", csp);

        if (csp && csp.includes("youtube.com")) {
            console.log("✅ CSP allows youtube.com");
        } else {
            console.log("❌ CSP MISSING or BLOCKING youtube.com");
        }

        const modules = statusRes.data.modules;
        console.log(`\nFound ${modules.length} modules.`);

        if (modules.length > 0) {
            const firstModuleId = modules[0].id;
            console.log(`Checking Module: ${modules[0].title}`);

            const moduleRes = await axios.get(`http://localhost:3001/api/training/module/${firstModuleId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log(`Video URL: ${moduleRes.data.videoUrl}`);
        }

    } catch (e) {
        console.error("Error:", e.message);
        if (e.response) {
            console.error("Status:", e.response.status);
            console.error("Headers:", e.response.headers);
        }
    }
}

check();
