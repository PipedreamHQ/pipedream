import smartsuite from "../../smartsuite.app.mjs";

export default {
  key: "smartsuite-create-record",
  name: "Create Record",
  description: "Creates a new record. [See the documentation](https://developers.smartsuite.com/docs/solution-data/records/create-record)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smartsuite,
    tableId: {
      propDefinition: [
        smartsuite,
        "tableId",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.tableId) {
      return props;
    }
    const { structure: fields } = await this.smartsuite.listFields({
      tableId: this.tableId,
    });
    for (const field of fields) {
      if (!field.params.is_auto_generated
        && !field.params.system
        && field.field_type !== "linkedrecordfield"
        && field.field_type !== "filefield"
        && field.field_type !== "userfield"
      ) {
        props[field.slug] = {
          type: "string",
          label: field.label,
          optional: !field.params.required,
          options: field.params.choices
            ? field.params.choices.map(({
              value, label,
            }) => ({
              value,
              label,
            }))
            : undefined,
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      smartsuite,
      tableId,
      ...data
    } = this;

    const response = await smartsuite.createRecord({
      $,
      tableId,
      data,
    });
    $.export("$summary", `Successfully created record with ID: ${response.id}`);
    return response;
  },
};
