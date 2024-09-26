export const getAdditionalProps = (formProps, allOptional = false) => {
  const props = {};
  for (const field of formProps.response.result) {
    if (!field.labelname) {
      continue;
    }
    props[field.labelname] = {
      label: field.displayname,
      description: field.description,
      type: "string",
      default: field.autofillvalue,
      optional: allOptional || !field.ismandatory,
    };

    if (field.Options) {
      const options = [];
      for (const optKey in field.Options) {
        if (typeof field.Options[optKey] === "string") {
          options.push(field.Options[optKey]);
        } else {
          options.push({
            label: field.Options[optKey].Value,
            value: field.Options[optKey].Id,
          });
        }
      }
      props[field.labelname].options = options;
    }
  }

  return props;
};

export const convertEmptyToNull = (data) => {
  for (const key in data) {
    if (data[key] === "") {
      data[key] = undefined;
    }
  }
  return data;
};

export const normalizeErrorMessage = (errors) => {
  return Array.isArray(errors)
    ? errors.map((error) => JSON.stringify(error.message)).join(", ")
    : JSON.stringify(errors.message);
};
