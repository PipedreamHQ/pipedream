function omitEmptyStringValues (object) {
  Object.keys(object).map((prop) => {
    const propvalue = object[prop];
    object[prop] = (propvalue === "" || propvalue === null)
      ? undefined
      : propvalue;
  });
  return object;
}

export default {
  omitEmptyStringValues,
};
