import woodpecker from "woodpecker-api";
import {
  orderOptions, removeEmpty,
} from "./common/utils.mjs";

export default {
  type: "app",
  app: "woodpecker_co",
  propDefinitions: {
    campaignId: {
      type: "integer",
      label: "Campaign",
      description: "Campaign ID.",
      withLabel: true,
      async options() {
        const campaigns = await this.listCampaigns();
        return campaigns.map((campaign) => ({
          value: campaign.id,
          label: campaign.name,
        }));
      },
    },
    campaignProspectId: {
      type: "integer",
      label: "Id",
      description: "Prospect's ID.",
      async options({
        page, campaignId,
      }) {
        const prospects = await this.listProspects({
          campaign: campaignId,
          $page: page + 1,
          sort: "id",
        });
        return prospects.length
          ? prospects.map((prospect) => ({
            value: prospect.id,
            label: `${prospect.first_name} ${prospect.last_name} (${prospect.email})`,
          }))
          : [];
      },
    },
    sort: {
      type: "string[]",
      label: "Sort",
      description: "Defines the sort order, as well as the field on which sorting will be based. While sorting, use + for ascending order and – for descending order.",
      options: orderOptions,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Prospect's first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Prospect's last name.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Prospect's email address.",
    },
    company: {
      type: "string",
      label: "Company",
      description: "Name of the company prospect is assigned to.",
    },
    industry: {
      type: "string",
      label: "Industry",
      description: "Type of industry prospect is working in.",
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website address.",
    },
    tags: {
      type: "string",
      label: "Tags",
      description: "Prospect's tags.",
    },
    title: {
      type: "string",
      label: "Job Title",
      description: "Prospect's job title.",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Prospect's phone number.",
    },
    address: {
      type: "string",
      label: "Address",
      description: "Prospect's address.",
    },
    city: {
      type: "string",
      label: "City",
      description: "Prospect's city.",
    },
    state: {
      type: "string",
      label: "State",
      description: "Prospect's state or another geographical region he's living in.",
    },
    country: {
      type: "string",
      label: "Country",
      description: "Prospect's country.",
    },
    snippet: {
      type: "object",
      label: "Snippets",
      description: "Any snippet provided for a prospect. Use snippet1, snippet2… snippet15 to sort prospects by chosen custom field.",
      default: {
        "snippet1": "",
      },
    },
  },
  methods: {
    sdk() {
      return woodpecker(this.$auth.api_key);
    },
    async listProspects(params) {
      params = removeEmpty(params);
      return this.sdk().prospects()
        .find(params);
    },
    async createOrUpdateProspect({
      params, campaignId,
    }) {
      params = removeEmpty(params);
      const prospects = this.sdk().prospects();

      if (params.id) {
        return prospects.edit(params, campaignId);
      }
      return prospects.add(params, campaignId);
    },
    async listCampaigns() {
      return this.sdk().campaigns()
        .find();
    },
    async createHook(
      url, event,
    ) {
      return this.sdk().webhooks()
        .subscribe(url, event);
    },
    async deleteHook(
      url, event,
    ) {
      return this.sdk().webhooks()
        .unsubscribe(url, event);
    },
  },
};
