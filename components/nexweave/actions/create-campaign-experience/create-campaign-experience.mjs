import common from "../common.mjs";

export default {
  key: "nexweave-create-campaign-experience",
  name: "Create Campaign Experience",
  description: "Generates a campaign experience based on a selected campaign. [See the documentation](https://documentation.nexweave.com/nexweave-api)",
  version: "0.0.1",
  type: "action",
  ...common,
  methods: {
    getSummary() {
      return "Successfully created campaign experience";
    },
    async createExperience(args) {
      return this.nexweave.createCampaignExperience(args);
    },
  },
};
