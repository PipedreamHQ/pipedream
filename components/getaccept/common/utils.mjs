export const getFilePath = (file) => {
  const regex = new RegExp(/\/tmp\//, "g");

  if (file.match(regex)) {
    return file;
  }
  return `/tmp/${file}`;
};

export const parseArray = (array, v) => {
  if (v) {
    if (Array.isArray(array)) {
      return JSON.stringify(array.map((item) => {
        if (typeof item != "object") {
          return JSON.parse(item);
        }
        return item;
      }));
    }
    return array;
  } else {
    if (Array.isArray(array)) {
      return array.map((item) => {
        if (typeof item != "object") {
          JSON.parse(item);
        }
        return item;
      });
    }
    return JSON.parse(array);
  }
};
