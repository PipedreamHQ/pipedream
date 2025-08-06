#!/usr/bin/env node

/**
 * Test script for the create-package-validation-issue action
 * This helps test the action logic locally without GitHub Actions
 */

const fs = require('fs');
const path = require('path');

// Mock the GitHub Actions environment
process.env.GITHUB_REPOSITORY = 'pipedream/pipedream';
process.env.GITHUB_SERVER_URL = 'https://github.com';

// Mock @actions/core
const mockCore = {
  info: (message) => console.log(`[INFO] ${message}`),
  warning: (message) => console.log(`[WARN] ${message}`),
  error: (message) => console.log(`[ERROR] ${message}`),
  setFailed: (message) => console.log(`[FAILED] ${message}`),
  setOutput: (name, value) => console.log(`[OUTPUT] ${name}=${value}`),
  getInput: (name) => {
    const inputs = {
      'github-token': 'fake-token-for-testing',
      'validation-report-json': path.join(__dirname, 'sample-report.json'),
      'validation-report-txt': path.join(__dirname, 'sample-report.txt'),
      'workflow-run-number': '123',
      'workflow-run-id': '456',
      'server-url': 'https://github.com',
      'repository': 'pipedream/pipedream'
    };
    return inputs[name] || '';
  }
};

// Mock @actions/github
const mockGithub = {
  context: {
    repo: {
      owner: 'pipedream',
      repo: 'pipedream'
    }
  },
  getOctokit: (token) => ({
    rest: {
      issues: {
        listForRepo: async () => ({
          data: [] // No existing issues for testing
        }),
        create: async (params) => {
          console.log('[MOCK] Would create issue:', params.title);
          return {
            data: {
              html_url: 'https://github.com/pipedream/pipedream/issues/123'
            }
          };
        },
        createComment: async (params) => {
          console.log('[MOCK] Would create comment on issue:', params.issue_number);
          return { data: {} };
        }
      }
    }
  })
};

// Create sample test data
const sampleReport = {
  generatedAt: new Date().toISOString(),
  summary: {
    total: 100,
    validated: 85,
    failed: 15,
    skipped: 50,
    publishable: 100,
    failureRate: '15.00'
  },
  validated: [
    { app: 'netlify', packageName: '@pipedream/netlify' },
    { app: 'slack', packageName: '@pipedream/slack' }
  ],
  failed: [
    {
      app: 'google_slides',
      packageName: '@pipedream/google_slides',
      failures: [
        { check: 'import', error: 'Cannot find module' },
        { check: 'dependencies', error: 'Missing @pipedream/platform' }
      ]
    },
    {
      app: 'broken_app',
      packageName: '@pipedream/broken_app',
      failures: [
        { check: 'mainFile', error: 'Main file not found' }
      ]
    }
  ],
  skipped: [
    { app: 'private_app', packageName: 'private_app', reason: 'Not a @pipedream package' }
  ]
};

const sampleTextReport = `
📊 PIPEDREAM PACKAGE VALIDATION REPORT
Generated: ${new Date().toISOString()}
Total Components: 100
=============================================================

❌ google_slides (@pipedream/google_slides) - FAILED: Import test failed
❌ broken_app (@pipedream/broken_app) - FAILED: Main file not found
✅ netlify (@pipedream/netlify) - VALID
✅ slack (@pipedream/slack) - VALID

📊 DETAILED VALIDATION SUMMARY
=============================================================
📦 Total Components: 100
✅ Validated Successfully: 85
❌ Failed Validation: 15
⏭️ Skipped: 50
📈 Publishable Packages: 100
📉 Failure Rate: 15.00%
`;

// Write test files
const testDir = __dirname;
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

fs.writeFileSync(
  path.join(testDir, 'sample-report.json'),
  JSON.stringify(sampleReport, null, 2)
);

fs.writeFileSync(
  path.join(testDir, 'sample-report.txt'),
  sampleTextReport
);

// Mock the modules and run the action
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(id) {
  if (id === '@actions/core') {
    return mockCore;
  }
  if (id === '@actions/github') {
    return mockGithub;
  }
  return originalRequire.apply(this, arguments);
};

// Import and run the action
const { run } = require('../src/index.js');

console.log('🧪 Testing create-package-validation-issue action...\n');

run()
  .then(() => {
    console.log('\n✅ Test completed successfully!');
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  })
  .finally(() => {
    // Cleanup
    try {
      fs.unlinkSync(path.join(testDir, 'sample-report.json'));
      fs.unlinkSync(path.join(testDir, 'sample-report.txt'));
    } catch (e) {
      // Ignore cleanup errors
    }
  });