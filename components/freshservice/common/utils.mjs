function removeNullEntries(obj) {
  if (typeof obj === "number") {
    return obj;
  }
  if (typeof obj === "boolean") {
    return obj;
  }
  if (typeof obj === "string") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.filter((item) => item !== null && item !== undefined && item !== "")
      .map((item) => removeNullEntries(item));
  }
  if (typeof obj === "object" && obj !== null) {
    const result = {};
    for (const key in obj) {
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
        result[key] = removeNullEntries(obj[key]);
      }
    }
    return result;
  }
  return obj;
}

export {
  removeNullEntries,
};