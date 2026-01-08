// ============================================================
// TEST SCRIPT: API Endpoint Testing
// Purpose: Test the GET /api/races/:id and GET /api/trainers/:id endpoints
// Usage: 
//   node test-api.js race <raceId>
//   node test-api.js trainer <trainerId>
// Examples:
//   node test-api.js race race37
//   node test-api.js trainer trainer1
// ============================================================

const http = require('http');

// Parse command line arguments
const testType = process.argv[2]?.toLowerCase(); // 'race' or 'trainer'
const id = process.argv[3];

if (!testType || (testType !== 'race' && testType !== 'trainer')) {
    console.log('╔═══════════════════════════════════════════╗');
    console.log('  API Endpoint Testing Script');
    console.log('╠═══════════════════════════════════════════╣');
    console.log('  Usage:');
    console.log('    node test-api.js race <raceId>');
    console.log('    node test-api.js trainer <trainerId>');
    console.log('');
    console.log('  Examples:');
    console.log('    node test-api.js race race37');
    console.log('    node test-api.js trainer trainer1');
    console.log('╚═══════════════════════════════════════════╝');
    process.exit(1);
}

if (!id) {
    console.error(`❌ Error: Please provide a ${testType} ID`);
    console.log(`   Example: node test-api.js ${testType} ${testType === 'race' ? 'race37' : 'trainer1'}`);
    process.exit(1);
}

const API_PATH = testType === 'race' ? `/api/races/${id}` : `/api/trainers/${id}`;
const API_URL = `http://localhost:3000${API_PATH}`;

console.log('╔═══════════════════════════════════════════╗');
console.log(`  Testing GET ${testType === 'race' ? 'Race' : 'Trainer'} by ID`);
console.log('╠═══════════════════════════════════════════╣');
console.log(`  ${testType === 'race' ? 'Race' : 'Trainer'} ID: ${id}`);
console.log(`  URL: ${API_URL}`);
console.log('╚═══════════════════════════════════════════╝\n');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: API_PATH,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

const req = http.request(options, (res) => {
    let data = '';

    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Status Message: ${res.statusMessage}`);
    console.log('─'.repeat(50));

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const jsonData = JSON.parse(data);
            
            if (testType === 'race') {
                // Display Race Information
                if (jsonData.race) {
                    console.log('\n✅ Race Information:');
                    console.log(`   Race ID: ${jsonData.race.raceId}`);
                    console.log(`   Race Name: ${jsonData.race.raceName}`);
                    console.log(`   Track: ${jsonData.race.trackName}`);
                    console.log(`   Location: ${jsonData.race.location || 'N/A'}`);
                    console.log(`   Track Length: ${jsonData.race.length || 'N/A'}`);
                    console.log(`   Date: ${jsonData.race.raceDate}`);
                    console.log(`   Time: ${jsonData.race.raceTime}`);
                }
                
                if (jsonData.results && jsonData.results.length > 0) {
                    console.log('\n🏇 Race Results (Ordered by Position):');
                    jsonData.results.forEach((result, index) => {
                        console.log(`   ${index + 1}. ${result.horseName} (${result.horseId}) - ${result.results} - Prize: $${result.prize}`);
                    });
                } else {
                    console.log('\n⚠️  No results found for this race');
                }
            } else {
                // Display Trainer Information
                if (jsonData.trainerId) {
                    console.log('\n✅ Trainer Information:');
                    console.log(`   Trainer ID: ${jsonData.trainerId}`);
                    console.log(`   First Name: ${jsonData.fname}`);
                    console.log(`   Last Name: ${jsonData.lname}`);
                    console.log(`   Full Name: ${jsonData.fname} ${jsonData.lname}`);
                    console.log(`   Stable ID: ${jsonData.stableId}`);
                    console.log(`   Stable Name: ${jsonData.stableName || 'N/A'}`);
                    console.log(`   Stable Location: ${jsonData.location || 'N/A'}`);
                }
            }
        } catch (error) {
            console.log('\n❌ Error parsing response:');
            console.log(data);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request Error:');
    console.error(error.message);
    console.log('\n💡 Make sure:');
    console.log('   - Your server is running on port 3000');
    console.log(`   - The ${testType} ID exists in your database`);
});

req.end();

