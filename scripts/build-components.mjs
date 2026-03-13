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

// Find .ts files in a directory using native recursive readdir
// Requires Node 20.12.0+ for Dirent.parentPath property
function findTsFilesInDir(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter(e => e.isFile() && e.name.endsWith('.ts') && !e.name.endsWith('.d.ts'))
    .map(e => join(e.parentPath, e.name))
}

// Find .ts files in component's standard subdirectories
function findTsFiles(componentDir) {
  return COMPONENT_TS_DIRS.flatMap(subdir => findTsFilesInDir(join(componentDir, subdir)))
}

// Find all component directories that have TypeScript files
function findTypeScriptComponents() {
  return readdirSync(componentsDir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => join(componentsDir, e.name))
    .filter(path => findTsFiles(path).length > 0)
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
  try {
    await esbuild.build({
      entryPoints,
      outdir: distDir,
      format: 'esm',
      platform: 'node',
      target: 'node20',
      // bundles single file components, with imported app file + shared code
      bundle: true,
      outExtension: { '.js': '.mjs' },
      // don't bundle any node_modules since EE will handle it for us
      packages: 'external',
    })
  } catch (err) {
    const componentName = relative(componentsDir, componentDir)
    throw new Error(`Failed to build component "${componentName}": ${err.message}`)
  }

  for (const sourcePath of entryPoints) {
    outputFiles.push(sourceToOutputPath(sourcePath, componentDir))
  }
}

// Output all built file paths (one per line, absolute paths)
// so GitHub Actions workflows can `pd publish` those components
for (const outputFile of outputFiles) {
  console.log(outputFile)
}
