// return the trimmed string or input as is if its not a string
export function trimIfString(input) {
  return (typeof input === "string")
    ? input.trim()
    : input;
};
