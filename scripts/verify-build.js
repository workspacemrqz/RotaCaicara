
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Quick build verification...');

const checks = [
  {
    path: './dist/index.js',
    name: 'Server Bundle',
    type: 'file'
  },
  {
    path: './dist/public',
    name: 'Client Directory',
    type: 'directory'
  },
  {
    path: './dist/public/index.html',
    name: 'Client Entry Point',
    type: 'file'
  },
  {
    path: './dist/public/assets',
    name: 'Client Assets',
    type: 'directory',
    optional: true
  }
];

let allPassed = true;

checks.forEach(check => {
  const exists = fs.existsSync(check.path);
  
  if (exists) {
    const stats = fs.statSync(check.path);
    const isCorrectType = check.type === 'file' ? stats.isFile() : stats.isDirectory();
    
    if (isCorrectType) {
      console.log(`✅ ${check.name}: ${check.path}`);
      
      if (check.type === 'file') {
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`   📏 Size: ${sizeKB}KB`);
      } else {
        const files = fs.readdirSync(check.path);
        console.log(`   📁 Files: ${files.length}`);
      }
    } else {
      console.log(`❌ ${check.name}: Wrong type (expected ${check.type})`);
      if (!check.optional) allPassed = false;
    }
  } else {
    if (check.optional) {
      console.log(`⚠️  ${check.name}: Not found (optional)`);
    } else {
      console.log(`❌ ${check.name}: Not found - ${check.path}`);
      allPassed = false;
    }
  }
});

if (allPassed) {
  console.log('\n✅ Build verification passed!');
  process.exit(0);
} else {
  console.log('\n❌ Build verification failed!');
  console.log('Run "npm run validate:build" for detailed analysis.');
  process.exit(1);
}
