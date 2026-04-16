export const LIMIT = 100;

export const getDataType = (dataType) => {
  switch (dataType) {
  case "1":
    return "integer";
  case "3":
    return "boolean";
  case "4":
    return "string";
  case "5":
    return "string[]";
  default:
    return "string";
  }
};
