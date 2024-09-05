// walk through each folder under components
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const componentsDir = path.join(rootDir, "components");

const REGEXP_COMPONENT_KEY = {
  regExp: /(?:(?:['"]key['"])|(?:key)): ['"]([^'"]+)/,
  captureGroup: 1
};

let err = false;

const isAppFile = (subname) =>
  subname.endsWith(".app.mjs") || subname.endsWith(".app.js") || subname.endsWith(".app.mts") || subname.endsWith(".app.ts");

const isSourceFile = (subname) =>
  subname.endsWith(".mjs") || subname.endsWith(".js") || subname.endsWith(".mts") || subname.endsWith(".ts");

const isCommonFile = (subname) => {
  const regex = /\/?common.*(\/|\.js|\.mjs|\.ts|\.mts|)/g;
  return regex.test(subname);
};

const isTestEventFile = (subname) => subname.includes("test-event.mjs");

const getComponentKey = (p) => {
  const data = fs.readFileSync(p, "utf8");
  const md = data.match(REGEXP_COMPONENT_KEY.regExp);
  if (md && md.length > REGEXP_COMPONENT_KEY.captureGroup)
    return md[REGEXP_COMPONENT_KEY.captureGroup];
  return false;
};

function* iterateComponentFiles() {
  let changedFiles = [];
  if (process.argv[2])
    changedFiles = process.argv[2].split(",");
  if (process.argv[3])
    changedFiles = [
      ...changedFiles,
      ...process.argv[3].split(","),
    ];
  for (const file of changedFiles) {
    const p = path.join(rootDir, file);
    if (!file.startsWith("components/"))
      continue;
    if (isAppFile(p) || isCommonFile(p) || !isSourceFile(p) || isTestEventFile(p))
      continue;
    yield file;
  }
}

const checkPathVsKey = () => {
  const iterator = iterateComponentFiles();
  for (const file of iterator) {
    const p = path.join(rootDir, file);
    const componentKey = getComponentKey(p);
    if (!componentKey) {
      err = true;
      console.error(`[!] ${file} has no component key! Either its file name should start with 'common' or it should be in a folder named 'common'! See the docs: https://pipedream.com/docs/components/guidelines/#folder-structure`);
    } else {
      const uriParts = file.split("/");
      if (uriParts.length < 2) {
        err = true;
        console.error(`[!] ${file} components should be in folders named as the same with their file names! See the docs: https://pipedream.com/docs/components/guidelines/#folder-structure`);
      } else {
        const folderName = uriParts[uriParts.length - 2];
        const fileName = uriParts[uriParts.length - 1].split(".")[0];
        const keyName = componentKey.split("-")
          .slice(1)
          .join("-");
        if (folderName != fileName || fileName != keyName) {
          err = true;
          console.error(`[!] ${file} component folder name, component file name without extension and component key without slug should be the same! See the docs: https://pipedream.com/docs/components/guidelines/#folder-structure`);
        }
      }
    }
  }
};

// now walk dirs looking for components and `key: ""`... (find component keys better)
function checkKeys(p, nameSlug) {
  const names = fs.readdirSync(p);
  for (const name of names) {
    const pp = path.join(p, name);
    if (name === "node_modules") {
      continue;
    }
    if (name.endsWith(".mjs") || name.endsWith(".js") || name.endsWith(".ts") || name.endsWith(".mts")) {
      // ignore test-event files
      if (isCommonFile(pp) || isTestEventFile(pp)) {
        continue;
      }
      const data = fs.readFileSync(pp, "utf8");
      const md = data.match(REGEXP_COMPONENT_KEY.regExp);
      if (md) {
        const key = md[REGEXP_COMPONENT_KEY.captureGroup];
        if (!key?.startsWith(`${nameSlug}-`)) {
          err = true;
          console.error(`[?] ${pp} [key: ${key}] [nameSlug: ${nameSlug}]`);
        }
      }
    } else {
      const st = fs.statSync(pp);
      if (st.isDirectory()) {
        checkKeys(pp, nameSlug);
      }
    }
  }
}

const dirs = fs.readdirSync(componentsDir);
for (const name of dirs) {
  const p = path.join(componentsDir, name);
  const subnames = fs.readdirSync(p);
  let nameSlug;
  for (const subname of subnames) {
    if (subname === "node_modules") {
      continue;
    }
    // Some app files are in the root of the component dir, not in a subdir
    if (subname.endsWith(".app.mjs") || subname.endsWith(".app.js") || subname.endsWith(".app.mts") || subname.endsWith(".app.ts")) {
      const appPath = path.join(p, subname);
      const data = fs.readFileSync(appPath, "utf8");
      const md = data.match(/['"]?app['"]?: ['"]([^'"]+)/);
      nameSlug = md[1];
    }
    // Some app files are kept in the app dir
    if (subname === "app") {
      const appDir = path.join(p, subname);
      const appFiles = fs.readdirSync(appDir);
      for (const appFile of appFiles) {
        if (appFile.endsWith(".mjs") || appFile.endsWith(".js") || appFile.endsWith(".mts") || appFile.endsWith(".ts")) {
          const data = fs.readFileSync(path.join(appDir, appFile), "utf8");
          const md = data.match(/['"]?app['"]?: ['"]([^'"]+)/);
          nameSlug = md[1];
        }
      }
    }
  }
  if (!nameSlug) {
    console.error(`[!] could not find app name slug in directory '${name}'`);
    err = true;
    continue;
  }
  if (nameSlug !== name) {
    console.error(`[!] directory '${name}' does not match name slug '${nameSlug}'`);
    err = true;
  }
  checkKeys(p, nameSlug);
}

checkPathVsKey();

if (err) {
  const core = require('@actions/core');
  core.setFailed("There are errors in some components. See the messages above.");
}

module.exports.rootDir = rootDir;
module.exports.isAppFile = isAppFile;
module.exports.isSourceFile = isSourceFile;
module.exports.isCommonFile = isCommonFile;
module.exports.iterateComponentFiles = iterateComponentFiles;
