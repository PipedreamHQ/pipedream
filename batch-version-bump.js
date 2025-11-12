const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const COMPONENTS_DIR = path.join(__dirname, "components");
const FILES_PER_BATCH = 120;

// Helper function to bump patch version
function bumpPatchVersion(version) {
  const parts = version.split(".");
  if (parts.length !== 3) {
    throw new Error(`Invalid version format: ${version}`);
  }
  parts[2] = String(parseInt(parts[2]) + 1);
  return parts.join(".");
}

// Get all apps with @pipedream/platform dependency
function getAppsWithPlatformDependency() {
  const apps = [];
  const componentDirs = fs.readdirSync(COMPONENTS_DIR, {
    withFileTypes: true,
  });

  for (const dir of componentDirs) {
    if (!dir.isDirectory()) continue;

    const appPath = path.join(COMPONENTS_DIR, dir.name);
    const packageJsonPath = path.join(appPath, "package.json");

    if (!fs.existsSync(packageJsonPath)) continue;

    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

      // Check if @pipedream/platform is in dependencies
      if (packageJson.dependencies && packageJson.dependencies["@pipedream/platform"]) {
        apps.push({
          name: dir.name,
          path: appPath,
          packageJsonPath: packageJsonPath,
          currentVersion: packageJson.version,
        });
      }
    } catch (err) {
      console.error(`Error reading ${packageJsonPath}:`, err.message);
    }
  }

  // Sort alphabetically by app name
  return apps.sort((a, b) => a.name.localeCompare(b.name));
}

// Find all component files (.mjs) in actions and sources directories
function getComponentFiles(appPath) {
  const files = [];

  const actionsDir = path.join(appPath, "actions");
  const sourcesDir = path.join(appPath, "sources");

  // Helper to recursively find .mjs files
  function findMjsFiles(dir) {
    if (!fs.existsSync(dir)) return [];

    const found = [];
    const entries = fs.readdirSync(dir, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        found.push(...findMjsFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith(".mjs")) {
        found.push(fullPath);
      }
    }
    return found;
  }

  if (fs.existsSync(actionsDir)) {
    files.push(...findMjsFiles(actionsDir));
  }

  if (fs.existsSync(sourcesDir)) {
    files.push(...findMjsFiles(sourcesDir));
  }

  return files;
}

// Bump version in package.json
function bumpPackageVersion(packageJsonPath) {
  const content = fs.readFileSync(packageJsonPath, "utf8");
  const packageJson = JSON.parse(content);

  const oldVersion = packageJson.version;
  const newVersion = bumpPatchVersion(oldVersion);
  packageJson.version = newVersion;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf8");

  return {
    oldVersion,
    newVersion,
  };
}

// Bump version in component file (.mjs)
function bumpComponentVersion(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  // Look for version: "x.y.z" pattern
  const versionRegex = /version:\s*["'](\d+\.\d+\.\d+)["']/;
  const match = content.match(versionRegex);

  if (!match) {
    return null; // No version found
  }

  const oldVersion = match[1];
  const newVersion = bumpPatchVersion(oldVersion);

  const newContent = content.replace(
    versionRegex,
    `version: "${newVersion}"`,
  );

  fs.writeFileSync(filePath, newContent, "utf8");

  return {
    oldVersion,
    newVersion,
  };
}

// Process a single app
function processApp(app) {
  const modifiedFiles = [];

  console.log(`\nProcessing: ${app.name}`);

  // Bump package.json version
  const pkgResult = bumpPackageVersion(app.packageJsonPath);
  console.log(`  package.json: ${pkgResult.oldVersion} → ${pkgResult.newVersion}`);
  modifiedFiles.push(app.packageJsonPath);

  // Find and bump component files
  const componentFiles = getComponentFiles(app.path);

  for (const filePath of componentFiles) {
    const result = bumpComponentVersion(filePath);
    if (result) {
      console.log(`  ${path.relative(app.path, filePath)}: ${result.oldVersion} → ${result.newVersion}`);
      modifiedFiles.push(filePath);
    }
  }

  console.log(`  Total files modified: ${modifiedFiles.length}`);

  return modifiedFiles;
}

// Create a batch
function createBatch(batchNumber, apps, startIndex) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`BATCH ${batchNumber}`);
  console.log(`${"=".repeat(60)}`);

  const branchName = `package-updates-batch-${batchNumber}`;

  // Create and checkout new branch
  console.log(`\nCreating branch: ${branchName}`);
  try {
    execSync(`git checkout -b ${branchName}`, {
      stdio: "inherit",
    });
  } catch (err) {
    console.error("Error creating branch:", err.message);
    return {
      endIndex: startIndex,
      filesModified: 0,
    };
  }

  let totalFilesModified = 0;
  let currentIndex = startIndex;
  const appsInBatch = [];

  // Process apps until we hit the file limit
  while (currentIndex < apps.length && totalFilesModified < FILES_PER_BATCH) {
    const app = apps[currentIndex];
    const modifiedFiles = processApp(app);

    totalFilesModified += modifiedFiles.length;
    appsInBatch.push(app.name);
    currentIndex++;

    if (totalFilesModified >= FILES_PER_BATCH) {
      console.log(`\nReached ${totalFilesModified} files, stopping batch.`);
      break;
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Batch ${batchNumber} Summary:`);
  console.log(`  Apps processed: ${appsInBatch.length}`);
  console.log(`  Files modified: ${totalFilesModified}`);
  console.log(`  Apps: ${appsInBatch.join(", ")}`);
  console.log(`${"=".repeat(60)}`);

  // Commit changes
  console.log("\nCommitting changes...");
  try {
    execSync("git add .", {
      stdio: "inherit",
    });
    execSync(`git commit -m "Bump patch versions for batch ${batchNumber} apps"`, {
      stdio: "inherit",
    });
    console.log("Committed successfully!");
  } catch (err) {
    console.error("Error committing:", err.message);
  }

  // Push to remote
  console.log("\nPushing to remote...");
  try {
    execSync(`git push -u origin ${branchName}`, {
      stdio: "inherit",
    });
    console.log("Pushed successfully!");
  } catch (err) {
    console.error("Error pushing:", err.message);
  }

  // Return to master
  console.log("\nReturning to master branch...");
  try {
    execSync("git checkout master", {
      stdio: "inherit",
    });
  } catch (err) {
    console.error("Error returning to master:", err.message);
  }

  return {
    endIndex: currentIndex,
    filesModified: totalFilesModified,
    appsProcessed: appsInBatch.length,
  };
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const numBatches = parseInt(args[0]) || 1;

  console.log("Finding all apps with @pipedream/platform dependency...");
  const apps = getAppsWithPlatformDependency();
  console.log(`Found ${apps.length} apps`);

  let currentIndex = 0;

  for (let i = 1; i <= numBatches && currentIndex < apps.length; i++) {
    const result = createBatch(i, apps, currentIndex);
    currentIndex = result.endIndex;

    if (currentIndex >= apps.length) {
      console.log("\nAll apps have been processed!");
      break;
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("COMPLETE");
  console.log(`${"=".repeat(60)}`);
  console.log(`Processed ${currentIndex} of ${apps.length} apps`);
  console.log(`Remaining apps: ${apps.length - currentIndex}`);
}

main();
