const path = require("path");
const {
  rootDir,
  iterateComponentFiles,
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
  const iterator = iterateComponentFiles();
  for (const file of iterator) {
    const p = path.join(rootDir, file);
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
