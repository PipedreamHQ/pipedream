function toCapitalCase(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function filterProps(props) {
  if (!props) {
    return;
  }
  return Object.fromEntries(
    Object.entries(props).filter(
      ([
        key,
        value,
      ]) =>
        typeof value !== "function" && ![
          "app",
          "salesforce",
        ].includes(key),
    ),
  );
}

function keysToCapitalCase(data = {}) {
  return Object.entries(filterProps(data)).reduce(
    (acc, [
      key,
      value,
    ]) => ({
      ...acc,
      [toCapitalCase(key)]: value,
    }),
    {},
  );
}

export default {
  keysToCapitalCase,
};

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

function getFieldPropType(fieldType) {
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
}

export const convertFieldsToProps = (fields) => {
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
          const objType = field.referenceTo[0];
          prop.description = `The ID of a${objType.startsWith("A")
            ? "n"
            : ""} \`${objType}\` record.`;
          prop.options = async () => {
            let response;
            try {
              response = await this.salesforce.listRecordOptions({
                objType,
              });
            } catch (err) {
              response = await this.salesforce.listRecordOptions({
                objType,
                fields: [
                  "Id",
                ],
                getLabel: (item) => `ID ${item.Id}`,
              });
            }
            return response;
          };
        } else if (field.referenceTo?.length > 1) {
          const fieldNames = field.referenceTo
            .map((s) => `\`${s}\``)
            .join(", ");
          prop.description = `The ID of a record of one of these object types: ${fieldNames}`;
        }
      }

      return prop;
    })
    .reduce((obj, prop) => {
      obj[prop.label] = prop;
      return obj;
    }, {});
};
