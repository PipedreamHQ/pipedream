export const getAdditionalProps = (formProps, allOptional = false) => {
  const props = {};
  for (const field of formProps.response.result) {
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
