import adalo from "../../adalo.app.mjs";

export default {
  key: "adalo-new-record",
  name: "New Record",
  description: "Emit new event when is created a record.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    adalo,
    collectionId: {
      label: "Collection ID",
      description: "The ID the collection",
      type: "string",
    },
  },
  async run({ $ }) {
    const records = await this.adalo.getRecords({
      $,
      collectionId: this.collectionId,
    });

    for (const record of records) {
      this.$emit(record, {
        id: record.id,
        summary: `New record ${record.id} created`,
        ts: Date.parse(record.created_at),
      });
    }
  },
};
