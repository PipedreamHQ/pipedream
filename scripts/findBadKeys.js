// walk through each folder under components
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const componentsDir = path.join(rootDir, "components");
const args = process.argv;

let err = false;

// now walk dirs looking for components and `key: ""`... (find component keys better)
function checkKeys(p, nameSlug) {
  const names = fs.readdirSync(p);
  for (const name of names) {
    const pp = path.join(p, name);
    if (name === "node_modules") {
      continue;
    }
    if (name.endsWith(".mjs") || name.endsWith(".js") || name.endsWith(".ts") || name.endsWith(".mts")) {
      const data = fs.readFileSync(pp, "utf8");
      const md = data.match(/['"]?key['"]?: ['"]([^'"]+)/);
      if (md) {
        const key = md[1];
        if (!key.startsWith(`${nameSlug}-`)) {
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



console.log("the args are here", JSON.stringify(args));
function checkPathVsKey(p, nameSlug) {
  console.log("p is", p);
  console.log("nameSlug is", nameSlug);
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
  checkPathVsKey(p, nameSlug);
}

if (err) {
  process.exit(1);
}
