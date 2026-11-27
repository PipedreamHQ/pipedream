export const splitEmails = (value) => {
  const items = Array.isArray(value)
    ? value
    : [
      value,
    ];
  return items
    .flatMap((item) => String(item ?? "").split(/[\s,;]+/))
    .map((item) => item.trim())
    .filter(Boolean);
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
