import allSobjects from "./all-sobjects.mjs";

export function getAdditionalFields() {
  return Object.fromEntries(
    Object.entries(this.additionalFields ?? {}).map(([
      key,
      value,
    ]) => {
      try {
        return [
          key,
          JSON.parse(value),
        ];
      } catch (err) {
        return [
          key,
          value,
        ];
      }
    }),
  );
}

export const convertFieldsToProps = (fields) => {
  const getFieldPropType = (fieldType) => {
    // https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/field_types.htm
    switch (fieldType) {
    case "boolean":
      return "boolean";
    case "int":
      return "integer";
    case "multipicklist":
      return "string[]";
    default:
      return "string";
    }
  };

  return fields
    .map((field) => {
      const { type } = field;
      const prop = {
        type: getFieldPropType(type),
        label: field.name,
        description: `Field type: \`${type}\``,
      };
      if ([
        "date",
        "datetime",
      ].includes(type)) {
        prop.description = `This is a \`${type}\` field. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_valid_date_formats.htm) for the expected format.`;
      } else if (
        [
          "picklist",
          "multipicklist",
        ].includes(type) &&
        field.picklistValues?.length
      ) {
        prop.description = `Select ${
          type === "picklist"
            ? "a value"
            : "one or more values"
        } from the list.`;
        prop.options = field.picklistValues.map(({
          label, value,
        }) => ({
          label,
          value,
        }));
      } else if (type === "reference") {
        if (field.referenceTo?.length === 1) {
          const objName = field.referenceTo[0];
          prop.description = `The ID of a${
            objName.startsWith("A")
              ? "n"
              : ""
          } \`${objName}\` record.`;
          const optionsFn = allSobjects.find(
            ({ name }) => name === objName,
          )?.getRecords;
          if (optionsFn) prop.options = optionsFn;
        } else if (field.referenceTo?.length > 1) {
          prop.description = `The ID of a record of one of these object types: ${field.referenceTo
            .map((s) => `\`${s}\``)
            .join(", ")}`;
        }
      }

      return prop;
    })
    .reduce((obj, prop) => {
      obj[prop.label] = prop;
      return obj;
    }, {});
};
