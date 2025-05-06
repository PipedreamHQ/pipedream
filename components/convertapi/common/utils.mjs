import fs from "fs";

export const checkTmp = (filename) => {
  if (!filename.startsWith("/tmp")) {
    return `/tmp/${filename}`;
  }
  return filename;
};

export const saveFile = async (Files) => {
  const FileInfo = Files[0];
  const tmpFilePath = `/tmp/${FileInfo.FileName}`;
  return fs.writeFileSync(tmpFilePath, FileInfo.FileData, "base64");
};
