function filterObj(obj, predicate) {
  return Object.keys(obj)
    .filter((key) => predicate(obj[key]))
    .reduce((res, key) => ((res[key] = obj[key]), res), {});
}

export {
  filterObj,
};
