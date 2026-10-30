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

/**
 * Recognize plain objects, including objects with a null prototype.
 *
 * @param {*} value Candidate object or other JavaScript value.
 * @returns {boolean} Whether the value has Object.prototype or null as prototype.
 */
export const isPlainObject = (value) => {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};
