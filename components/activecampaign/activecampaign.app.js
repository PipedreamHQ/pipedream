const axios = require("axios");
const { humanize } = require("inflection");

module.exports = {
  type: "app",
  app: "activecampaign",
  propDefinitions: {
    eventType: {
      type: "string",
      label: "Event Type",
      description:
        "Emit events for the selected event type. See the official docs for more information on event types. https://developers.activecampaign.com/page/webhooks",
      async options({ page }) {
        if (page !== 0) {
          return [];
        }
        const results = await this.listWebhookEvents();
        return results.webhookEvents.map((e) => ({
          label: humanize(e),
          value: e,
        }));
      },
    },
    sources: {
      type: "string[]",
      label: "Sources",
      description:
        "The sources causing an event to occur. Leave blank to include all sources.",
      optional: true,
      default: [],
      options() {
        return this.getAllSources();
      },
    },
    automations: {
      type: "string[]",
      label: "Automations",
      description:
        "Emit events for the selected webhooks only. Leave blank to watch all available webhooks.",
      optional: true,
      default: [],
      async options({ prevContext }) {
        const { results, context } = await this._getNextOptions(
          this.listAutomations.bind(this),
          prevContext
        );
        const options = results.automations.map((a) => ({
          label: a.name,
          value: a.id,
        }));
        return {
          options,
          context,
        };
      },
    },
    campaigns: {
      type: "string[]",
      label: "Campaigns",
      description:
        "Watch the selected campaigns for updates. Leave blank to watch all available campaigns.",
      optional: true,
      default: [],
      async options({ prevContext }) {
        const { results, context } = await this._getNextOptions(
          this.listCampaigns.bind(this),
          prevContext
        );
        const options = results.campaigns.map((c) => ({
          label: c.name,
          value: c.id,
        }));
        return {
          options,
          context,
        };
      },
    },
    contacts: {
      type: "string[]",
      label: "Contacts",
      description:
        "Watch the selected contacts for updates. Leave blank to watch all available contacts.",
      optional: true,
      default: [],
      async options({ prevContext }) {
        const { results, context } = await this._getNextOptions(
          this.listContacts.bind(this),
          prevContext
        );
        const options = results.contacts.map((c) => ({
          label: c.email,
          value: c.id,
        }));
        return {
          options,
          context,
        };
      },
    },
    deals: {
      type: "string[]",
      label: "Deals",
      description:
        "Watch the selected deals for updates. Leave blank to watch all available deals.",
      optional: true,
      default: [],
      async options({ prevContext }) {
        const { results, context } = await this._getNextOptions(
          this.listDeals.bind(this),
          prevContext
        );
        const options = results.deals.map((d) => ({
          label: d.title,
          value: d.id,
        }));
        return {
          options,
          context,
        };
      },
    },
    lists: {
      type: "string[]",
      label: "Lists",
      description:
        "Watch the selected lists for updates. Leave blank to watch all available lists.",
      optional: true,
      default: [],
      async options({ prevContext }) {
        const { results, context } = await this._getNextOptions(
          this.listLists.bind(this),
          prevContext
        );
        const options = results.lists.map((d) => ({
          label: d.name,
          value: d.id,
        }));
        return {
          options,
          context,
        };
      },
    },
  },
  methods: {
    _getHeaders() {
      return { "Api-Token": this.$auth.api_key };
    },
    async createHook(events, url, sources, listid = null) {
      const componentId = process.env.PD_COMPONENT;
      const webhookName = `Pipedream Hook (${componentId})`;
      const config = {
        method: "POST",
        url: `${this.$auth.base_url}/api/3/webhooks`,
        headers: this._getHeaders(),
        data: {
          webhook: {
            name: webhookName,
            url,
            events,
            sources,
            listid,
          },
        },
      };
      return (await axios(config)).data;
    },
    async deleteHook(hookId) {
      const config = {
        method: "DELETE",
        url: `${this.$auth.base_url}/api/3/webhooks/${hookId}`,
        headers: this._getHeaders(),
      };
      await axios(config);
    },
    async _makeGetRequest(
      endpoint,
      limit = null,
      offset = null,
      params = {},
      url = null
    ) {
      const config = {
        method: "GET",
        url: url || `${this.$auth.base_url}/api/3/${endpoint}`,
        headers: this._getHeaders(),
        params,
      };
      if (limit) config.params.limit = limit;
      if (offset) config.params.offset = offset;
      return await axios(config);
    },
    async _getNextOptions(optionsFn, prevContext) {
      const limit = 100;
      const { offset = 0 } = prevContext;
      const results = await optionsFn(limit, offset);
      const context = {
        offset: offset + limit,
      };
      return {
        results,
        context,
      };
    },
    getAllSources() {
      return ["public", "admin", "api", "system"];
    },
    async getList(id) {
      return (await this._makeGetRequest(`lists/${id}`)).data;
    },
    async listAutomations(limit, offset) {
      return (await this._makeGetRequest("automations", limit, offset)).data;
    },
    async listCampaigns(limit, offset) {
      return (await this._makeGetRequest("campaigns", limit, offset)).data;
    },
    async listContacts(limit, offset) {
      return (await this._makeGetRequest("contacts", limit, offset)).data;
    },
    async listDeals(limit, offset) {
      return (await this._makeGetRequest("deals", limit, offset)).data;
    },
    async listLists(limit, offset) {
      return (await this._makeGetRequest("lists", limit, offset)).data;
    },
    async listWebhookEvents() {
      return (await this._makeGetRequest("webhook/events")).data;
    },
  },
};