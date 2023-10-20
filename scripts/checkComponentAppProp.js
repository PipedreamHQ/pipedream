const path = require("path");
const {
  rootDir,
  iterateComponentFiles,
} = require("./findBadKeys.js");

function checkComponentHasAppProp(component, appNameSlug) {
  const matching = Object.values(component.props)
    .filter((prop) => prop.type === "app" && prop.app === appNameSlug);

  if (!matching.length) {
    console.error(`[!] ${component.key} - missing app prop for ${appNameSlug}`);
    err = true;
  }
}

async function main() {
  const iterator = iterateComponentFiles();
  for (const file of iterator) {
    const p = path.join(rootDir, file);
    const appNameSlug = file.split("/")[1];
    const { default: component } = await import(p)
    checkComponentHasAppProp(component, appNameSlug);
  }

  if (err) {
    const core = require('@actions/core');
    core.setFailed("There are errors in some components. See the messages above.");
  }
}

let err;
main();
