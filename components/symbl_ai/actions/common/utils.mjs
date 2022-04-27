export function emptyStrToUndefined(value) {
  const trimmed = typeof(value) === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
}

export function parseArrayOfJSONStrings(stringList) {
  if (!stringList) {
    return [];
  }
  if (typeof stringList == "string") {
    throw new Error("The String type is not supported, please use an array of objects in structured mode.");
  }
  let data = stringList;
  data = data.map((v) => {
    return typeof v === "string"
      ? JSON.parse(v)
      : v;
  });
  return data;
}

export default {
  parseArrayOfJSONStrings,
  emptyStrToUndefined,
};
