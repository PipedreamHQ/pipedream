import fs from "fs";
import cp from "child_process";

if (!process.env.CI) {
  // make sure people building locally automatically do not track changes to version file
  cp.execSync("git update-index --skip-worktree src/version.ts");
}

const pkg = JSON.parse(String(fs.readFileSync("./package.json", "utf8")))
const versionTsPath = "./src/version.ts";
const data = String(fs.readFileSync(versionTsPath, "utf8"));
const newData = data.replace(/"(.*)"/, `"${pkg.version}"`);
fs.writeFileSync(versionTsPath, newData);
