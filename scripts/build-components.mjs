#!/usr/bin/env node
/**
 * Build script for TypeScript Pipedream components, using esbuild.
 *
 * Output: Absolute paths to each built .mjs file (one per line).
 * GitHub Actions workflows parse this publish the right files.
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
const COMPONENT_TS_DIRS = ['app', 'actions', 'sources', 'common']

// Recursively find all .ts files in a directory
function findTsFilesRecursive(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) findTsFilesRecursive(path, files)
    else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) files.push(path)
  }
  return files
}

// Find .ts files in component's standard subdirectories
function findTsFiles(baseDir) {
  const files = []
  for (const subdir of COMPONENT_TS_DIRS) {
    const dir = join(baseDir, subdir)
    if (existsSync(dir)) findTsFilesRecursive(dir, files)
  }
  return files
}

// Find all component directories that have TypeScript files
function findTypeScriptComponents() {
  return readdirSync(componentsDir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => join(componentsDir, e.name))
    .filter(path => COMPONENT_TS_DIRS.some(subdir => {
      const dir = join(path, subdir)
      return existsSync(dir) && findTsFilesRecursive(dir).length > 0
    }))
}

// Convert source .ts path to output .mjs path
// e.g., /path/to/components/rss/app/rss.app.ts -> /path/to/components/rss/dist/app/rss.app.mjs
function sourceToOutputPath(sourcePath, componentDir) {
  const relPath = relative(componentDir, sourcePath)
  const mjsRelPath = relPath.replace(/\.ts$/, '.mjs')
  return join(componentDir, 'dist', mjsRelPath)
}

// Collect mjs output file paths
const outputFiles = []

// Build each component
const tsComponents = findTypeScriptComponents()
for (const componentDir of tsComponents) {
  const entryPoints = findTsFiles(componentDir)

  if (entryPoints.length === 0) {
    continue
  }

  // Clean dist dir and build
  const distDir = join(componentDir, 'dist')
  rmSync(distDir, { recursive: true, force: true })
  await esbuild.build({
    entryPoints,
    outdir: distDir,
    format: 'esm',
    platform: 'node',
    target: 'node20',
    bundle: true,
    outExtension: { '.js': '.mjs' },
    // don't bundle any node_modules since EE will handle it for us
    packages: 'external',
  })

  for (const sourcePath of entryPoints) {
    outputFiles.push(sourceToOutputPath(sourcePath, componentDir))
  }
}

// Output all built file paths (one per line, absolute paths)
// so GitHub Actions workflows can `pd publish` those components
for (const outputFile of outputFiles) {
  console.log(outputFile)
}
