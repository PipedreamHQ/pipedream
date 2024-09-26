function padZero(index) {
  return index < 10
    ? `0${index}`
    : index;
}

export default {
  padZero,
};
