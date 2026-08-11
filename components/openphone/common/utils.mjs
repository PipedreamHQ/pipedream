export const parseObject = (obj) => {
  if (!obj) return undefined;

  let parsedObj = obj;
  if (typeof obj === "string") {
    try {
      parsedObj = JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }

  if (Array.isArray(parsedObj)) {
    return parsedObj.map((item) => parseObject(item));
  }
  if (typeof parsedObj === "object") {
    for (const [
      key,
      value,
    ] of Object.entries(parsedObj)) {
      parsedObj[key] = parseObject(value);
    }
  }

  return parsedObj;
};

// The OpenPhone contacts API requires emails/phoneNumbers as arrays of {name, value}
// objects, with BOTH fields required (confirmed via two live 400s: "Expected object" on
// a bare string array, then "/name - Expected required property" once value alone was
// supplied) — normalize bare strings into the required shape with a generic label
// rather than relying on the caller to pre-format them.
export const normalizeNameValueList = (items, defaultName = "Other") => {
  if (!Array.isArray(items)) return items;
  return items.map((item) =>
    typeof item === "string"
      ? {
        name: defaultName,
        value: item,
      }
      : item);
};

export const pickFields = (records, fields) => {
  if (!fields?.length) return records;
  return records.map((record) =>
    Object.fromEntries(fields
      .filter((field) => Object.hasOwn(record, field))
      .map((field) => [
        field,
        record[field],
      ])));
};
