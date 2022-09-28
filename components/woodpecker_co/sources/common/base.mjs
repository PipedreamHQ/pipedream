import woodpecker from "../../woodpecker_co.app.mjs";

export default {
  props: {
    woodpecker,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async deactivate() {
      await this.woodpecker.deleteHook(
        this.http.endpoint,
        this.getAction(),
      );
    },
    async activate() {
      await this.woodpecker.createHook(
        this.http.endpoint,
        this.getAction(),
      );
    },
  },
  async run({ body }) {
    const [
      { timestamp },
    ] = body;

    this.$emit(body, {
      id: `${body.id}_${timestamp}`,
      summary: this.getSummary(body),
      ts: timestamp,
    });
  },
};
