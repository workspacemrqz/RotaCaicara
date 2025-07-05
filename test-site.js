
/**
 * Comprehensive Site Testing Script
 * Tests all functionalities and data integrity
 */

import { createRequire } from 'module';
import http from 'http';
import https from 'https';
import util from 'util';

const require = createRequire(import.meta.url);
const BASE_URL = 'http://localhost:5000';

// Utility functions
function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '🔵 INFO',
    success: '✅ SUCCESS',
    warning: '⚠️ WARNING',
    error: '❌ ERROR',
    test: '🧪 TEST'
  }[level] || '📝 LOG';
  
  console.log(`[${timestamp}] ${prefix}: ${message}`);
  if (data) {
    console.log(util.inspect(data, { colors: true, depth: 3 }));
  }
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const requestModule = url.startsWith('https') ? https : http;
    const req = requestModule.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsed,
            rawData: data
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: null,
            rawData: data,
            parseError: error.message
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Test functions
async function testServerHealth() {
  log('test', 'Testing server health...');
  try {
    const response = await makeRequest(`${BASE_URL}/health`);
    if (response.statusCode === 200) {
      log('success', 'Server health check passed', response.data);
      return true;
    } else {
      log('error', 'Server health check failed', { statusCode: response.statusCode });
      return false;
    }
  } catch (error) {
    log('error', 'Server health check failed', error.message);
    return false;
  }
}

async function testCategoriesAPI() {
  log('test', 'Testing Categories API...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/categories`);
    
    if (response.statusCode !== 200) {
      log('error', 'Categories API failed', { statusCode: response.statusCode });
      return false;
    }
    
    const categories = response.data;
    
    // Validate response structure
    if (!Array.isArray(categories)) {
      log('error', 'Categories response is not an array');
      return false;
    }
    
    log('success', `Categories API returned ${categories.length} categories`);
    
    // Validate each category structure
    const validCategories = categories.filter(cat => {
      const hasRequiredFields = cat.id && cat.name && cat.slug;
      if (!hasRequiredFields) {
        log('warning', 'Category missing required fields', cat);
      }
      return hasRequiredFields;
    });
    
    log('info', `${validCategories.length}/${categories.length} categories have valid structure`);
    
    // Test individual category by slug
    if (categories.length > 0) {
      const testCategory = categories[0];
      const categoryResponse = await makeRequest(`${BASE_URL}/api/categories/${testCategory.slug}`);
      if (categoryResponse.statusCode === 200) {
        log('success', 'Individual category fetch successful', categoryResponse.data);
      } else {
        log('error', 'Individual category fetch failed', { slug: testCategory.slug, statusCode: categoryResponse.statusCode });
      }
    }
    
    return true;
  } catch (error) {
    log('error', 'Categories API test failed', error.message);
    return false;
  }
}

async function testBusinessesAPI() {
  log('test', 'Testing Businesses API...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/businesses`);
    
    if (response.statusCode !== 200) {
      log('error', 'Businesses API failed', { statusCode: response.statusCode });
      return false;
    }
    
    const businesses = response.data;
    
    if (!Array.isArray(businesses)) {
      log('error', 'Businesses response is not an array');
      return false;
    }
    
    log('success', `Businesses API returned ${businesses.length} businesses`);
    
    // Validate business structure
    const validBusinesses = businesses.filter(business => {
      const hasRequiredFields = business.id && business.name && business.categoryId;
      if (!hasRequiredFields) {
        log('warning', 'Business missing required fields', business);
      }
      return hasRequiredFields;
    });
    
    log('info', `${validBusinesses.length}/${businesses.length} businesses have valid structure`);
    
    // Test featured businesses
    const featuredResponse = await makeRequest(`${BASE_URL}/api/businesses/featured`);
    if (featuredResponse.statusCode === 200) {
      log('success', `Featured businesses API returned ${featuredResponse.data.length} businesses`);
    } else {
      log('error', 'Featured businesses API failed');
    }
    
    // Test individual business fetch
    if (businesses.length > 0) {
      const testBusiness = businesses[0];
      const businessResponse = await makeRequest(`${BASE_URL}/api/businesses/${testBusiness.id}`);
      if (businessResponse.statusCode === 200) {
        log('success', 'Individual business fetch successful', businessResponse.data);
      } else {
        log('error', 'Individual business fetch failed', { id: testBusiness.id, statusCode: businessResponse.statusCode });
      }
    }
    
    // Test search functionality
    const searchResponse = await makeRequest(`${BASE_URL}/api/businesses/search?q=test`);
    if (searchResponse.statusCode === 200) {
      log('success', `Search API returned ${searchResponse.data.length} results`);
    } else {
      log('error', 'Search API failed');
    }
    
    return true;
  } catch (error) {
    log('error', 'Businesses API test failed', error.message);
    return false;
  }
}

async function testSiteSettingsAPI() {
  log('test', 'Testing Site Settings API...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/site-settings`);
    
    if (response.statusCode !== 200) {
      log('error', 'Site Settings API failed', { statusCode: response.statusCode });
      return false;
    }
    
    const settings = response.data;
    
    // Validate settings structure
    const requiredFields = ['siteName', 'locality', 'phone', 'email'];
    const missingFields = requiredFields.filter(field => !settings[field]);
    
    if (missingFields.length > 0) {
      log('warning', 'Site settings missing required fields', missingFields);
    } else {
      log('success', 'Site settings have all required fields');
    }
    
    log('info', 'Site settings validation', {
      siteName: !!settings.siteName,
      locality: !!settings.locality,
      phone: !!settings.phone,
      email: !!settings.email,
      totalFields: Object.keys(settings).length
    });
    
    return true;
  } catch (error) {
    log('error', 'Site Settings API test failed', error.message);
    return false;
  }
}

async function testBusinessRegistrationAPI() {
  log('test', 'Testing Business Registration API...');
  try {
    // First get categories to use valid categoryId
    const categoriesResponse = await makeRequest(`${BASE_URL}/api/categories`);
    if (categoriesResponse.statusCode !== 200 || !categoriesResponse.data.length) {
      log('error', 'Cannot test business registration - no categories available');
      return false;
    }
    
    const testRegistration = {
      businessName: `Test Business ${Date.now()}`,
      categoryId: categoriesResponse.data[0].id,
      phone: "12999999999",
      whatsapp: "12999999999",
      address: "Test Address, Test City",
      description: "Test business description",
      contactEmail: "test@example.com"
    };
    
    const response = await makeRequest(`${BASE_URL}/api/business-registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testRegistration)
    });
    
    if (response.statusCode === 201) {
      log('success', 'Business registration API test passed', response.data);
      
      // Test fetching registrations (admin endpoint)
      const getResponse = await makeRequest(`${BASE_URL}/api/admin/business-registrations`);
      if (getResponse.statusCode === 200) {
        log('success', `Business registrations fetch returned ${getResponse.data.length} registrations`);
      }
      
      return true;
    } else {
      log('error', 'Business registration API failed', { statusCode: response.statusCode, data: response.data });
      return false;
    }
  } catch (error) {
    log('error', 'Business Registration API test failed', error.message);
    return false;
  }
}

async function testAdminEndpoints() {
  log('test', 'Testing Admin Endpoints...');
  let passed = 0;
  let total = 0;
  
  const endpoints = [
    '/api/admin/business-registrations',
    '/api/admin/banners',
    '/api/admin/settings',
    '/api/admin/testimonials',
    '/api/admin/faqs',
    '/api/admin/promotions',
    '/api/admin/logs',
    '/api/admin/analytics'
  ];
  
  for (const endpoint of endpoints) {
    total++;
    try {
      const response = await makeRequest(`${BASE_URL}${endpoint}`);
      if (response.statusCode === 200) {
        log('success', `Admin endpoint ${endpoint} working`, { dataLength: response.data?.length || 'N/A' });
        passed++;
      } else {
        log('error', `Admin endpoint ${endpoint} failed`, { statusCode: response.statusCode });
      }
    } catch (error) {
      log('error', `Admin endpoint ${endpoint} error`, error.message);
    }
  }
  
  log('info', `Admin endpoints test: ${passed}/${total} passed`);
  return passed === total;
}

async function testDataIntegrity() {
  log('test', 'Testing Data Integrity...');
  try {
    // Get all data
    const [categoriesResp, businessesResp, settingsResp] = await Promise.all([
      makeRequest(`${BASE_URL}/api/categories`),
      makeRequest(`${BASE_URL}/api/businesses`),
      makeRequest(`${BASE_URL}/api/site-settings`)
    ]);
    
    if (categoriesResp.statusCode !== 200 || businessesResp.statusCode !== 200 || settingsResp.statusCode !== 200) {
      log('error', 'Failed to fetch data for integrity check');
      return false;
    }
    
    const categories = categoriesResp.data;
    const businesses = businessesResp.data;
    const settings = settingsResp.data;
    
    // Check category-business relationships
    const categoryIds = new Set(categories.map(c => c.id));
    const invalidBusinesses = businesses.filter(b => !categoryIds.has(b.categoryId));
    
    if (invalidBusinesses.length > 0) {
      log('warning', `${invalidBusinesses.length} businesses have invalid categoryId`, invalidBusinesses.map(b => ({ id: b.id, name: b.name, categoryId: b.categoryId })));
    } else {
      log('success', 'All businesses have valid category relationships');
    }
    
    // Check for duplicate slugs
    const slugs = categories.map(c => c.slug);
    const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
    if (duplicateSlugs.length > 0) {
      log('warning', 'Duplicate category slugs found', duplicateSlugs);
    } else {
      log('success', 'No duplicate category slugs found');
    }
    
    // Check settings completeness
    const criticalSettings = ['siteName', 'locality', 'phone', 'email'];
    const missingCriticalSettings = criticalSettings.filter(key => !settings[key]);
    if (missingCriticalSettings.length > 0) {
      log('warning', 'Missing critical settings', missingCriticalSettings);
    } else {
      log('success', 'All critical settings are present');
    }
    
    return true;
  } catch (error) {
    log('error', 'Data integrity test failed', error.message);
    return false;
  }
}

async function runAllTests() {
  log('info', '🚀 Starting comprehensive site testing...');
  
  const tests = [
    { name: 'Server Health', fn: testServerHealth },
    { name: 'Categories API', fn: testCategoriesAPI },
    { name: 'Businesses API', fn: testBusinessesAPI },
    { name: 'Site Settings API', fn: testSiteSettingsAPI },
    { name: 'Business Registration API', fn: testBusinessRegistrationAPI },
    { name: 'Admin Endpoints', fn: testAdminEndpoints },
    { name: 'Data Integrity', fn: testDataIntegrity }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    log('info', `\n--- Running ${test.name} Test ---`);
    try {
      const result = await test.fn();
      if (result) {
        passed++;
        log('success', `${test.name} test PASSED`);
      } else {
        log('error', `${test.name} test FAILED`);
      }
    } catch (error) {
      log('error', `${test.name} test ERROR`, error.message);
    }
  }
  
  log('info', '\n=== TEST SUMMARY ===');
  log('info', `Tests passed: ${passed}/${total}`);
  log('info', `Success rate: ${((passed / total) * 100).toFixed(1)}%`);
  
  if (passed === total) {
    log('success', '🎉 All tests passed! Site is functioning correctly.');
  } else {
    log('warning', '⚠️ Some tests failed. Please review the logs above.');
  }
  
  return passed === total;
}

// Run the tests
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(error => {
    log('error', 'Test runner failed', error);
    process.exit(1);
  });
}

export { runAllTests, log };
