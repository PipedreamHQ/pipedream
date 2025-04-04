import fs from "fs";

function normalizeFilePath(path) {
  return path.includes("tmp/")
    ? path
    : `/tmp/${path}`;
}

function checkForExtension(filename, ext = "pdf") {
  return filename.includes(`.${ext}`)
    ? filename
    : `${filename}.${ext}`;
}

function downloadToTmp(response, filename) {
  const rawcontent = response.toString("base64");
  const buffer = Buffer.from(rawcontent, "base64");
  const filePath = normalizeFilePath(filename);
  fs.writeFileSync(filePath, buffer);

  return [
    filename,
    filePath,
  ];
}

export default {
  normalizeFilePath,
  checkForExtension,
  downloadToTmp,
};
