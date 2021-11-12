function omitEmptyKey({
  /* eslint-disable-next-line no-unused-vars */
  "": _, ...omittedObj
} = {}) {
  return omittedObj;
}

export {
  omitEmptyKey,
};
