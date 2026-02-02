
export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    try {
      // 1. Grant Public Permissions for Home Page & Brand
      const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
      
      if (publicRole) {
          const endpoints = [
              'api::home-page.home-page.find',
              'api::brand.brand.find'
          ];

          for (const action of endpoints) {
              const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({ 
                  where: { action, role: publicRole.id } 
              });

              if (!existing) {
                  await strapi.db.query('plugin::users-permissions.permission').create({ 
                      data: { action, role: publicRole.id } 
                  });
                  strapi.log.info(`Define: Auto-granted public permission: ${action}`);
              }
          }
      }

      // 2. Upload Logo Assets if missing
      const fs = require('fs');
      const path = require('path');
      
      // Helper to upload file if not exists
      const uploadFile = async (paramName, fileName) => {
          // Check if file already exists in Media Library by name
          const existingFile = await strapi.db.query('plugin::upload.file').findOne({
              where: { name: fileName }
          });
          if (existingFile) return existingFile;

          const filePath = path.join(process.cwd(), '../public/images', fileName); 
          // Note: accessing parent directory assuming strapi_backend is sibling to public

          // Correct path if running from strapi_backend
          const realPath = path.resolve(__dirname, '../../public/images', fileName);

          if (!fs.existsSync(realPath)) {
             strapi.log.warn(`Define: Logo file not found at ${realPath}`);
             return null;
          }

          const stats = fs.statSync(realPath);
          
          return await strapi.plugins.upload.services.upload.upload({
              data: {
                  fileInfo: { name: fileName },
              },
              files: {
                  path: realPath,
                  name: fileName,
                  type: 'image/png', // simplistic MIME type
                  size: stats.size,
              },
          });
      };

      // Upload logos
      const blueLogoFile = await uploadFile('logo_blue', 'logo_blue.png'); 
      const whiteLogoFile = await uploadFile('logo_white', 'iqrasity-logo-white.png');


      // 3. Bootstrap Brand Single Type
      // We use try/catch block for findFirst in case the Content Type isn't loaded yet
      try {
        const brandPage = await strapi.documents('api::brand.brand').findFirst();
        if (!brandPage) {
            strapi.log.info('Define: Bootstrapping Brand Data...');
            await strapi.documents('api::brand.brand').create({
                data: {
                    alt_text: 'Iqrasity LMS',
                    logo_blue: blueLogoFile ? blueLogoFile[0].id : null, 
                    logo_white: whiteLogoFile ? whiteLogoFile[0].id : null,
                    status: 'published'
                }
            });
        }
      } catch (err) {
         strapi.log.warn('Define: Could not find brand type yet. ' + err.message);
      }

      // 4. Bootstrap Home Page Data (Existing Logic)
      try {
          const homePage = await strapi.documents('api::home-page.home-page').findFirst();

          if (!homePage) {
            strapi.log.info('Define: Bootstrapping Home Page Data...');
            
            await strapi.documents('api::home-page.home-page').create({
              data: {
                blocks: [
                  {
                    __component: 'sections.hero-slider',
                    slides: [
                      {
                        title: 'Welcome to Iqrasity',
                        subtitle: 'Learn Without Limits',
                        description: 'Access world-class education from anywhere.',
                        layout: 'odoo_standard',
                        buttons: [{ label: 'Explore Courses', url: '/courses', variant: 'primary_pill' }]
                      }
                    ]
                  },
                  // ... rest of sections (abbreviated for brevity in replacement, keeping existing)
                  {
                    __component: 'sections.features-grid',
                    title: 'All in one place with Iqrasity',
                    subtitle: 'What We Offer',
                    items: [
                       { title: 'Online Courses', description: 'Learn at your own pace', link: '/courses' },
                       { title: 'Digital Certification', description: 'Earn recognized certs', link: '/certs' },
                       { title: 'Expert Instructors', description: 'Learn from the best', link: '/instructors' }
                    ]
                  },
                  {
                    __component: 'sections.learning-formats',
                    title: 'Learning Formats',
                    items: [
                        { title: 'Self-Paced', description: 'Flexible learning', button: { label: 'Start', variant: 'primary_pill'} },
                        { title: 'Live Classes', description: 'Interactive sessions', button: { label: 'Join', variant: 'primary_pill'} }
                    ]
                  },
                  {
                    __component: 'sections.microsoft-spotlight',
                    title: 'Sharpen your skills',
                    subtitle: 'Microsoft Programs',
                    programs: [
                        { label: 'Azure Fundamentals', url: '#' },
                        { label: 'Data Science', url: '#' }
                    ]
                  },
                   {
                    __component: 'sections.explore-careers',
                    title: 'Explore Careers',
                    cta_link: { label: 'View All', url: '/careers', variant: 'secondary' },
                    items: [
                        { title: 'Software Developer', link: '#' },
                        { title: 'Data Analyst', link: '#' }
                    ]
                  },
                  {
                      __component: 'sections.achieve-goals',
                      items: [
                          { title: 'Upskill', description: 'Advance your career', link: '#' },
                          { title: 'Reskill', description: 'Switch careers', link: '#' }
                      ]
                  },
                  {
                      __component: 'sections.practice-exams',
                      title: 'Ace Your Exams',
                      highlight: 'Exam Prep',
                      description: 'Comprehensive practice tests available.',
                      button: { label: 'Practice Now', url: '/exams', variant: 'primary_pill' }
                  },
                  {
                      __component: 'sections.learn-next',
                      title: 'What to learn next',
                      description: 'Recommended for you',
                      items: [
                          { title: 'Advanced React', description: 'Web Dev', button: { label: 'View', variant: 'outline'} }
                      ]
                  },
                  {
                      __component: 'sections.institutional-programs',
                      left_title: 'For Schools',
                      right_title: 'For Businesses',
                      left_button: { label: 'Learn More', variant: 'primary_pill' },
                      right_button: { label: 'Partner', variant: 'primary_pill' }
                  },
                  {
                      __component: 'sections.ai-journey',
                      title: 'Start your AI Journey',
                      description: 'Master Artificial Intelligence today.',
                      button: { label: 'Get Started', variant: 'primary_pill' }
                  },
                  {
                      __component: 'sections.categories',
                      title: 'Browse Categories'
                  }
                ]
              },
              status: 'published' // Strapi 5 uses status for draft/publish
            });
            strapi.log.info('Define: Home Page Bootstrapped Successfully.');
          } else {
              strapi.log.info('Define: Home Page already exists, skipping bootstrap.');
          }
      } catch (err) {
           strapi.log.warn('Define: Could not find home-page type yet. It might be loading... ' + err.message);
      }

    } catch (error) {
      strapi.log.error('Define: Bootstrap error: ' + error.message);
    }
  },
};
