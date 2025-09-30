#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script to apply MCP annotations to Pipedream action files from CSV data
 *
 * Usage:
 *   node apply-annotations.js --csv annotations.csv [--verbose] [--limit N] [--offset N]
 */

class AnnotationApplier {
  constructor(options = {}) {
    this.csvFile = options.csvFile;
    this.verbose = options.verbose || false;
    this.limit = options.limit || null;
    this.offset = options.offset || 0;
    this.batchSize = 100;

    this.stats = this.initializeStats();
    this.errors = [];
    this.annotations = new Map();
  }

  initializeStats() {
    return {
      totalFiles: 0,
      processed: 0,
      modified: 0,
      errors: 0,
      skipped: 0
    };
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} ${message}`;

    switch (level) {
      case 'error':
        console.error(`${logMessage.replace(message, `ERROR: ${message}`)}`);
        break;
      case 'warn':
        console.warn(`${logMessage.replace(message, `WARN: ${message}`)}`);
        break;
      default:
        if (this.verbose || level === 'info') {
          console.log(logMessage);
        }
    }
  }

  parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    values.push(current.trim());
    return values;
  }

  parseBoolean(value) {
    const normalizedValue = value?.toLowerCase();
    if (normalizedValue === 'true') return true;
    if (normalizedValue === 'false') return false;
    throw new Error(`Invalid boolean value: ${value}`);
  }

  validateCSVHeaders(headers) {
    const headerMap = {
      'KEY': 'key',
      'key': 'key',
      'component_key': 'key',
      'destructiveHint': 'destructiveHint',
      'openWorldHint': 'openWorldHint',
      'readOnlyHint': 'readOnlyHint'
    };

    const columnIndices = {};
    headers.forEach((header, index) => {
      const mappedHeader = headerMap[header];
      if (mappedHeader) {
        columnIndices[mappedHeader] = index;
      }
    });

    const requiredHeaders = ['key', 'destructiveHint', 'openWorldHint', 'readOnlyHint'];
    const missingHeaders = requiredHeaders.filter(header => columnIndices[header] === undefined);

    if (missingHeaders.length > 0) {
      throw new Error(`Missing required CSV columns: ${missingHeaders.join(', ')} (available: ${headers.join(', ')})`);
    }

    return columnIndices;
  }

  sliceCSVData(allLines) {
    const dataLines = allLines.slice(1); // Remove header
    const startIndex = this.offset;
    const endIndex = this.limit ? Math.min(startIndex + this.limit, dataLines.length) : dataLines.length;

    this.log(`Processing CSV entries ${startIndex + 1} to ${endIndex} (${endIndex - startIndex} entries)`);

    return [allLines[0], ...dataLines.slice(startIndex, endIndex)]; // Add header back
  }

  async loadCsv() {
    this.log(`Loading CSV file: ${this.csvFile}`);

    if (!fs.existsSync(this.csvFile)) {
      throw new Error(`CSV file not found: ${this.csvFile}`);
    }

    const csvContent = fs.readFileSync(this.csvFile, 'utf8');
    const allLines = csvContent.trim().split('\n');
    const headers = this.parseCSVLine(allLines[0]);
    const lines = this.sliceCSVData(allLines);
    const columnIndices = this.validateCSVHeaders(headers);

    let loadedCount = 0;

    // Process data rows (skip header)
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const key = values[columnIndices.key];

      if (!key) {
        this.log(`Skipping row ${i + 1}: missing key`, 'warn');
        continue;
      }

      try {
        const annotations = {
          destructiveHint: this.parseBoolean(values[columnIndices.destructiveHint]),
          openWorldHint: this.parseBoolean(values[columnIndices.openWorldHint]),
          readOnlyHint: this.parseBoolean(values[columnIndices.readOnlyHint])
        };

        this.annotations.set(key, annotations);
        loadedCount++;
      } catch (error) {
        this.log(`Invalid annotation values for ${key}: ${error.message}`, 'warn');
      }
    }

    this.log(`Loaded ${loadedCount} annotation entries from CSV`);
    return loadedCount;
  }

  async findActionFiles() {
    this.log('Finding action files...');
    const componentsDir = path.join(__dirname, '../../components');
    const actionFiles = [];

    const walkDir = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (this.isActionFile(entry.name, fullPath)) {
          actionFiles.push(fullPath);
        }
      }
    };

    walkDir(componentsDir);
    this.stats.totalFiles = actionFiles.length;
    this.log(`Found ${actionFiles.length} action files`);
    return actionFiles;
  }

  isActionFile(fileName, fullPath) {
    return (fileName.endsWith('.mjs') || fileName.endsWith('.ts')) &&
           fullPath.includes('/actions/') &&
           !fullPath.includes('/common/');
  }

  extractActionKey(fileContent) {
    const keyMatch = fileContent.match(/key:\s*["']([^"']+)["']/);
    return keyMatch ? keyMatch[1] : null;
  }

  hasAnnotations(fileContent) {
    return /annotations:\s*\{/.test(fileContent);
  }

  incrementVersion(version) {
    const versionParts = version.split('.');
    if (versionParts.length !== 3) {
      throw new Error(`Invalid version format: ${version}`);
    }

    const patch = parseInt(versionParts[2], 10) + 1;
    return `${versionParts[0]}.${versionParts[1]}.${patch}`;
  }

  generateAnnotationsBlock(annotations, indent) {
    return [
      `${indent}annotations: {`,
      `${indent}  destructiveHint: ${annotations.destructiveHint},`,
      `${indent}  openWorldHint: ${annotations.openWorldHint},`,
      `${indent}  readOnlyHint: ${annotations.readOnlyHint},`,
      `${indent}},`
    ].join('\n') + '\n';
  }

  applyAnnotations(fileContent, annotations) {
    // Find and replace version
    const versionMatch = fileContent.match(/(.*version:\s*["'])([^"']+)(["'],?\s*\n)/s);
    if (!versionMatch) {
      throw new Error('Could not find version field in file');
    }

    const [fullMatch, beforeVersionValue, currentVersion, afterVersionValue] = versionMatch;
    const newVersion = this.incrementVersion(currentVersion);

    // Reconstruct content with new version
    const beforeVersion = fileContent.substring(0, versionMatch.index) +
                         beforeVersionValue + newVersion + afterVersionValue;
    const afterVersion = fileContent.substring(versionMatch.index + fullMatch.length);

    // Detect indentation
    const versionLine = fullMatch.split('\n').slice(-2)[0];
    const indentMatch = versionLine.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1] : '  ';

    // Insert annotations
    const annotationsBlock = this.generateAnnotationsBlock(annotations, indent);
    return beforeVersion + annotationsBlock + afterVersion;
  }

  async processFile(filePath) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const actionKey = this.extractActionKey(fileContent);

      if (!actionKey) {
        this.recordSkip(`could not extract action key from ${filePath}`);
        return false;
      }

      const annotations = this.annotations.get(actionKey);
      if (!annotations) {
        this.recordSkip(`no annotations in CSV for ${actionKey}`, 'debug');
        return false;
      }

      if (this.hasAnnotations(fileContent)) {
        this.recordSkip(`annotations already exist for ${actionKey}`, 'debug');
        return false;
      }

      // Apply changes
      const modifiedContent = this.applyAnnotations(fileContent, annotations);
      fs.writeFileSync(filePath, modifiedContent, 'utf8');

      this.recordModification(fileContent, actionKey);
      return true;

    } catch (error) {
      this.recordError(filePath, error);
      return false;
    }
  }

  recordSkip(reason, level = 'warn') {
    this.stats.skipped++;
    this.log(`Skipping: ${reason}`, level);
  }

  recordError(filePath, error) {
    this.stats.errors++;
    this.errors.push(`${filePath}: ${error.message}`);
    this.log(`Error processing ${filePath}: ${error.message}`, 'error');
  }

  recordModification(fileContent, actionKey) {
    this.stats.modified++;

    const currentVersionMatch = fileContent.match(/version:\s*["']([^"']+)["']/);
    const currentVersion = currentVersionMatch ? currentVersionMatch[1] : 'unknown';
    const newVersion = this.incrementVersion(currentVersion);

    this.log(`Modified ${actionKey} (${currentVersion} → ${newVersion})`, 'debug');
  }

  verifyGitStatus() {
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      if (gitStatus.trim()) {
        this.log('Git working directory is not clean - changes will be mixed with existing modifications', 'warn');
      }
    } catch (error) {
      this.log(`Git check failed: ${error.message}`, 'warn');
    }
  }

  async processFilesInBatches(actionFiles) {
    this.log(`Processing ${actionFiles.length} files in batches of ${this.batchSize}`);

    for (let i = 0; i < actionFiles.length; i += this.batchSize) {
      const batch = actionFiles.slice(i, i + this.batchSize);

      for (const filePath of batch) {
        await this.processFile(filePath);
        this.stats.processed++;
      }

      // Progress update
      const progress = ((i + this.batchSize) / actionFiles.length * 100).toFixed(1);
      this.log(`Progress: ${Math.min(i + this.batchSize, actionFiles.length)}/${actionFiles.length} (${progress}%)`);
    }
  }

  printFinalReport(duration) {
    this.log('\n=== FINAL REPORT ===');
    this.log(`Total files found: ${this.stats.totalFiles}`);
    this.log(`Files processed: ${this.stats.processed}`);
    this.log(`Files modified: ${this.stats.modified}`);
    this.log(`Files skipped: ${this.stats.skipped}`);
    this.log(`Errors: ${this.stats.errors}`);
    this.log(`Duration: ${duration}s`);

    if (this.errors.length > 0) {
      this.log('\n=== ERRORS ===');
      this.errors.forEach(error => this.log(error, 'error'));
    }
  }

  async run() {
    const startTime = Date.now();
    this.log('Starting annotation application');

    this.verifyGitStatus();
    await this.loadCsv();

    const actionFiles = await this.findActionFiles();
    await this.processFilesInBatches(actionFiles);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    this.printFinalReport(duration);

    return this.stats;
  }
}

// CLI Interface
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    verbose: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--csv':
        options.csvFile = args[++i];
        break;
      case '--verbose':
        options.verbose = true;
        break;
      case '--limit':
        options.limit = parseInt(args[++i], 10);
        if (isNaN(options.limit) || options.limit <= 0) {
          throw new Error('--limit must be a positive number');
        }
        break;
      case '--offset':
        options.offset = parseInt(args[++i], 10);
        if (isNaN(options.offset) || options.offset < 0) {
          throw new Error('--offset must be a non-negative number');
        }
        break;
      case '--help':
        console.log(`
Usage: node apply-annotations.js --csv <file> [options]

Options:
  --csv <file>      Path to CSV file with annotations
  --verbose         Show detailed logging
  --limit <number>  Process only this many entries from CSV
  --offset <number> Skip this many entries before processing (default: 0)
  --help            Show this help message

Batch Processing Examples:
  # Process first 10 entries
  node apply-annotations.js --csv file.csv --limit 10

  # Process entries 11-110 (next 100)
  node apply-annotations.js --csv file.csv --offset 10 --limit 100

  # Process entries 111-1110 (next 1000)
  node apply-annotations.js --csv file.csv --offset 110 --limit 1000

CSV Format:
  KEY,NAME,DESCRIPTION,destructiveHint,openWorldHint,readOnlyHint
  slack-send-message,Send Message,Description...,FALSE,TRUE,FALSE
        `);
        process.exit(0);
        break;
      default:
        console.error(`Unknown argument: ${arg}`);
        process.exit(1);
    }
  }

  if (!options.csvFile) {
    console.error('Error: --csv argument is required');
    console.error('Use --help for usage information');
    process.exit(1);
  }

  return options;
}

// Main execution
async function main() {
  try {
    const options = parseArgs();
    const applier = new AnnotationApplier(options);
    await applier.run();
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = AnnotationApplier;