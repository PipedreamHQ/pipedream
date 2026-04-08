export const escapeHtml = (s) => {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

export const parseObject = (obj) => {
  if (!obj) return null;

  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => parseObject(item));
  }
  if (typeof obj === "object") {
    const newObj = {};
    for (const [
      key,
      value,
    ] of Object.entries(obj)) {
      newObj[key] = parseObject(value);
    }
    return newObj;
  }
  return obj;
};

const validEmail = (email) => {
  return email && email.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const filterInboxes = (inboxes) => {
  return inboxes?.filter(({
    isVerified,
    email,
  }) => {
    return isVerified && validEmail(email);
  });
};
