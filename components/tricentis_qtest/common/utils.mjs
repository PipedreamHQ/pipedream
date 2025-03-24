export async function getFieldProps() {
  if (this.useFields === false) return {};

  const fields = await this.getDataFields();

  function getFieldType(type) {
    switch (type) {
    case "Number":
      return "integer";
    case "ArrayNumber":
      return "integer[]";
    default:
      return "string";
    }
  }

  const result = {};
  const isUpdate = !!(this.requirementId || this.defectId);

  fields?.forEach(({
    id, label, attribute_type: fieldType, allowed_values: options, required,
  }) => {
    const type = getFieldType(fieldType);
    result[`field_${id}`] = {
      label,
      type,
      description: `Field ID: ${id} (type: ${fieldType})`,
      optional: isUpdate || !required,
      ...(options && {
        options: options.map(({
          label, value,
        }) => ({
          label,
          value: (type === "string" && typeof value !== "string")
            ? value.toString()
            : value,
        })),
      }),
    };
  });

  return result;
}

export function getProperties(fields) {
  return fields && Object.entries(fields).map(([
    id,
    value,
  ]) => ({
    field_id: id.split("_").pop(),
    field_value: value,
  }));
}
