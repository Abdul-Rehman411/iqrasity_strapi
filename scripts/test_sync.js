const STRAPI_URL = 'http://localhost:1337';
const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN'; // Optional if not protected by policy

async function triggerSync() {
    console.log('Triggering Full Sync...');
    try {
        const res = await fetch(`${STRAPI_URL}/moodle-sync/sync/all`, {
            method: 'POST',
            headers: {
                // Add Authorization if needed
                // 'Authorization': `Bearer ${ADMIN_TOKEN}`
            }
        });
        const data = await res.json();
        console.log('Sync Results:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Trigger Failed:', e.message);
    }
}

triggerSync();
