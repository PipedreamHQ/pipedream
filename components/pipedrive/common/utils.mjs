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

const getCustomFieldNames = async (fn) => {
  const { data: personFields } = await fn();
  const customFields = personFields.filter((field) => field.created_by_user_id);
  const customFieldNames = {};
  customFields.forEach((field) => {
    customFieldNames[field.key] = field.name;
  });
  return customFieldNames;
};

export const formatCustomFields = async (resp, getResourcesFn, getFieldsFn) => {
  const { data: persons } = await getResourcesFn({
    ids: resp.data.items.map((item) => item.item.id),
  });
  const customFieldNames = await getCustomFieldNames(getFieldsFn);

  return resp.data.items.map((person) => {
    const { custom_fields: customFields } = persons.find((p) => p.id === person.item.id);

    if (!person.item?.custom_fields || Object.keys(customFields).length === 0) {
      return person;
    }

    if (!customFields || Object.keys(customFields).length === 0) {
      return person;
    }
    const formattedCustomFields = {};
    Object.entries(customFields).forEach(([
      key,
      value,
    ]) => {
      if (customFieldNames[key]) {
        formattedCustomFields[customFieldNames[key]] = value;
      }
    });
    return {
      ...person,
      item: {
        ...person.item,
        custom_fields: formattedCustomFields,
      },
    };
  });
};

export const formatLeadDataFromSource = async ({
  body, customFieldFn, resourceFn,
}) => {
  const customFieldNames = await getCustomFieldNames(customFieldFn);
  const { data: lead } = await resourceFn(body.data.id);
  const formattedCustomFields = {};
  for (const [
    key,
    value,
  ] of Object.entries(customFieldNames)) {
    if (lead[key]) {
      formattedCustomFields[value] = lead[key];
    }
  }

  const formattedPreviousCustomFields = {};
  if (body?.previous?.custom_fields) {
    for (const [
      key,
      value,
    ] of Object.entries(customFieldNames)) {
      if (body.previous.custom_fields[key]) {
        formattedPreviousCustomFields[value] = body.previous.custom_fields[key];
      }
    }
  }
  return {
    ...body,
    data: {
      ...body.data,
      custom_fields: formattedCustomFields,
    },
    ...(body.previous?.custom_fields && {
      previous: {
        ...body.previous,
        custom_fields: formattedPreviousCustomFields,
      },
    }),
  };
};
