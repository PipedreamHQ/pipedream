function parseArray(arr) {
  if (!arr) {
    return undefined;
  }

  if (typeof arr === "string") {
    try {
      return JSON.parse(arr);
    } catch {
      return arr;
    }
  }

  return arr;
}

function parseObj(obj) {
  if (!obj) {
    return undefined;
  }

  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch {
      return obj;
    }
  }

  return obj;
}

export {
  parseArray,
  parseObj,
};
