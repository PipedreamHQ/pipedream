import common from "../common/common.mjs";

export default {
  name: "New Field",
  description: "Emit new event for each new field created in a table",
  key: "airtable_oauth-new-field",
  version: "0.0.3",
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
      description: "The table ID to watch for changes.",
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
      if (fieldIds.includes(field.id)) {
        continue;
      }
      fieldIds.push(field.id);
      this.$emit(field, {
        id: field.id,
        summary: field.name,
        ts: Date.now(),
      });
    }

    this._setFieldIds(fieldIds);
  },
};
