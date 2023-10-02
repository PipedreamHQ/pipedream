export const  emptyStrToUndefined = (value) => {
  const trimmed = typeof(value) === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
};

export const configField = (customFieldId, customFieldValue, fields) => {
  if (Array.isArray(customFieldValue)) {

    const filteredFields = fields.filter(({ ID }) => customFieldId.includes(ID));

    const subField = filteredFields[0].SubFields;
    return {
      ...subField.filter(({ ID }) => customFieldValue.includes(ID))
        .reduce((redux, {
          Label: subLabel,
          ID: subId,
        }) => ({
          ...redux,
          [subId]: subLabel,
        }), {}),
    };
  }
  return {
    [customFieldId]: customFieldValue,
  };
};

export const configComponent = ({
  ID, Type, SubFields, Choices, Title, Label, IsRequired,
}) => {
  const options = SubFields || Choices;
  return {
    [`fieldValue${ID}`]: {
      type: (Type === "number")
        ? "integer"
        : `string${SubFields
          ? "[]"
          : ""}`,
      label: Title || Label,
      description: "Set your custom field value",
      optional: !Number(IsRequired),
      options: options && options.map((option) => ({
        label: option.Label,
        value: option.ID || option.Label,
      })),
    },
  };
};

export const prepareFields = (fields) => {
  return fields
    .filter((item) => /Field[0-9]*/.test(item.ID))
    .reduce((reduction, {
      Type, IsRequired, SubFields, ...field
    }) => {
      let props = {};
      if (SubFields && (Type != "checkbox")) {
        for (const subField of SubFields) {
          props = {
            ...props,
            ...configComponent({
              ...subField,
              IsRequired,
            }),
          };
        }
      } else {
        props = {
          ...props,
          ...configComponent({
            ...field,
            Type,
            SubFields,
            IsRequired,
          }),
        };
      }

      return {
        ...reduction,
        ...props,
      };
    }, {});
};
