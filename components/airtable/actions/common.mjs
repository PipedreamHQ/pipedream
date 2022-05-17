import airtable from "../airtable.app.mjs";

export default {
  props: {
    airtable,
    baseId: {
      type: "string",
      withLabel: true,
      async options() {
        const bases = await this.airtable.bases();
        if (!bases) {
          return [];
        }
        return bases.map((base) => ({
          label: base.name || base.id,
          value: base.id,
        }));
      },
    },
    tableId: {
      type: "string",
      withLabel: true,
      async options() {
        const baseId = this.baseId?.value ?? this.baseId;
        const tables = await this.airtable.tables(baseId);
        if (!tables) {
          return [];
        }
        return tables.map((table) => ({
          label: table.name || table.id,
          value: table.id,
        }));
      },
    },
  },
};
