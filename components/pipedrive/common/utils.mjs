import pipedrive from "../pipedrive.app.mjs";

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
  const customFields = await pipedrive.methods.getPaginatedResources({
    fn,
  });
  body.data.custom_fields = await parseCustomFields(body.data, customFields);
  body.previous.custom_fields = await parseCustomFields(body.previous, customFields);
  return body;
};

const getCustomFieldNames = async (fn) => {
  const personFields = await pipedrive.methods.getPaginatedResources({
    fn,
  });
  const customFields = personFields.filter((field) => field.created_by_user_id);
  const customFieldNames = {};
  customFields.forEach((field) => {
    customFieldNames[field.key] = field.name;
  });
  return customFieldNames;
};

const getCustomFieldData = async (fn) => {
  const personFields = await pipedrive.methods.getPaginatedResources({
    fn,
  });
  const customFields = personFields.filter((field) => field.created_by_user_id);
  const customFieldNames = {};
  customFields.forEach((field) => {
    customFieldNames[field.key] = {
      name: field.name,
      type: field.field_type,
      options: field?.options?.length
        ? field.options
        : undefined,
    };
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

const formatCustomSelectFields = (customFieldNames, data, body, isPrevious = false) => {
  const formattedCustomFields = {};
  for (const [
    key,
    value,
  ] of Object.entries(customFieldNames)) {
    let fieldValue = isPrevious
      ? body.previous?.custom_fields?.[key]
      : data[key] ?? data?.custom_fields?.[key] ?? null;
    if (fieldValue && value.options?.length) {
      if (value.type === "enum") {
        fieldValue = value.options
          .find((option) => option.id === (fieldValue.id || fieldValue))
          ?.label;
      }
      if (value.type === "set") {
        const selectedOptions = isPrevious
          ? fieldValue.values
          : fieldValue.split(",");
        fieldValue = selectedOptions.map((option) => value.options.find((o) => o.id == (option.id || option))?.label).join(", ");
      }
    }
    formattedCustomFields[value.name] = fieldValue?.value ?? fieldValue;
  }
  return formattedCustomFields;
};

export const formatCustomFieldDataFromSource = async ({
  body, customFieldFn, resourceFn,
}) => {
  const customFieldNames = await getCustomFieldData(customFieldFn);
  const { data } = await resourceFn(body.data.id);
  const formattedCustomFields = await formatCustomSelectFields(customFieldNames, data, body);

  const formattedPreviousCustomFields
    = await formatCustomSelectFields(customFieldNames, data, body, true);
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
