import common from "../common/base.mjs";

export default {
  ...common,
  key: "stannp-new-campaign-created",
  name: "New Campaign Created",
  description: "Emit new event when a new campaign is created in Stannp.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(campaign) {
      return `New Campaign: ${campaign.name}`;
    },
    async startEvent(maxResults = 0) {
      const lastId = this._getLastId();

      const response = this.stannp.paginate({
        fn: this.stannp.listCampaigns,
        maxResults,
      });

      let responseArray = [];

      for await (const item of response) {
        if (item.id <= lastId) break;
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastId(responseArray[0].id);

      for (const item of responseArray.reverse()) {
        this.$emit(item, this.generateMeta(item));
      }
    },
  },
};
