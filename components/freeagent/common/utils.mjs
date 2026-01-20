export const getId = (str) => {
  return str.split("/").pop() ?? str;
};
