const Strapi = require('@strapi/strapi');
const path = require('path');

/**
 * Script to duplicate 'sections.learn-next' in the Home Page.
 * Usage: node scripts/duplicate-section.js
 */
(async () => {
  try {
    // 1. Initialize Strapi
    const appDir = path.resolve(__dirname, '..');
    console.log('Starting Strapi...');
    // Note: distDir might be needed if running compiled code, but simple JS works with appDir usually
    const strapi = await Strapi({ distDir: appDir, appDir }).load();
    
    const UID = 'api::home-page.home-page';

    // 2. Fetch Home Page (Draft)
    console.log('Fetching Home Page...');
    // Strapi 5 Document Service
    const homePage = await strapi.documents(UID).findFirst({
        populate: {
            blocks: {
                populate: '*' // Populate nested fields (lists, images, etc.)
            }
        },
        status: 'draft' // We modify the draft
    });

    if (!homePage) {
        throw new Error('Home Page not found');
    }

    const blocks = homePage.blocks || [];
    console.log(`Current blocks count: ${blocks.length}`);

    // 3. Find the section
    const sectionIndex = blocks.findIndex(b => b.__component === 'sections.learn-next');

    if (sectionIndex === -1) {
        console.log('Target section "sections.learn-next" not found.');
        return;
    }

    console.log(`Found "sections.learn-next" at index ${sectionIndex}`);

    // 4. Clone and Clean (Remove IDs)
    const sectionToClone = blocks[sectionIndex];
    
    // Recursive function to remove IDs from the object tree
    const removeIds = (obj) => {
        if (Array.isArray(obj)) return obj.map(removeIds);
        if (obj && typeof obj === 'object') {
            // Remove 'id' and 'documentId' just in case
            const { id, documentId, ...rest } = obj;
            
            // Recursively clean children
            Object.keys(rest).forEach(key => {
                rest[key] = removeIds(rest[key]);
            });
            return rest;
        }
        return obj;
    };

    const clone = removeIds(JSON.parse(JSON.stringify(sectionToClone)));
    
    // Add a marker to title if it exists (Optional, allows verifying duplication)
    if (clone.title) {
        clone.title = `${clone.title} (Copy)`;
    }

    // 5. Insert Clone
    // Insert immediately after the original
    const newBlocks = [
        ...blocks.slice(0, sectionIndex + 1),
        clone,
        ...blocks.slice(sectionIndex + 1)
    ];

    // 6. Update Home Page
    console.log('Updating Home Page...');
    await strapi.documents(UID).update({
        documentId: homePage.documentId,
        data: {
            blocks: newBlocks
        },
        status: 'draft'
    });

    console.log('✅ Section duplicated successfully!');
    console.log(`New blocks count: ${newBlocks.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // 7. Cleanup
    process.exit(0);
  }
})();
