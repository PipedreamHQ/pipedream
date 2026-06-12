const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Apps with known validation issues to suppress so they don't trigger failure
// reports. Keep this list small and document why each entry is here.
// Value can be `true` to ignore all checks for the app, or an array of check
// names (e.g. ['import', 'packageDependencies']) to ignore only specific ones.
const IGNORED_VALIDATIONS = {
  e2b: true, // Uses Pipedream's version-pinned import ("@e2b/code-interpreter@1.0.3"), which the dependency/import checks misread as a missing dep / invalid URL.
};

// Native Node.js modules that don't need to be in package.json
const NATIVE_MODULES = new Set([
  'assert', 'buffer', 'child_process', 'cluster', 'console', 'constants',
  'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'https',
  'module', 'net', 'os', 'path', 'perf_hooks', 'process', 'punycode',
  'querystring', 'readline', 'repl', 'stream', 'string_decoder', 'sys',
  'timers', 'tls', 'tty', 'url', 'util', 'v8', 'vm', 'wasi', 'worker_threads',
  'zlib', 'async_hooks', 'inspector', 'trace_events', 'http2'
]);

// Parse command line arguments
const args = process.argv.slice(2);
const isReportOnly = args.includes('--report-only');
const isVerbose = args.includes('--verbose');
const outputFile = args.find(arg => arg.startsWith('--output='))?.split('=')[1];
const singlePackage = args.find(arg => arg.startsWith('--package='))?.split('=')[1];
const isDryRun = args.includes('--dry-run');
const showHelp = args.includes('--help') || args.includes('-h');

// Show help if requested
if (showHelp) {
  console.log(`
📦 Pipedream Package Validation Tool

Usage: node scripts/generate-package-report.js [options]

Options:
  --package=<name>     Validate a single package (e.g. --package=netlify)
  --verbose           Show detailed validation output
  --dry-run           Preview which packages would be validated
  --report-only       Generate report without exiting on failures
  --output=<file>     Save JSON report to file (e.g. --output=report.json)
  --help, -h          Show this help message

Examples:
  # Validate all packages
  node scripts/generate-package-report.js

  # Validate single package with details
  node scripts/generate-package-report.js --package=netlify --verbose

  # Preview what would be validated
  node scripts/generate-package-report.js --dry-run

  # Generate report file
  node scripts/generate-package-report.js --report-only --output=report.json

NPM Scripts:
  npm run validate:packages              # Validate all packages
  npm run validate:packages:verbose      # Validate with verbose output
  npm run validate:packages:dry-run      # Preview validation
  npm run validate:package -- netlify    # Validate single package
`);
  process.exit(0);
}

function generatePackageReport() {
  const componentsDir = 'components';
  let apps = fs.readdirSync(componentsDir).filter(dir => {
    const packagePath = path.join(componentsDir, dir, 'package.json');
    return fs.existsSync(packagePath);
  });

  // Filter to single package if specified
  if (singlePackage) {
    apps = apps.filter(app => app === singlePackage);
    if (apps.length === 0) {
      console.error(`❌ Package '${singlePackage}' not found in components directory`);
      
      // Find similar package names
      const allDirs = fs.readdirSync(componentsDir);
      const similar = allDirs.filter(dir => 
        dir.toLowerCase().includes(singlePackage.toLowerCase()) ||
        singlePackage.toLowerCase().includes(dir.toLowerCase())
      );
      
      if (similar.length > 0) {
        console.log(`\n💡 Did you mean one of these?`);
        similar.slice(0, 5).forEach(name => {
          console.log(`   - ${name}`);
        });
      } else {
        console.log(`\n📂 Available packages (first 10): ${allDirs.slice(0, 10).join(', ')}...`);
        console.log(`   Total: ${allDirs.length} packages available`);
      }
      process.exit(1);
    }
    
    console.log(`🎯 Focusing on single package: ${singlePackage}`);
  }

  const results = {
    validated: [],
    failed: [],
    ignored: [],
    skipped: [],
    summary: {}
  };

  // Update header based on mode
  if (singlePackage) {
    console.log(`📦 SINGLE PACKAGE VALIDATION: ${singlePackage}`);
    console.log(`Generated: ${new Date().toISOString()}`);
    console.log('='.repeat(60));
    console.log();
  } else if (isDryRun) {
    console.log(`🌵 DRY RUN - PACKAGE VALIDATION PREVIEW`);
    console.log(`Generated: ${new Date().toISOString()}`);
    console.log(`Total Components: ${apps.length}`);
    console.log('='.repeat(60));
    console.log();
  } else {
    console.log(`📊 PIPEDREAM PACKAGE VALIDATION REPORT`);
    console.log(`Generated: ${new Date().toISOString()}`);
    console.log(`Total Components: ${apps.length}`);
    console.log('='.repeat(60));
    console.log();
  }

  for (const app of apps) {
    const packagePath = path.join(componentsDir, app, 'package.json');
    let packageJson = null;
    let packageName = app;
    
    try {
      // Parse package.json
      const packageJsonContent = fs.readFileSync(packagePath, 'utf8');
      packageJson = JSON.parse(packageJsonContent);
      packageName = packageJson.name || `${app} (no name)`;
      
      // Only validate @pipedream/* packages with publishConfig
      if (!packageName || !packageName.startsWith('@pipedream/')) {
        results.skipped.push({ 
          app, 
          packageName, 
          reason: 'Not a @pipedream package',
          category: 'scope'
        });
        continue;
      }
      
      if (!packageJson.publishConfig?.access) {
        results.skipped.push({ 
          app, 
          packageName, 
          reason: 'No publishConfig.access',
          category: 'config'
        });
        continue;
      }

      // In dry-run mode, just report what would be validated
      if (isDryRun) {
        console.log(`Would validate: ${packageName}`);
        continue;
      }

      if (isVerbose || singlePackage) {
        console.log(`📦 Validating ${packageName}...`);
      }
      
      // Run all validations
      const validationResults = {
        packageJson: null,
        mainFile: null,
        dependencies: null,
        relativeImports: null,
        packageDependencies: null,
        import: null
      };
      
      try {
        validatePackageJson(packageJson, app);
        validationResults.packageJson = 'passed';
      } catch (error) {
        validationResults.packageJson = error.message;
      }
      
      try {
        validateMainFile(packageJson, app);
        validationResults.mainFile = 'passed';
      } catch (error) {
        validationResults.mainFile = error.message;
      }
      
      try {
        validateDependencies(packageJson, app);
        validationResults.dependencies = 'passed';
      } catch (error) {
        validationResults.dependencies = error.message;
      }
      
      try {
        validateRelativeImports(packageJson, app);
        validationResults.relativeImports = 'passed';
      } catch (error) {
        validationResults.relativeImports = error.message;
      }
      
      try {
        validatePackageDependencies(packageJson, app);
        validationResults.packageDependencies = 'passed';
      } catch (error) {
        validationResults.packageDependencies = error.message;
      }
      
      try {
        validateImport(packageName, app, packageJson);
        validationResults.import = 'passed';
      } catch (error) {
        validationResults.import = error.message;
      }
      
      // Check if any validation failed
      const failures = Object.entries(validationResults)
        .filter(([key, value]) => value !== 'passed')
        .map(([key, value]) => ({ check: key, error: value }));

      // Split failures into active (counted) and suppressed (known issues)
      const ignoreConfig = IGNORED_VALIDATIONS[app];
      const isCheckIgnored = (check) => ignoreConfig === true
        || (Array.isArray(ignoreConfig) && ignoreConfig.includes(check));
      const activeFailures = failures.filter(f => !isCheckIgnored(f.check));
      const suppressedFailures = failures.filter(f => isCheckIgnored(f.check));

      if (activeFailures.length > 0) {
        results.failed.push({
          app,
          packageName,
          failures: activeFailures,
          validationResults
        });
        console.log(`❌ ${packageName} - FAILED (${activeFailures.length} issues)`);
        if (isVerbose || singlePackage) {
          activeFailures.forEach(failure => {
            console.log(`   - ${failure.check}: ${failure.error}`);
          });
        }
      } else if (suppressedFailures.length > 0) {
        results.ignored.push({
          app,
          packageName,
          failures: suppressedFailures,
          validationResults
        });
        console.log(`⚠️  ${packageName} - IGNORED (${suppressedFailures.length} known issue(s) suppressed)`);
        if (isVerbose || singlePackage) {
          suppressedFailures.forEach(failure => {
            console.log(`   - ${failure.check}: ${failure.error}`);
          });
        }
      } else {
        results.validated.push({ app, packageName, validationResults });
        if (isVerbose || singlePackage) {
          console.log(`✅ ${packageName} - VALID`);
          if (singlePackage) {
            console.log(`   ✓ Package.json validation: passed`);
            console.log(`   ✓ Main file validation: passed`);
            console.log(`   ✓ Dependencies validation: passed`);
            console.log(`   ✓ Relative imports validation: passed`);
            console.log(`   ✓ Package dependencies validation: passed`);
            console.log(`   ✓ Import validation: passed`);
          }
        }
      }
      
    } catch (error) {
      const bucket = IGNORED_VALIDATIONS[app] === true ? results.ignored : results.failed;
      bucket.push({
        app,
        packageName,
        error: error.message,
        failures: [{ check: 'general', error: error.message }]
      });
      if (bucket === results.ignored) {
        console.log(`⚠️  ${app} (${packageName}) - IGNORED: ${error.message}`);
      } else {
        console.log(`❌ ${app} (${packageName}) - FAILED: ${error.message}`);
      }
    }
  }
  
  // Handle dry-run mode - early exit
  if (isDryRun) {
    console.log(`\n🌵 DRY RUN COMPLETED`);
    console.log(`Found ${apps.length} packages that would be validated`);
    const publishableCount = apps.filter(app => {
      try {
        const packagePath = path.join('components', app, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        return packageJson.name?.startsWith('@pipedream/') && packageJson.publishConfig?.access;
      } catch {
        return false;
      }
    }).length;
    console.log(`${publishableCount} packages are configured for publishing`);
    return { summary: { total: apps.length, publishable: publishableCount } };
  }
  
  // Generate summary
  results.summary = {
    total: apps.length,
    validated: results.validated.length,
    failed: results.failed.length,
    ignored: results.ignored.length,
    skipped: results.skipped.length,
    publishable: results.validated.length + results.failed.length + results.ignored.length,
    failureRate: results.validated.length + results.failed.length > 0
      ? ((results.failed.length / (results.validated.length + results.failed.length)) * 100).toFixed(2)
      : '0.00'
  };
  
  // Print detailed summary
  printDetailedSummary(results);
  
  // Save report to file if requested
  if (outputFile) {
    saveReportToFile(results, outputFile);
  }
  
  // Exit with error if any validations failed (unless report-only mode)
  if (results.failed.length > 0 && !isReportOnly) {
    process.exit(1);
  }
  
  return results;
}

function validatePackageJson(packageJson, app) {
  const required = ['name', 'version', 'main'];
  
  for (const field of required) {
    if (!packageJson[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  if (!/^\d+\.\d+\.\d+/.test(packageJson.version)) {
    throw new Error(`Invalid version format: ${packageJson.version}`);
  }
  
  if (!packageJson.publishConfig?.access) {
    throw new Error('Missing publishConfig.access for public package');
  }
}

function validateMainFile(packageJson, app) {
  const mainFile = path.join('components', app, packageJson.main);
  
  if (!fs.existsSync(mainFile)) {
    throw new Error(`Main file not found: ${packageJson.main}`);
  }
  
  const content = fs.readFileSync(mainFile, 'utf8');
  if (!content.includes('export') && !content.includes('module.exports')) {
    throw new Error(`Main file ${packageJson.main} has no exports`);
  }
}

function validateDependencies(packageJson, app) {
  if (!packageJson.dependencies) return;
  
  const platformDep = packageJson.dependencies['@pipedream/platform'];
  if (platformDep && !platformDep.match(/^[\^~]?\d+\.\d+\.\d+/)) {
    throw new Error(`Invalid @pipedream/platform version: ${platformDep}`);
  }
}

function validateRelativeImports(packageJson, app) {
  const mainFile = path.join('components', app, packageJson.main);
  
  if (!fs.existsSync(mainFile)) {
    return; // Will be caught by other validations
  }
  
  const content = fs.readFileSync(mainFile, 'utf8');
  
  // Find all relative imports to other app files or components
  const relativeImportRegex = /import\s+.*\s+from\s+["']((?:\.\.\/)+([^"'/]+)\/[^"']*\.(?:app\.)?mjs)["']/g;
  const relativeImports = [];
  let match;

  while ((match = relativeImportRegex.exec(content)) !== null) {
    const relativePath = match[1];
    const firstFolderName = match[2]; // Captured group for the first folder name

    // Skip if the first folder name is one of the standard app folders
    if (['app', 'actions', 'sources', 'common'].includes(firstFolderName)) {
      break;
    }

    let suggestion = '';

    // Check if it's an app import
    if (relativePath.includes('.app.mjs') || relativePath.includes('.app.ts')) {
      const pathParts = relativePath.split('/');
      if (pathParts.length >= 2) {
        const importedApp = pathParts[1];
        suggestion = ` Consider using '@pipedream/${importedApp}' instead.`;
      }
    }
    
    relativeImports.push({
      relativePath,
      fullMatch: match[0],
      suggestion
    });
  }
  
  if (relativeImports.length > 0) {
    const importList = relativeImports
      .map(imp => `${imp.fullMatch}${imp.suggestion}`)
      .join(', ');
    throw new Error(`Relative imports to app files should be avoided. Found: ${importList}`);
  }
}

function validatePackageDependencies(packageJson, app) {
  const mainFile = path.join('components', app, packageJson.main);
  
  if (!fs.existsSync(mainFile)) {
    return; // Will be caught by other validations
  }
  
  const content = fs.readFileSync(mainFile, 'utf8');
  
  // Find all npm package imports (not relative paths)
  const packageImportRegex = /import\s+.*\s+from\s+["']([^./][^"']*)["']/g;
  const packageImports = [];
  let match;
  
  while ((match = packageImportRegex.exec(content)) !== null) {
    const packageName = match[1];
    // Extract the base package name (handle scoped packages and subpaths)
    let basePackageName;
    if (packageName.startsWith('@')) {
      // Scoped package like @pipedream/platform or @aws-sdk/client-s3
      const parts = packageName.split('/');
      basePackageName = `${parts[0]}/${parts[1]}`;
    } else {
      // Regular package like axios or lodash (could have subpath like lodash/get)
      basePackageName = packageName.split('/')[0];
    }
    
    packageImports.push({
      packageName: basePackageName,
      fullMatch: match[0],
      originalImport: packageName
    });
  }
  
  if (packageImports.length === 0) {
    return; // No npm package imports found
  }
  
  // Check if the packages are in dependencies or devDependencies
  const missingDependencies = [];
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};
  const allDependencies = { ...dependencies, ...devDependencies };
  
  // Remove duplicates
  const uniquePackages = [...new Set(packageImports.map(imp => imp.packageName))];
  
  uniquePackages.forEach((packageName) => {
    // Skip native Node.js modules
    const normalizedName = packageName.startsWith('node:')
      ? packageName.slice(5)
      : packageName;
    if (NATIVE_MODULES.has(normalizedName)) {
      return;
    }
    
    if (!allDependencies[packageName]) {
      const exampleImport = packageImports.find(imp => imp.packageName === packageName);
      missingDependencies.push({
        packageName,
        importStatement: exampleImport.fullMatch
      });
    }
  });
  
  if (missingDependencies.length > 0) {
    const missingList = missingDependencies
      .map(dep => `${dep.packageName} (for ${dep.importStatement})`)
      .join(', ');
    throw new Error(`Package imports require corresponding dependencies. Missing dependencies: ${missingList}`);
  }
}

function validateImport(packageName, app, packageJson) {
  const mainFile = path.resolve('components', app, packageJson.main);
  
  if (!fs.existsSync(mainFile)) {
    throw new Error(`Main file not found: ${packageJson.main}`);
  }
  
  // Syntax check
  try {
    execSync(`node --check ${mainFile}`, { 
      stdio: 'pipe',
      timeout: 5000 
    });
  } catch (error) {
    throw new Error(`Syntax error in main file: ${error.message}`);
  }
  
  // Import test using file path
  const testFile = path.join('components', app, '__import_test__.mjs');
  const testContent = `
try {
  const pkg = await import("file://${mainFile}");
  
  if (!pkg.default) {
    throw new Error("No default export found");
  }
  
  const component = pkg.default;
  if (typeof component !== 'object') {
    throw new Error("Default export is not an object");
  }
  
  console.log("✓ Import successful for ${packageName}");
  process.exit(0);
  
} catch (error) {
  console.error("Import failed for ${packageName}:", error.message);
  process.exit(1);
}`;
  
  try {
    fs.writeFileSync(testFile, testContent);
    execSync(`node ${testFile}`, { 
      stdio: 'pipe',
      cwd: process.cwd(),
      timeout: 10000
    });
  } catch (error) {
    throw new Error(`Import test failed: ${error.message}`);
  } finally {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  }
}

function printDetailedSummary(results) {
  console.log('\n📊 DETAILED VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`📦 Total Components: ${results.summary.total}`);
  console.log(`✅ Validated Successfully: ${results.summary.validated}`);
  console.log(`❌ Failed Validation: ${results.summary.failed}`);
  console.log(`⚠️  Ignored (known issues): ${results.summary.ignored}`);
  console.log(`⏭️ Skipped: ${results.summary.skipped}`);
  console.log(`📈 Publishable Packages: ${results.summary.publishable}`);
  console.log(`📉 Failure Rate: ${results.summary.failureRate}%`);
  
  if (results.failed.length > 0) {
    console.log('\n❌ FAILED PACKAGES BY CATEGORY:');
    
    const failuresByCategory = {};
    results.failed.forEach(({ packageName, failures }) => {
      failures.forEach(failure => {
        if (!failuresByCategory[failure.check]) {
          failuresByCategory[failure.check] = [];
        }
        failuresByCategory[failure.check].push({ packageName, error: failure.error });
      });
    });
    
    Object.entries(failuresByCategory).forEach(([category, failures]) => {
      console.log(`\n🔍 ${category.toUpperCase()} FAILURES (${failures.length}):`);
      failures.slice(0, 5).forEach(({ packageName, error }) => {
        console.log(`  • ${packageName}: ${error}`);
      });
      if (failures.length > 5) {
        console.log(`  ... and ${failures.length - 5} more`);
      }
    });
  }
  
  if (results.ignored.length > 0) {
    console.log('\n⚠️  IGNORED PACKAGES (known issues, not counted as failures):');
    results.ignored.forEach(({ packageName, failures }) => {
      const checks = failures.map(f => f.check).join(', ');
      console.log(`  • ${packageName}: ${checks}`);
    });
  }

  if (results.skipped.length > 0) {
    console.log('\n⏭️ SKIPPED PACKAGES BY REASON:');
    const skippedByReason = {};
    results.skipped.forEach(({ reason, packageName }) => {
      if (!skippedByReason[reason]) {
        skippedByReason[reason] = [];
      }
      skippedByReason[reason].push(packageName);
    });
    
    Object.entries(skippedByReason).forEach(([reason, packages]) => {
      console.log(`  • ${reason}: ${packages.length} packages`);
    });
  }
  
  console.log('\n🎯 RECOMMENDATIONS:');
  if (results.failed.length > 0) {
    console.log('  1. Review failed packages and fix import/dependency issues');
    console.log('  2. Ensure all main files have proper exports');
    console.log('  3. Validate package.json configurations');
  } else {
    console.log('  🎉 All packages are valid! Ready for publishing.');
  }
}

function saveReportToFile(results, filename) {
  const report = {
    generatedAt: new Date().toISOString(),
    summary: results.summary,
    validated: results.validated.map(r => ({ app: r.app, packageName: r.packageName })),
    failed: results.failed.map(r => ({
      app: r.app,
      packageName: r.packageName,
      failures: r.failures
    })),
    ignored: results.ignored.map(r => ({
      app: r.app,
      packageName: r.packageName,
      failures: r.failures
    })),
    skipped: results.skipped
  };
  
  fs.writeFileSync(filename, JSON.stringify(report, null, 2));
  console.log(`\n📄 Report saved to: ${filename}`);
}

// Run the report generation
if (require.main === module) {
  generatePackageReport();
}

module.exports = { generatePackageReport };