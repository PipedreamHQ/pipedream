import smartsuite from "../../smartsuite.app.mjs";

export default {
  key: "smartsuite-find-records",
  name: "Find Records",
  description: "Search for records based on matching field(s). [See the documentation](https://developers.smartsuite.com/docs/solution-data/records/list-records)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    smartsuite,
    tableId: {
      propDefinition: [
        smartsuite,
        "tableId",
      ],
    },
    fieldIds: {
      propDefinition: [
        smartsuite,
        "fieldIds",
        (c) => ({
          tableId: c.tableId,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.tableId || !this.fieldIds?.length) {
      return props;
    }
    const { structure: fields } = await this.smartsuite.listFields({
      tableId: this.tableId,
    });
    for (const fieldId of this.fieldIds) {
      const field = fields.find(({ slug }) => slug === fieldId);
      props[fieldId] = {
        type: "string",
        label: field.label,
      };
    }
    return props;
  },
  async run({ $ }) {
    const fields = this.fieldIds?.length
      ? this.fieldIds.map((field) => ({
        comparison: "is",
        field,
        value: this[field],
      }))
      : undefined;
    const { items } = await this.smartsuite.listRecords({
      $,
      tableId: this.tableId,
      data: {
        filter: {
          operator: "and",
          fields,
        },
      },
    });
    if (items?.length) {
      $.export("$summary", `Successfully found ${items.length} record${items.length === 1
        ? ""
        : "s"}`);
    }
    return items;
  },
};
