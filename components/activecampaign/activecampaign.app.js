const axios = require("axios");
const events = [
  { value: "forward", label: "Campaign forwarded" },
  { value: "open", label: "Campaign opened" },
  { value: "share", label: "Campaign shared" },
  { value: "sent", label: "Campaign starts sending" },
  { value: "subscribe", label: "Contact added" },
  { value: "subscriber_note", label: "Contact note added" },
  { value: "contact_tag_added", label: "Contact tag added" },
  { value: "contact_tag_removed", label: "Contact tag removed" },
  { value: "unsubscribe", label: "Contact unsubscription" },
  { value: "update", label: "Contact updated" },
  { value: "deal_add", label: "Deal added" },
  { value: "deal_note_add", label: "Deal note added" },
  { value: "deal_pipeline_add", label: "Deal pipeline added" },
  { value: "deal_stage_add", label: "Deal stage added" },
  { value: "deal_task_add", label: "Deal task added" },
  { value: "deal_task_complete", label: "Deal task completed" },
  { value: "deal_tasktype_add", label: "Deal task type added" },
  { value: "deal_update", label: "Deal updated" },
  { value: "bounce", label: "Email bounces" },
  { value: "reply", label: "Email replies" },
  { value: "click", label: "Link clicked" },
  { value: "list_add ", label: "List added" },
  { value: "sms_reply", label: "SMS reply" },
  { value: "sms_sent ", label: "SMS sent" },
  { value: "sms_unsub", label: "SMS unsubscribe" },
];

module.exports = {
  type: "app",
  app: "activecampaign",
  propDefinitions: {
    eventType: {
      type: "string",
      label: "Event Type",
      description: "Emit events for the selected event type.",
      options: events,
    },
    automations: {
      type: "string[]",
      label: "Automations",
      optional: true,
      async options({ page, prevContext }) {
        const limit = 100;
        let offset = prevContext.offset || 0;
        const results = await this.listAutomations(limit, offset);
        const options = [];
        for (const automation of results.automations)
          options.push({ label: automation.name, value: automation.id });
        return {
          options,
          context: { limit, offset: offset + limit },
        };
      },
    },
    campaigns: {
      type: "string[]",
      label: "Campaigns",
      optional: true,
      async options({ page, prevContext }) {
        const limit = 100;
        let offset = prevContext.offset || 0;
        const results = await this.listCampaigns(limit, offset);
        const options = [];
        for (const campaign of results.campaigns)
          options.push({ label: campaign.name, value: campaign.id });
        return {
          options,
          context: { limit, offset: offset + limit },
        };
      },
    },
    contacts: {
      type: "string[]",
      label: "Contacts",
      optional: true,
      async options({ page, prevContext }) {
        const limit = 100;
        let offset = prevContext.offset || 0;
        const results = await this.listContacts(limit, offset);
        const options = [];
        for (const contact of results.contacts)
          options.push({ label: contact.email, value: contact.id });
        return {
          options,
          context: { limit, offset: offset + limit },
        };
      },
    },
    deals: {
      type: "string[]",
      label: "Deals",
      optional: true,
      async options({ page, prevContext }) {
        const limit = 100;
        let offset = prevContext.offset || 0;
        const results = await this.listDeals(limit, offset);
        const options = [];
        for (const deal of results.deals)
          options.push({ label: deal.title, value: deal.id });
        return {
          options,
          context: { limit, offset: offset + limit },
        };
      },
    },
  },
  methods: {
    _getHeaders() {
      return { "Api-Token": this.$auth.api_key };
    },
    async createHook(events, url, sources) {
      const config = {
        method: "POST",
        url: `${this.$auth.base_url}/api/3/webhooks`,
        headers: this._getHeaders(),
        data: {
          webhook: {
            name: "Pipedream Hook",
            url,
            events,
            sources,
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
        url: url || `${this.$auth.base_url}${endpoint}`,
        headers: this._getHeaders(),
        params,
      };
      if (limit) config.params.limit = limit;
      if (offset) config.params.offset = offset;
      return await axios(config);
    },
    async getContactLists(limit, offset, url) {
      return (await this._makeGetRequest("", limit, offset, {}, url)).data;
    },
    async getList(id) {
      return (await this._makeGetRequest(`/api/3/lists/${id}`)).data;
    },
    async listAutomations(limit, offset) {
      return (await this._makeGetRequest("/api/3/automations", limit, offset))
        .data;
    },
    async listCampaigns(limit, offset) {
      return (await this._makeGetRequest("/api/3/campaigns", limit, offset))
        .data;
    },
    async listContacts(limit, offset) {
      return (await this._makeGetRequest("/api/3/contacts", limit, offset))
        .data;
    },
    async listDeals(limit, offset) {
      return (await this._makeGetRequest("/api/3/deals", limit, offset)).data;
    },
    async listTasks(limit, offset, params) {
      return (
        await this._makeGetRequest("/api/3/dealTasks", limit, offset, params)
      ).data;
    },
  },
};