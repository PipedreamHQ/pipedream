import constants from "./constants.mjs";

function addProperty({
  src, predicate, addition,
}) {
  return predicate
    ? {
      ...src,
      ...addition,
    }
    : src;
}

export default {
  parse(str) {
    if (!str) {
      return;
    }
    try {
      return JSON.parse(str);
    } catch (err) {
      console.log(`Error when trying to parse: ${str}`, err);
    }
  },
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
  reduceProperties({
    initialProps = {}, additionalProps = {},
  }) {
    const keysToUseArrayContext = [
      constants.FIELD_KEY.LABELS,
    ];

    return Object.entries(additionalProps)
      .reduce((src, [
        key,
        context,
      ]) => {
        const isArrayContext = Array.isArray(context) && !keysToUseArrayContext.includes(key);
        return addProperty({
          src,
          predicate: isArrayContext
            ? context[1]
            : context,
          addition: {
            [key]: isArrayContext
              ? context[0]
              : context,
          },
        });
      }, initialProps);
  },
};
