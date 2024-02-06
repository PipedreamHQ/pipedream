function arrayToObj(arr) {
  if (!Array.isArray(arr)) {
    return;
  }

  return arr.reduce((acc, key) => {
    return {
      ...acc,
      [key]: true,
    };
  }, {});
}

export default {
  arrayToObj,
};
