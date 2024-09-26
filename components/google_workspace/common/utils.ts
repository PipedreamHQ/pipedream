function stringifyError(error) {
  return JSON.stringify(error.response?.data, null, 2)
    || error;
}

export default {
  stringifyError,
};
