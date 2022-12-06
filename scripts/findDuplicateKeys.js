const path = require('path');
const fs = require('fs');
const { readdir } = fs.promises;

const rootDir = path.resolve(__dirname, "..");
const componentsDir = path.join(rootDir, "components");

const excludeDirs = ['node_modules', '.git', 'dist'];
const includedExtensions = ['.mjs', '.js', '.mts', '.ts'];
const excludedExtensions = [...includedExtensions.map((ext) => `.app${ext}`)];

function included(dirent) {
  if (dirent.isDirectory()) {
    return !excludeDirs.includes(dirent.name);
  }
  return includedExtensions.includes(path.extname(dirent.name)) &&
    !excludedExtensions.find((ext) => dirent.name.endsWith(ext));
}

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    if (!included(dirent)) {
      continue;
    }
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

async function getDuplicateKeys(dir) {
  const filepathsByKey = {};
  const duplicateKeys = new Set();
  for await (const f of getFiles(dir)) {
    const data = fs.readFileSync(f, "utf8");
    const md = data.match(/['"]?key['"]?: ['"]([^'"]+)/);
    if (!md) continue;
    const key = md[1];
    if (filepathsByKey[key]) {
      duplicateKeys.add(key);
    } else {
      filepathsByKey[key] = [];
    }
    filepathsByKey[key].push(f);
  }
  return { duplicateKeys, filepathsByKey };
}

async function main() {
  const { duplicateKeys, filepathsByKey } = await getDuplicateKeys(componentsDir);
  if (duplicateKeys.size) {
    duplicateKeys.forEach((key) => {
      console.error(`[!] found duplicate component key '${key}' in files: ${filepathsByKey[key].join(', ')}`);
    })
    throw new Error("Found duplicate component keys");
  }
}

main().catch((err) => {
  const core = require('@actions/core');
  core.setFailed(err);
});
