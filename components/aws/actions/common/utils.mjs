// https://stackoverflow.com/questions/42974735/create-object-from-array
function createObjectFromArray(array) {
  return array.reduce((o, v) => ({
    ...o,
    [v]: v,
  }), {});
}

export default {
  createObjectFromArray,
};
