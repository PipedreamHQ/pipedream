import activecampaign from "../../activecampaign.app.mjs";
import constants from "../../common/constants.mjs";
import common from "./base.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    http: "$.interface.http",
    sources: {
      propDefinition: [
        activecampaign,
        "sources",
      ],
    },
  },
  methods: {
    isRelevant() {
      return true;
    },
  },
  hooks: {
    async activate() {
      const sources =
        this.sources?.length > 0
          ? this.sources
          : constants.ALL_SOURCES;
      const hookData = await this.activecampaign.createHook(
        this.getEvents(),
        this.http.endpoint,
        sources,
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
