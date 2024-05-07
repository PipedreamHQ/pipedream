export const camelCaseToWords = (s) => {
  const result = s.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};
