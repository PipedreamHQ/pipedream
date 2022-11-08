import dear from "../../dear.app.mjs";

export default {
  props: {
    dear,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      this.setModifiedSince(new Date());
      const params = this.defaultParams();

      console.log(`Retrieving historical data with the following params: ${JSON.stringify(params)}`);
      const data = await this.pollFunction(params);
      this.emitEvents(data);
    },
  },
  methods: {
    getModifiedSince() {
      return this.db.get("modifiedSince");
    },
    setModifiedSince(modifiedSince) {
      this.db.set("modifiedSince", modifiedSince);
    },
    defaultParams() {
      throw new Error("defaultParams is not implemented");
    },
    pollFunction() {
      throw new Error("pollFunction is not implemented");
    },
    getMetadata() {
      throw new Error("getMetadata is not implemented");
    },
    emitEvents(data) {
      if (data.length > 0) {
        console.log("Emiting events...");
        for (const d of data) {
          const meta = this.getMetadata(d);
          this.$emit(d, meta);
        }
      }
    },
  },
  async run() {
    const params = {
      ...this.defaultParams(),
      modifiedSince: this.getModifiedSince(),
    };

    console.log(`Requesting data with the following params: ${JSON.stringify(params)}`);
    const data = await this.pollFunction(params);

    if (data.length > 0) {
      const lastModified = data[data.length - 1].LastModifiedOn;
      this.setModifiedSince(lastModified);
      this.emitEvents(data);
    }
  },
};
