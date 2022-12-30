import common from "../common/base.mjs";

export default {
  ...common,
  key: "mastodon-new-status",
  name: "New Status",
  description: "Emit new event when a new status is posted to your Profile. [See the docs here](https://docs.joinmastodon.org/methods/accounts/#statuses)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  hooks: {
    async deploy() {
      const statuses = await this.mastodon.listStatuses();
      const sinceId = statuses[0]?.id;
      for (const status of statuses.slice(0, 10).reverse()) {
        const meta = this.generateMeta(status);
        this.$emit(status, meta);
      }
      this._setSinceId(sinceId);
    },
  },
  methods: {
    _getSinceId() {
      return this.db.get("sinceId");
    },
    _setSinceId(sinceId) {
      this.db.set("sinceId", sinceId);
    },
    generateMeta(status) {
      return {
        id: status.id,
        summary: `New status with ID ${status.id}`,
        ts: Date.parse(status.created_at),
      };
    },
  },
  async run() {
    const params = {
      since_id: this._getSinceId(),
    };
    const statuses = await this.mastodon.listStatuses({
      params,
    });
    for (const status of statuses) {
      const meta = this.generateMeta(status);
      this.$emit(status, meta);
    }
    if (statuses[0]?.id) {
      this._setSinceId(statuses[0]?.id);
    }
  },
};
