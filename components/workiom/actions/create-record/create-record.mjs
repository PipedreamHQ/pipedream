import { getDataType } from "../../common/constants.mjs";
import app from "../../workiom.app.mjs";

export default {
  key: "workiom-create-record",
  name: "Create Record",
  description: "Creates a new record in a Workiom list. [See the documentation](https://help.workiom.com/article/workiom-api-guide)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    appId: {
      propDefinition: [
        app,
        "appId",
      ],
    },
    listId: {
      propDefinition: [
        app,
        "listId",
        ({ appId }) => ({
          appId,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.listId) {
      const { result: { fields } } = await this.app.getListMetadata({
        params: {
          id: this.listId,
          expand: "Fields",
        },
      });

      for (const field of fields) {
        props[`field_${field.id}`] = {
          type: getDataType(`${field.dataType}`),
          label: field.name,
          description: `Value of ${field.name}`,
          optional: !field.isRequired,
          ...(field.staticListValues?.length
            ? {
              options: field.staticListValues.map((option) => ({
                label: option.label,
                value: option.id,
              })),
            }
            : {}),
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      app,
      appId,
      listId,
      ...data
    } = this;

    const response = await app.createRecord({
      $,
      params: {
        appId,
        listId,
      },
      data: Object.fromEntries(Object.entries(data).map(([
        key,
        value,
      ]) => [
        key.replace("field_", ""),
        value,
      ])),
    });

    $.export("$summary", `Successfully created record in list ${listId}`);
    return response;
  },
};
