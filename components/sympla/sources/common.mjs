export default {
  dedupe: "unique",
  props: {
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      console.log("Initializing deploy...");
      this.initExecutedIds();
      this.setLastExecution(new Date("2000-01-01"));
      await this.run();
    },
  },
  methods: {
    initExecutedIds() {
      // It would be better if we could store a set
      // But since we cant, we will use a hashmap
      this.db.set("executedIds", {});
    },
    addExecutedId(id) {
      const executedIds = this.db.get("executedIds");
      executedIds[id] = true;
      this.db.set("executedIds", executedIds);
    },
    isIdExecuted(id) {
      const executedIds = this.db.get("executedIds");
      return executedIds[id];
    },
    setLastExecution(date) {
      this.db.set("lastExecution", date);
    },
    getLastExecution() {
      return this.db.get("lastExecution");
    },
    getMeta({
      id,
      name,
    }) {
      return {
        id,
        summary: name,
        ts: Date.now(),
      };
    },
    async execute() {
      throw new Error("Not implemented");
    },
  },
  async run() {
    await this.execute();
  },
};
