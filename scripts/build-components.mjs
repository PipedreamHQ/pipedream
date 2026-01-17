#!/usr/bin/env node
/**
 * Build script for all Pipedream TypeScript components.
 * Finds all components with .ts files and builds them with esbuild.
 *
 * Output format: Outputs absolute paths to each built .mjs file (one per line).
 * This format is required by GitHub Actions workflows that parse the output
 * to find files to publish.
 *
 * Usage:
 *   node scripts/build-components.mjs
 */
import * as esbuild from 'esbuild'
import { rmSync, readdirSync, existsSync } from 'fs'
import { join, dirname, relative } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')
const componentsDir = join(rootDir, 'components')

// Find all component directories that have TypeScript files
function findTypeScriptComponents() {
  const components = []
  for (const entry of readdirSync(componentsDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const componentPath = join(componentsDir, entry.name)
      // Check if component has any .ts files in app/, actions/, sources/, or common/
      const hasTsFiles = ['app', 'actions', 'sources', 'common'].some(subdir => {
        const dir = join(componentPath, subdir)
        return existsSync(dir) && hasTsFilesInDir(dir)
      })
      if (hasTsFiles) {
        components.push(componentPath)
      }
    }
  }
  return components
}

// Check if directory contains any .ts files (recursive)
function hasTsFilesInDir(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (hasTsFilesInDir(join(dir, entry.name))) return true
    } else if (entry.name.endsWith('.ts')) {
      return true
    }
  }
  return false
}

// Simple recursive glob for .ts files in specific subdirectories
function findTsFiles(baseDir, subdirs = ['app', 'actions', 'sources', 'common']) {
  const files = []
  for (const subdir of subdirs) {
    const dir = join(baseDir, subdir)
    if (!existsSync(dir)) continue
    findTsFilesRecursive(dir, files)
  }
  return files
}

function findTsFilesRecursive(dir, files) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) findTsFilesRecursive(path, files)
    else if (entry.name.endsWith('.ts')) files.push(path)
  }
}

// Convert source .ts path to output .mjs path
// e.g., /path/to/components/rss/app/rss.app.ts -> /path/to/components/rss/dist/app/rss.app.mjs
function sourceToOutputPath(sourcePath, componentDir) {
  const relPath = relative(componentDir, sourcePath)
  const mjsRelPath = relPath.replace(/\.ts$/, '.mjs')
  return join(componentDir, 'dist', mjsRelPath)
}

// Find all TypeScript components
const tsComponents = findTypeScriptComponents()

// Collect all output file paths
const outputFiles = []

// Build each component
let totalFiles = 0
for (const componentDir of tsComponents) {
  const entryPoints = findTsFiles(componentDir)

  if (entryPoints.length === 0) {
    continue
  }

  const distDir = join(componentDir, 'dist')

  // Clean dist directory
  rmSync(distDir, { recursive: true, force: true })

  // Build with esbuild
  await esbuild.build({
    entryPoints,
    outdir: distDir,
    format: 'esm',
    platform: 'node',
    target: 'node20',
    bundle: true,
    outExtension: { '.js': '.mjs' },
    packages: 'external',
  })

  // Collect output file paths
  for (const sourcePath of entryPoints) {
    outputFiles.push(sourceToOutputPath(sourcePath, componentDir))
  }

  totalFiles += entryPoints.length
}

// Output all built file paths (one per line, absolute paths)
// This is the format expected by GitHub Actions workflows
for (const outputFile of outputFiles) {
  console.log(outputFile)
}
