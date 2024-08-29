function encode(value) {
  return value && encodeURIComponent(value);
}

export default {
  encode,
};
