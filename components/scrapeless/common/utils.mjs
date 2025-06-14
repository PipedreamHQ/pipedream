export const parseObject = (obj) => {
  if (!obj) return undefined;

  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        try {
          return JSON.parse(item);
        } catch (e) {
          return item;
        }
      }
      return item;
    });
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }
  return obj;
};

export function isNull(val) {
  return val === null;
}

export const isDef = (val) => {
  return typeof val !== "undefined";
};

export const isUnDef = (val) => {
  return !isDef(val);
};

export function isNullAndUnDef(val) {
  return isUnDef(val) && isNull(val);
}

export function isNullOrUnDef(val) {
  return isUnDef(val) || isNull(val);
}

export function is(val, type) {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
}

export const isObject = (val) => {
  return val !== null && is(val, "Object");
};

export const log = (...args) => {
  console.log("[Scrapeless] ", ...args);
};
