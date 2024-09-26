export const checkTmp = (filename) => {
  if (filename.indexOf("/tmp") === -1) {
    return `/tmp/${filename}`;
  }
  return filename;
};

export const camelToSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);};
