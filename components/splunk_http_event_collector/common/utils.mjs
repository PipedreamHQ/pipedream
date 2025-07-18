function parseJson(obj) {
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

  if (Array.isArray(obj)) {
    return obj.map((o) => {
      if (typeof o === "string") {
        try {
          return JSON.parse(o);
        } catch {
          return o;
        }
      }
      return o;
    });
  }

  return obj;
}

export {
  parseJson,
};
