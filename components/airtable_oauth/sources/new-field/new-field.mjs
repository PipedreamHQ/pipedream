import common from "../common/common.mjs";

export default {
  name: "New Field Created",
  description: "Emit new event when a field is created in the selected table. [See the documentation](https://airtable.com/developers/web/api/get-base-schema)",
  key: "airtable_oauth-new-field",
  version: "0.0.8",
  type: "source",
  props: {
    ...common.props,
    tableId: {
      propDefinition: [
        common.props.airtable,
        "tableId",
        ({ baseId }) => ({
          baseId,
        }),
      ],
      description: "Select a table to watch for new fields, or provide a table ID.",
    },
  },
  methods: {
    _getFieldIds() {
      return this.db.get("fieldIds") || [];
    },
    _setFieldIds(fieldIds) {
      this.db.set("fieldIds", fieldIds);
    },
  },
  async run() {
    const fieldIds = this._getFieldIds();

    const { tables } = await this.airtable.listTables({
      baseId: this.baseId,
    });
    const { fields } = tables.find(({ id }) => id === this.tableId);

    for (const field of fields) {
      const { id } = field;
      if (fieldIds.includes(id)) {
        continue;
      }
      fieldIds.push(id);
      this.$emit(field, {
        id,
        summary: `New field: '${field.name}'`,
        ts: Date.now(),
      });
    }

    this._setFieldIds(fieldIds);
  },
};
