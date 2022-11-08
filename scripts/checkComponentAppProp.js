const {
  isAppFile,
  isSourceFile,
  isCommonFile,
} = require("./findBadKeys.js");

function checkComponentKey(component, nameslug) {
  const key = component.key;

  const props = Object.values(component.props)
    .filter((prop) => prop.type === "app");

  if (props.length === 0) {
    console.error(`[!] ${key} - missing app prop`);
    err = true;
  } else if (props.length > 1) {
    console.error(`[!] ${key} - cannot import more than one app prop`);
    err = true;
  } else {
    const appProp = props.reduce((prop) => prop);
    const appName = appProp.app;

    if (appName !== nameslug) {
      console.error(`[!] ${key} - importing wrong app: ${appName}`);
      err = true;
    }
  }
}

async function main() {
  const path = require("path");
  const rootDir = path.resolve(__dirname, "..");

  const changedFiles = [];
  if (process.argv[2])
    changedFiles.push(...process.argv[2].split(","));
  if (process.argv[3])
    changedFiles.push(...process.argv[3].split(","));

  for (const file of changedFiles) {
    const p = path.join(rootDir, file);
    if (!file.startsWith("components/"))
      continue;
    if (isAppFile(p) || isCommonFile(p) || !isSourceFile(p))
      continue;
    const nameslug = file.split("/")[1];
    const { default: component } = await import(p)
    checkComponentKey(component, nameslug);
  }

  if (err) {
    const core = require('@actions/core');
    core.setFailed("There are errors in some components. See the messages above.");
  }
}

let err;
main();
