export const parseArray = (value) => {
  if (!value) {
    return null;
  }
  if (Array.isArray(value)) {
    return value;
  }
  return JSON.parse(value);
};
