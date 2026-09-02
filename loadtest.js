// loadtest.js
// Fires concurrent writes at a throwaway "/loadtest" path in your Firebase
// Realtime Database (never touches real booking/user data), times each
// write's round trip, then deletes the test data when done.
//
// Run with: node loadtest.js

const DB_URL = "https://smartpark-hg-default-rtdb.firebaseio.com";
const CONCURRENT_WRITES = 50;

async function runLoadTest() {
    console.log(`Firing ${CONCURRENT_WRITES} concurrent writes to Firebase Realtime Database...\n`);

    const start = Date.now();
    const promises = [];

    for (let i = 0; i < CONCURRENT_WRITES; i++) {
        const writeStart = Date.now();
        const promise = fetch(`${DB_URL}/loadtest/client_${i}.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ts: writeStart, clientId: i })
        })
            .then(res => ({ ok: res.ok, latency: Date.now() - writeStart }))
            .catch(err => ({ ok: false, latency: null, error: err.message }));
        promises.push(promise);
    }

    const results = await Promise.all(promises);
    const totalTime = Date.now() - start;

    const successful = results.filter(r => r.ok);
    const latencies = successful.map(r => r.latency);
    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const maxLatency = Math.max(...latencies);
    const minLatency = Math.min(...latencies);

    console.log("--- Results ---");
    console.log(`Successful writes: ${successful.length}/${CONCURRENT_WRITES}`);
    console.log(`Total time for all ${CONCURRENT_WRITES} writes to complete: ${totalTime}ms`);
    console.log(`Average write latency: ${avgLatency.toFixed(0)}ms`);
    console.log(`Min / Max latency: ${minLatency}ms / ${maxLatency}ms`);

    console.log("\nCleaning up test data...");
    const cleanup = await fetch(`${DB_URL}/loadtest.json`, { method: "DELETE" });
    console.log(cleanup.ok
        ? "Cleanup successful — no test data left behind."
        : "Cleanup request failed. Go to the Firebase console > Realtime Database and manually delete the 'loadtest' node.");
}

runLoadTest();
