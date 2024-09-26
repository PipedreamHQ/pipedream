function extractSubstringAfterSlash(str) {
  const match = str.match(/\/(.*)/);
  if (match && match[1]) {
    return match[1];
  } else {
    return null; // Return null if no "/" is found in the string
  }
}

export default {
  extractSubstringAfterSlash,
};
