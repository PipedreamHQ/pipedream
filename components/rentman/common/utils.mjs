const camelToSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const snakeCaseData = (data) => {
  const snakeCaseData = {};
  for (const [
    key,
    value,
  ] of Object.entries(data)) {
    snakeCaseData[camelToSnakeCase(key)] = value;
  }
  return snakeCaseData;
};
