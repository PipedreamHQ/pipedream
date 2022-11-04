import ragic from "../../ragic.app.mjs";

export default {
  props: {
    ragic,
    http: "$.interface.http",
    db: "$.service.db",
    sheet: {
      propDefinition: [
        ragic,
        "sheet",
      ],
    },
    category: {
      propDefinition: [
        ragic,
        "category",
        (c) => ({
          sheet: c.sheet,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      const ids = [];
      const recordsToEmit = [];
      const { category } = this;

      console.log("Fetching historical records...");
      const records = await this.ragic.listRecords({
        sheet: this.sheet,
        categoryId: this.category.value,
      });

      for (const record of records) {
        const {
          label,
          value: id,
        } = this.ragic.formatRecordOptions({
          category: category.label,
          record,
        });
        ids.push(id);
        recordsToEmit.push([
          record,
          this.getMeta(id, label),
        ]);
      }

      for (const [
        record,
        meta,
      ] of recordsToEmit.slice(-25)) {
        this.$emit(record, meta);
      }

      this.setRecords(ids);
      console.log("Don't forget to add the HTTP endpoint to the webhook list in Ragic!");
    },
  },
  methods: {
    getRecords() {
      return this.db.get("records");
    },
    setRecords(ids) {
      ids = ids.map((id) => typeof id === "string"
        ? parseInt(id)
        : id);
      this.db.set("records", ids);
    },
    addRecord(id) {
      const ids = this.getRecords();
      ids.push(id);
      this.setRecords(ids);
    },
    removeRecord(id) {
      const ids = this.getRecords();
      this.setRecords(ids.filter((recordId) => recordId !== id));
    },
    isNew(id) {
      return !this.isUpdate(id);
    },
    isUpdate(id) {
      const records = this.getRecords();
      return records.includes(id);
    },
    isDelete(record) {
      return record == null;
    },
    isRelevant() {
      throw new Error("isRelevant method not implemented");
    },
    getMeta(id, label) {
      return {
        id,
        summary: `${this.category.label} record: ${label}`,
        ts: new Date(),
      };
    },
  },
  async run(event) {
    const { body: ids } = event;
    const {
      label: category,
      value: categoryId,
    } = this.category;

    for (const recordId of ids) {
      console.log(`Fetching information for recordId: ${recordId}`);
      const record = await this.ragic.getRecord({
        sheet: this.sheet,
        categoryId,
        recordId,
      });

      if (this.isDelete(record)) {
        console.log(`Skipping record: ${recordId}`);
        this.removeRecord(recordId);
        continue;
      }

      if (!this.isRelevant(recordId)) {
        console.log(`Skipping record: ${recordId}`);
        continue;
      }

      const { label } = this.ragic.formatRecordOptions({
        category,
        record,
      });

      console.log(`Emitting event for recordId: ${recordId}`);
      this.$emit(record, this.getMeta(recordId, label));
    }
  },
};
