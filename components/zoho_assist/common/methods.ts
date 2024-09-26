export function getValidDate (str: string, unixTime = false) {
  const date = new Date(str);
  const value = date.valueOf();
  return Number(isNaN(value)
    ? str
    : (unixTime
      ? Math.floor(value)
      : value));
}
