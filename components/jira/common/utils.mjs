export default {
  parseOne(obj) {
    let parsed;
    try {
      parsed = JSON.parse(obj);
    } catch (e) {
      parsed = obj;
    }
    return parsed;
  },
  parseObject(obj) {
    if (typeof obj === "string")
      obj = JSON.parse(obj);

    let parsed = {};
    for (let key in obj) {
      if (typeof obj[key] != "object" && typeof obj[key] != "number")
        parsed[key] = this.parseOne(obj[key].replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, "\"$2\": "));
      else
        parsed[key] = obj[key];
    }
    return parsed;
  },
  checkTmp(filename) {
    if (filename.indexOf("/tmp") === -1) {
      return `/tmp/${filename}`;
    }
    return filename;
  },
};
