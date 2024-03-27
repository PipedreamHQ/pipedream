function getTrueIfUndefined(value) {
  return value !== undefined
    ? value
    : true;
}

export default {
  getTrueIfUndefined,
};
