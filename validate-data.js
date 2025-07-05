
#!/usr/bin/env node

/**
 * Data Validation Script
 * Validates database structure and data integrity
 */

const http = require('http');
const util = require('util');

const BASE_URL = 'http://localhost:5000';

function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '🔵 INFO',
    success: '✅ SUCCESS',
    warning: '⚠️ WARNING',
    error: '❌ ERROR',
    validation: '🔍 VALIDATION'
  }[level] || '📝 LOG';
  
  console.log(`[${timestamp}] ${prefix}: ${message}`);
  if (data) {
    console.log(util.inspect(data, { colors: true, depth: 3 }));
  }
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({
            statusCode: res.statusCode,
            data: parsed
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: null,
            parseError: error.message
          });
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function validateCategories() {
  log('validation', 'Validating categories data...');
  
  const response = await makeRequest(`${BASE_URL}/api/categories`);
  if (response.statusCode !== 200) {
    log('error', 'Failed to fetch categories');
    return false;
  }
  
  const categories = response.data;
  let issues = 0;
  
  // Required fields validation
  const requiredFields = ['id', 'name', 'slug', 'active'];
  categories.forEach((category, index) => {
    const missingFields = requiredFields.filter(field => category[field] === undefined || category[field] === null);
    if (missingFields.length > 0) {
      log('error', `Category ${index + 1} missing fields`, { category, missingFields });
      issues++;
    }
  });
  
  // Slug uniqueness
  const slugs = categories.map(c => c.slug);
  const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
  if (duplicateSlugs.length > 0) {
    log('error', 'Duplicate category slugs found', duplicateSlugs);
    issues++;
  }
  
  // Active categories check
  const activeCategories = categories.filter(c => c.active);
  if (activeCategories.length === 0) {
    log('warning', 'No active categories found');
    issues++;
  }
  
  log('success', `Categories validation: ${categories.length} total, ${activeCategories.length} active, ${issues} issues`);
  return issues === 0;
}

async function validateBusinesses() {
  log('validation', 'Validating businesses data...');
  
  const [businessResponse, categoriesResponse] = await Promise.all([
    makeRequest(`${BASE_URL}/api/businesses`),
    makeRequest(`${BASE_URL}/api/categories`)
  ]);
  
  if (businessResponse.statusCode !== 200 || categoriesResponse.statusCode !== 200) {
    log('error', 'Failed to fetch businesses or categories');
    return false;
  }
  
  const businesses = businessResponse.data;
  const categories = categoriesResponse.data;
  const categoryIds = new Set(categories.map(c => c.id));
  
  let issues = 0;
  
  // Required fields validation
  const requiredFields = ['id', 'name', 'categoryId', 'active'];
  businesses.forEach((business, index) => {
    const missingFields = requiredFields.filter(field => business[field] === undefined || business[field] === null);
    if (missingFields.length > 0) {
      log('error', `Business ${index + 1} missing fields`, { business: business.name, missingFields });
      issues++;
    }
    
    // Category relationship validation
    if (!categoryIds.has(business.categoryId)) {
      log('error', `Business "${business.name}" has invalid categoryId: ${business.categoryId}`);
      issues++;
    }
  });
  
  // Contact information validation
  const businessesWithoutContact = businesses.filter(b => !b.phone && !b.whatsapp && !b.email);
  if (businessesWithoutContact.length > 0) {
    log('warning', `${businessesWithoutContact.length} businesses have no contact information`);
  }
  
  // Featured businesses check
  const featuredBusinesses = businesses.filter(b => b.featured);
  log('info', `Featured businesses: ${featuredBusinesses.length}`);
  
  log('success', `Businesses validation: ${businesses.length} total, ${issues} issues`);
  return issues === 0;
}

async function validateSiteSettings() {
  log('validation', 'Validating site settings...');
  
  const response = await makeRequest(`${BASE_URL}/api/site-settings`);
  if (response.statusCode !== 200) {
    log('error', 'Failed to fetch site settings');
    return false;
  }
  
  const settings = response.data;
  let issues = 0;
  
  // Critical fields validation
  const criticalFields = ['siteName', 'locality', 'phone', 'email'];
  const missingCritical = criticalFields.filter(field => !settings[field]);
  if (missingCritical.length > 0) {
    log('error', 'Missing critical settings', missingCritical);
    issues += missingCritical.length;
  }
  
  // Optional but recommended fields
  const recommendedFields = ['address', 'instagramUrl', 'whatsappUrl', 'facebookUrl'];
  const missingRecommended = recommendedFields.filter(field => !settings[field]);
  if (missingRecommended.length > 0) {
    log('warning', 'Missing recommended settings', missingRecommended);
  }
  
  // Email validation
  if (settings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
    log('error', 'Invalid email format', settings.email);
    issues++;
  }
  
  // URL validation
  const urlFields = ['instagramUrl', 'whatsappUrl', 'facebookUrl'];
  urlFields.forEach(field => {
    if (settings[field] && !settings[field].startsWith('http')) {
      log('warning', `${field} should start with http/https`, settings[field]);
    }
  });
  
  log('success', `Site settings validation: ${Object.keys(settings).length} fields, ${issues} issues`);
  return issues === 0;
}

async function validateDataIntegrity() {
  log('validation', '🔍 Starting comprehensive data validation...');
  
  const validations = [
    { name: 'Categories', fn: validateCategories },
    { name: 'Businesses', fn: validateBusinesses },
    { name: 'Site Settings', fn: validateSiteSettings }
  ];
  
  let passed = 0;
  let total = validations.length;
  
  for (const validation of validations) {
    log('info', `\n--- Validating ${validation.name} ---`);
    try {
      const result = await validation.fn();
      if (result) {
        passed++;
        log('success', `${validation.name} validation PASSED`);
      } else {
        log('error', `${validation.name} validation FAILED`);
      }
    } catch (error) {
      log('error', `${validation.name} validation ERROR`, error.message);
    }
  }
  
  log('info', '\n=== VALIDATION SUMMARY ===');
  log('info', `Validations passed: ${passed}/${total}`);
  log('info', `Success rate: ${((passed / total) * 100).toFixed(1)}%`);
  
  if (passed === total) {
    log('success', '🎉 All data validations passed! Database integrity confirmed.');
  } else {
    log('warning', '⚠️ Some validations failed. Please review the issues above.');
  }
  
  return passed === total;
}

// Run validation
if (require.main === module) {
  validateDataIntegrity().catch(error => {
    log('error', 'Validation runner failed', error);
    process.exit(1);
  });
}

module.exports = { validateDataIntegrity, log };
