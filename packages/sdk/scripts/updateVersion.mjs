import fs from "fs";
import cp from "child_process";

if (!process.env.CI) {
  // make sure people building locally automatically do not track changes to version file
  cp.execSync("git update-index --skip-worktree src/version.ts");
}

const pkg = JSON.parse(String(fs.readFileSync("./package.json", "utf8")))
fs.writeFileSync("./src/version.ts", `// DO NOT EDIT, SET AT BUILD TIME
export const version = "${pkg.version}";`);
