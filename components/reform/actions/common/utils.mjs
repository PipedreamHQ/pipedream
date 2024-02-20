export default {
  parseFields(fields) {
    const parsed = [];
    for (const field of fields) {
      const fieldObj = typeof field === "object"
        ? field
        : JSON.parse(field);
      parsed.push(fieldObj);
    }
    return parsed;
  },
};
