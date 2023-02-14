import fs from "fs";

const content1 = fs.readFileSync("components/google_drive/google_drive.app.mjs").toString("utf8");
const content2 = fs.readFileSync("components/google_drive/common/utils.mjs").toString("utf8");
const content3 = fs.readFileSync("components/google_drive/actions/copy-file/copy-file.mjs").toString("utf8");

function includesVersion(content) {
  return content.includes(`
  version:`) || content.includes(`
  "version":`);
}

console.log(includesVersion(content1));
console.log(includesVersion(content2));
console.log(includesVersion(content3));
