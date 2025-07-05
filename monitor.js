
/**
 * Real-time Site Monitoring Script
 * Continuously monitors site health and logs issues
 */

import http from 'http';
import util from 'util';

const BASE_URL = 'http://localhost:5000';
const MONITOR_INTERVAL = 30000; // 30 seconds

function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '🔵 INFO',
    success: '✅ SUCCESS',
    warning: '⚠️ WARNING',
    error: '❌ ERROR',
    monitor: '👁️ MONITOR'
  }[level] || '📝 LOG';
  
  console.log(`[${timestamp}] ${prefix}: ${message}`);
  if (data) {
    console.log(util.inspect(data, { colors: true, depth: 2 }));
  }
}

function makeRequest(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { timeout }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsed,
            responseTime: Date.now() - startTime
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: null,
            parseError: error.message,
            responseTime: Date.now() - startTime
          });
        }
      });
    });
    
    const startTime = Date.now();
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

async function checkEndpoint(name, url) {
  try {
    const response = await makeRequest(url);
    if (response.statusCode === 200) {
      log('success', `${name} OK (${response.responseTime}ms)`);
      return true;
    } else {
      log('warning', `${name} returned ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    log('error', `${name} failed: ${error.message}`);
    return false;
  }
}

async function monitorCycle() {
  log('monitor', 'Starting monitoring cycle...');
  
  const endpoints = [
    { name: 'Health Check', url: `${BASE_URL}/health` },
    { name: 'Categories API', url: `${BASE_URL}/api/categories` },
    { name: 'Businesses API', url: `${BASE_URL}/api/businesses` },
    { name: 'Featured Businesses', url: `${BASE_URL}/api/businesses/featured` },
    { name: 'Site Settings', url: `${BASE_URL}/api/site-settings` }
  ];
  
  let healthy = 0;
  const total = endpoints.length;
  
  for (const endpoint of endpoints) {
    const isHealthy = await checkEndpoint(endpoint.name, endpoint.url);
    if (isHealthy) healthy++;
  }
  
  const healthPercentage = (healthy / total * 100).toFixed(1);
  
  if (healthy === total) {
    log('success', `All systems operational (${healthPercentage}%)`);
  } else {
    log('warning', `System health: ${healthy}/${total} endpoints healthy (${healthPercentage}%)`);
  }
  
  // Memory usage check
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const memory = process.memoryUsage();
    const memoryMB = {
      rss: Math.round(memory.rss / 1024 / 1024),
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
      external: Math.round(memory.external / 1024 / 1024)
    };
    
    if (memoryMB.heapUsed > 100) {
      log('warning', 'High memory usage detected', memoryMB);
    } else {
      log('info', 'Memory usage normal', memoryMB);
    }
  }
  
  log('monitor', `Next check in ${MONITOR_INTERVAL / 1000} seconds\n`);
}

function startMonitoring() {
  log('monitor', '🚀 Starting real-time site monitoring...');
  log('info', `Monitoring interval: ${MONITOR_INTERVAL / 1000} seconds`);
  log('info', `Base URL: ${BASE_URL}\n`);
  
  // Initial check
  monitorCycle();
  
  // Set up interval
  setInterval(monitorCycle, MONITOR_INTERVAL);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log('monitor', 'Stopping monitoring...');
    process.exit(0);
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startMonitoring();
}

export { startMonitoring, log };
