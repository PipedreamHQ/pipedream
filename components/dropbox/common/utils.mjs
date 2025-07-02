export const checkTmp = (filename) => {
  if (!filename.startsWith("/tmp")) {
    const baseDir = process.env.STASH_DIR || "/tmp";
    return `${baseDir}/${filename}`;
  }
  return filename;
};
