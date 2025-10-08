import {
  camelCaseToWords, parseObject,
} from "../../common/utils.mjs";
import twenty from "../../twenty.app.mjs";

export default {
  key: "twenty-create-update-delete-record",
  name: "Create, Update, or Delete a Record in Twenty",
  description: "Create, update, or delete a single record in Twenty. This action allows for dynamic handling of records based on specified action type. [See the documentation](https://api.twenty.com/docs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    twenty,
    recordId: {
      propDefinition: [
        twenty,
        "recordId",
      ],
      reloadProps: true,
    },
    actionType: {
      propDefinition: [
        twenty,
        "actionType",
      ],
      reloadProps: true,
    },
    additionalProp: {
      type: "object",
      label: "Additional Prop",
      description: "Any additional prop you want to fill.",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    const recordId = this.recordId;
    const actionType = this.actionType;

    if (recordId && this.actionType) {
      if ([
        "delete",
        "update",
      ].includes(actionType)) {
        props.id = {
          type: "string",
          label: `${camelCaseToWords(recordId)} Id`,
          description: `The Id of ${recordId}`,
          options: async () => {
            const {
              components: { schemas }, tags,
            } = await this.twenty.listRecords();
            const index = Object.keys(schemas).findIndex((i) => i === this.recordId);
            const { data } = await this.twenty.listRecordItems(tags[index + 1].name);
            const response = data[tags[index + 1].name];
            return response.map((item) => ({
              label: item.name || item.title || item.id,
              value: item.id,
            }));
          },
        };
      }

      if ([
        "create",
        "update",
      ].includes(actionType)) {

        const { components: { schemas } } = await this.twenty.listRecords();
        const properties = schemas[recordId].properties;
        const required = schemas[recordId].required || [];

        for (const [
          key,
          value,
        ] of Object.entries(properties)) {
          if (
            (key != "id") &&
          (key != "createdAt") &&
          (key != "updatedAt") &&
          (value.type) &&
          (value.type != "object") &&
          (value.type != "array")
          ) {
            props[key] = {
              type: value["type"] === "number"
                ? "integer"
                : value["type"],
              label: camelCaseToWords(key),
              description: value["description"],
              optional: !(required.includes === key),
            };
          }
        }
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      twenty,
      id,
      recordId,
      actionType,
      additionalProp,
      ...data
    } = this;

    let response;

    const {
      components: { schemas }, tags,
    } = await this.twenty.listRecords();
    const index = Object.keys(schemas).findIndex((i) => i === this.recordId);

    try {
      response = await twenty.performAction({
        $,
        id,
        actionType: this.actionType,
        recordName: tags[index + 1].name,
        data: {
          ...data,
          ...(additionalProp
            ? parseObject(additionalProp)
            : {}),
        },
      });

      $.export("$summary", `Successfully performed ${actionType} ${recordId} on record with ID: ${id || response.data[`${actionType}${recordId}`].id}`);

      return response;
    } catch (error) {
      throw new Error(`Failed to ${actionType} record. Error: ${error.message}`);
    }
  },
};
