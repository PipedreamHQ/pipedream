export const parseObject = (obj) => {
  if (!obj) return undefined;

  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        try {
          return JSON.parse(item);
        } catch (e) {
          return item;
        }
      }
      return item;
    });
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }
  return obj;
};

export const unwrapDatasetItems = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (response && Array.isArray(response.data)) {
    return response.data;
  }

  if (response && response.status && response.data !== undefined) {
    return response.data;
  }

  return response;
};

export const buildActorInput = (input) => {
  const result = {};

  for (const [
    key,
    value,
  ] of Object.entries(input)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    if (Array.isArray(value) && value.length === 0) {
      continue;
    }

    result[key] = value;
  }

  return result;
};

export const formatCount = (count, singular, pluralForm) => {
  const word = count === 1
    ? singular
    : pluralForm;

  return `${count} ${word}`;
};
