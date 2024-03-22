export const truncate = (str, n = 30) => {
  return (str.length > n)
    ? str.slice(0, n - 1) + "..."
    : str;
};
