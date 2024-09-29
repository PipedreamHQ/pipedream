export async function getRequirementFieldProps() {
  if (!this.useFields) return {};

  const fields = await this.tricentisQtest.getRequirementFields(this.projectId);

  function getFieldType(type) {
    switch (type) {
    case "LongText":
    default:
      return "string";
    case "Number":
      return "integer";
    case "ArrayNumber":
      return "integer[]";
    }
  }

  const result = {};

  fields?.forEach(({
    id, label, attribute_type: type, allowed_values: options,
  }) => {
    result[`field_${id}`] = {
      label,
      type: getFieldType(type),
      description: `Field ID: ${id}`,
      optional: true,
      ...(options && {
        options: options.map(({
          label, value,
        }) => ({
          label,
          value,
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
