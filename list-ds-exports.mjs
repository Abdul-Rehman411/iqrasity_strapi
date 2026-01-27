import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ds = require('@strapi/design-system/dist/index.js');

console.log('--- Design System Exports ---');
Object.keys(ds).forEach(key => {
  const exportVal = ds[key];
  const type = typeof exportVal;
  if (type === 'object' && exportVal !== null) {
      console.log(`${key}: Object { ${Object.keys(exportVal).join(', ')} }`);
  } else if (type === 'function') {
      const staticProps = Object.keys(exportVal);
      if (staticProps.length > 0) {
           console.log(`${key}: Component/Function with props: { ${staticProps.join(', ')} }`);
      } else {
           console.log(`${key}: Component/Function`);
      }
  } else {
      console.log(`${key}: ${type}`);
  }
});
