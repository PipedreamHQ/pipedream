const path = require("path");
const {
  rootDir,
  iterateComponentFiles,
} = require("./findBadKeys.js");

// Output directory for compiled TypeScript components
const DIST_DIR = "dist";

function checkComponentHasAppProp(component, appNameSlug) {
  const matching = Object.values(component.props)
    .filter((prop) => prop.type === "app" && prop.app === appNameSlug);

  if (!matching.length) {
    console.error(`[!] ${component.key} - missing app prop for ${appNameSlug}`);
    err = true;
  }
}

function getComponentPath(filePath) {
  const appNameSlug = filePath.split("/")[1];
  const isTypeScript = filePath.endsWith(".ts");

  const componentPath = isTypeScript
    ? filePath
      .replace(appNameSlug, path.join(appNameSlug, DIST_DIR))
      .replace(/\.ts$/, ".mjs")
    : filePath;

  return path.join(rootDir, componentPath);
}

async function main() {
  const iterator = iterateComponentFiles();
  for (const file of iterator) {
    const appNameSlug = file.split("/")[1];
    const componentPath = getComponentPath(file);
    const { default: component } = await import(componentPath);
    checkComponentHasAppProp(component, appNameSlug);
  }

  if (err) {
    const core = require('@actions/core');
    core.setFailed("There are errors in some components. See the messages above.");
  }
}

let err;
main();
