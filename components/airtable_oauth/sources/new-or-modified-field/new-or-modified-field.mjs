import common from "../common/common.mjs";

export default {
  name: "New or Modified Field",
  description: "Emit new event for each new or modified field in a table",
  key: "airtable_oauth-new-or-modified-field",
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
    _getPrevFields() {
      return this.db.get("fieldIds") || {};
    },
    _setPrevFields(fieldIds) {
      this.db.set("fieldIds", fieldIds);
    },
  },
  async run() {
    const prevFields = this._getPrevFields();

    const { tables } = await this.airtable.listTables({
      baseId: this.baseId,
    });
    const { fields } = tables.find(({ id }) => id === this.tableId);

    for (const field of fields) {
      if (prevFields[field.id] && prevFields[field.id] === JSON.stringify(field)) {
        continue;
      }
      const summary = prevFields[field.id]
        ? `${field.name} Updated`
        : `${field.name} Created`;
      prevFields[field.id] = JSON.stringify(field);

      this.$emit(field, {
        id: field.id,
        summary,
        ts: Date.now(),
      });
    }

    this._setPrevFields(prevFields);
  },
};
