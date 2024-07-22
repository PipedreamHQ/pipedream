import { getAdditionalFields } from "../../common/props-utils.mjs";
import salesforce from "../../salesforce_rest_api.app.mjs";
import { additionalFields } from "../common/base.mjs";

export default {
  key: "salesforce_rest_api-create-record",
  name: "Create Record",
  description: "Create a record of a given object. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_create.htm)",
  version: "0.3.{{ts}}",
  type: "action",
  props: {
    salesforce,
    objectType: {
      propDefinition: [
        salesforce,
        "objectType",
      ],
      description: "SObject Type to create a record of",
      reloadProps: true,
    },
  },
  methods: {
    getAdditionalFields,
    getFieldPropType(fieldType) {
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
    },
  },
  async additionalProps() {
    const { objectType } = this;
    const fields = await this.salesforce.getFieldsForObjectType(objectType);

    const requiredFields = fields.filter((field) => {
      return field.createable && !field.nillable && !field.defaultedOnCreate;
    });

    const requiredFieldProps = requiredFields
      .map((field) => {
        const { type } = field;
        const prop = {
          type: this.getFieldPropType(type),
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
            prop.description = `The ID of a${field.referenceTo[0].startsWith("A")
              ? "n"
              : ""} \`${field.referenceTo[0]}\` record.`;
            prop.options = async () => {
              let response;
              try {
                response = await this.salesforce.listRecordOptions({
                  objType: field.referenceTo[0],
                });
              } catch (err) {
                response = await this.salesforce.listRecordOptions({
                  objType: field.referenceTo[0],
                  fields: [
                    "Id",
                  ],
                  getLabel: (item) => `ID ${item.Id}`,
                });
              }
              return response;
            };
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

    return {
      docsInfo: {
        type: "alert",
        alertType: "info",
        content: `[See the documentation](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_${objectType.toLowerCase()}.htm) for information on all available fields.`,
      },
      ...requiredFieldProps,
      additionalFields,
    };
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      objectType,
      getAdditionalFields,
      convertFieldsToProps,
      docsInfo,
      dateInfo,
      additionalFields,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    $.export("data", data);
    const response = await salesforce.createRecord(objectType, {
      $,
      data: {
        ...data,
        ...getAdditionalFields(),
      },
    });
    $.export("$summary", `Successfully created ${this.objectType} record (ID: ${response.id})`);
    return response;
  },
};
