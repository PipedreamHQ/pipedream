import common from "../common/polling.mjs";

export default {
  ...common,
  key: "toneden-new-ad-campaign-created",
  name: "New Ad Campaign Created",
  description: "Emit new event when a new ad campaign is created. [See the documentation](https://developers.toneden.io/reference/get_users-userid-advertising-campaigns)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "campaigns";
    },
    getResourceFn() {
      return this.app.getUserAdCampaigns;
    },
    getResourceFnArgs() {
      return {
        userId: this.userId,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Ad Campaign: ${resource.title}`,
        ts: Date.now(),
      };
    },
  },
};
