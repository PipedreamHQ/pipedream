export const parseObject = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const normalizeBaseUrl = (url) => {
  const trimmed = `${url ?? ""}`.trim().replace(/\/+$/, "");
  return /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
};
