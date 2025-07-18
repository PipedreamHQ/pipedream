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

const parseCustomFields = async (data, customFields) => {
  if (data.custom_fields) {
    const newCustomFields = {};
    for (const field of Object.keys(data.custom_fields)) {
      const customField = customFields.find(({ key }) => key === field);
      if (customField) {
        newCustomFields[customField.name] = data.custom_fields[field]?.value;
      }
    }
    return newCustomFields;
  }
  return data.custom_fields;
};

export const parseData = async ({
  fn, body,
}) => {
  const { data: customFields } = await fn();
  body.data.custom_fields = await parseCustomFields(body.data, customFields);
  body.previous.custom_fields = await parseCustomFields(body.previous, customFields);
  return body;
};
