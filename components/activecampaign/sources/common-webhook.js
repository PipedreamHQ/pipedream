const activecampaign = require("../activecampaign.app.js");
const common = require("./common.js");

module.exports = {
  ...common,
  props: {
    ...common.props,
    http: "$.interface.http",
    sources: { propDefinition: [activecampaign, "sources"] },
  },
  methods: {
    isRelevant(body) {
      return true;
    },
  },
  hooks: {
    async activate() {
      const sources =
        this.sources.length > 0
          ? this.sources
          : this.activecampaign.getAllSources();
      const hookData = await this.activecampaign.createHook(
        this.getEvents(),
        this.http.endpoint,
        sources
      );
      this.db.set("hookId", hookData.webhook.id);
    },
    async deactivate() {
      await this.activecampaign.deleteHook(this.db.get("hookId"));
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }

    if (!this.isRelevant(body)) return;

    const meta = await this.getMeta(body);
    this.$emit(body, meta);
  },
};