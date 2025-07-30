const removeNullEntries = (obj) =>
  obj && Object.entries(obj).reduce((acc, [
    key,
    value,
  ]) => {
    const isNumber = typeof value === "number";
    const isBoolean = typeof value === "boolean";
    const isNotEmpyString = typeof value === "string" && value.trim() !== "";
    const isNotEmptyArray = Array.isArray(value) && value.length;
    const isNotEmptyObject =
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.keys(value).length !== 0;
    isNotEmptyObject && (value = removeNullEntries(value));
    return ((value || value === false) &&
        (isNotEmpyString || isNotEmptyArray || isNotEmptyObject || isBoolean || isNumber))
      ? {
        ...acc,
        [key]: value,
      }
      : acc;
  }, {});

function doesContextMatch(inputContext, fetchedContext) {

  if (typeof inputContext !== "object" || inputContext === null || Array.isArray(inputContext)) {
    throw new Error ("Message context is not an object");
  };

  for (const key of Object.keys(inputContext)) {
    if (!(key in fetchedContext)) {
      console.log(`Invalid context field "${key}", emission skipped` );
      return false;
    }
    if (fetchedContext[key] !== inputContext[key]) {
      console.log(`Context values of "${key}" do not match, emission skipped` );
      return false;
    }
  }
  return true;
};

export {
  removeNullEntries,
  doesContextMatch,
};

