import { axios } from "@pipedream/platform";
import inflection from "inflection";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "activecampaign",
  propDefinitions: {
    eventType: {
      type: "string",
      label: "Event Type",
      description:
        "Emit events for the selected event type. See the official docs for more information on event types. https://developers.activecampaign.com/page/webhooks",
      async options() {
        const { webhookEvents } = await this.listWebhookEvents();
        return webhookEvents.map((e) => ({
          label: inflection.humanize(e),
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
      options: constants.ALL_SOURCES,
    },
    automations: {
      type: "string[]",
      label: "Automations",
      description:
        "Emit events for the selected webhooks only. Leave blank to watch all available webhooks.",
      optional: true,
      async options({ prevContext }) {
        return this.listAutomationOptions(prevContext);
      },
    },
    campaigns: {
      type: "string[]",
      label: "Campaigns",
      description:
        "Watch the selected campaigns for updates. Leave blank to watch all available campaigns.",
      optional: true,
      async options({ prevContext }) {
        return this.listCampaignOptions(prevContext);
      },
    },
    contacts: {
      type: "string[]",
      label: "Contacts",
      description:
        "Watch the selected contacts for updates. Leave blank to watch all available contacts.",
      optional: true,
      async options({ prevContext }) {
        return this.listContactOptions(prevContext);
      },
    },
    deals: {
      type: "string[]",
      label: "Deals",
      description:
        "Watch the selected deals for updates. Leave blank to watch all available deals.",
      optional: true,
      async options({ prevContext }) {
        this.listDealOptions(prevContext);
      },
    },
    lists: {
      type: "string[]",
      label: "Lists",
      description:
        "Watch the selected lists for updates. Leave blank to watch all available lists.",
      optional: true,
      async options({ prevContext }) {
        return this.listListOptions(prevContext);
      },
    },
    accountName: {
      type: "string",
      label: "Account's name",
      description: "The name of the account to create.",
    },
    accountUrl: {
      type: "string",
      label: "Account's URL",
      description: "The URL of the account to create.",
      optional: true,
    },
    contactEmail: {
      type: "string",
      label: "Contact's email",
      description: "Email address of the new contact. Example: `test@example.com`",
    },
    contactFirstName: {
      type: "string",
      label: "Contact's first name",
      description: "First name of the new contact. Example: `John`",
      optional: true,
    },
    contactLastName: {
      type: "string",
      label: "Contact's last name",
      description: "Last name of the new contact. Example: `Doe`",
      optional: true,
    },
    contactPhone: {
      type: "string",
      label: "Contact's phone",
      description: "Phone number of the contact.",
      optional: true,
    },
    dealTitle: {
      type: "string",
      label: "Deal's title",
      description: "The title of the deal to create.",
    },
    dealDescription: {
      type: "string",
      label: "Deal's description",
      description: "The description of the deal to create.",
      optional: true,
    },
    dealValue: {
      type: "integer",
      label: "Deal's value",
      description: "Deal's value in cents. (i.e. $456.78 => `45678`). Must be greater than or equal to zero.",
      default: 100,
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
    },
    dealCurrency: {
      type: "string",
      label: "Deal's currency",
      description: "Deal's currency in 3-digit ISO format, lowercased.",
      options: constants.CURRENCY_OPTIONS,
      default: "usd",
    },
    dealPipelineId: {
      type: "string",
      label: "Deal's pipeline ID",
      description: "The ID of the group to add the deal to.",
      async options({ prevContext }) {
        return this.listPipelineOptions(prevContext);
      },
    },
  },
  methods: {
    _getHeaders() {
      return {
        "Api-Token": this.$auth.api_key,
      };
    },
    async makeRequest(customConfig) {
      const {
        $ = this,
        url,
        path,
        method,
        params,
        data,
        ...otherConfig
      } = customConfig;

      const BASE_URL = this.$auth.base_url;

      const config = {
        method,
        url: url || `${BASE_URL}${constants.VERSION_PATH}${path}`,
        headers: this._getHeaders(),
        params,
        data,
        ...otherConfig,
      };
      return axios($, config);
    },
    async createAccount(args = {}) {
      return this.makeRequest({
        method: "POST",
        path: "/accounts",
        ...args,
      });
    },
    async createContact(args = {}) {
      return this.makeRequest({
        method: "POST",
        path: "/contacts",
        ...args,
      });
    },
    async createOrUpdateContact(args = {}) {
      return this.makeRequest({
        method: "POST",
        path: "/contact/sync",
        ...args,
      });
    },
    async createHook(events, url, sources, listid = null) {
      const componentId = process.env.PD_COMPONENT;
      return this.makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          webhook: {
            name: `Pipedream Hook (${componentId})`,
            url,
            events,
            sources,
            listid,
          },
        },
      });
    },
    async deleteHook(hookId) {
      return this.makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
      });
    },
    async getList(id) {
      return this.makeRequest({
        path: `/lists/${id}`,
      });
    },
    async listPipelines(args = {}) {
      return this.makeRequest({
        path: "/dealGroups",
        ...args,
      });
    },
    async listAutomations(args = {}) {
      return this.makeRequest({
        path: "/automations",
        ...args,
      });
    },
    async listCampaigns(args = {}) {
      return this.makeRequest({
        path: "/campaigns",
        ...args,
      });
    },
    async listContacts(args = {}) {
      return this.makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    async listDeals(args = {}) {
      return this.makeRequest({
        path: "/deals",
        ...args,
      });
    },
    async listLists(args = {}) {
      return this.makeRequest({
        path: "/lists",
        ...args,
      });
    },
    async listWebhookEvents(args = {}) {
      return this.makeRequest({
        path: "/webhook/events",
        ...args,
      });
    },
    async listAccounts(args = {}) {
      return this.makeRequest({
        path: "/accounts",
        ...args,
      });
    },
    async listCalendarFeeds(args = {}) {
      return this.makeRequest({
        path: "/calendars",
        ...args,
      });
    },
    async listContactCustomFields(args = {}) {
      return this.makeRequest({
        path: "/fields",
        ...args,
      });
    },
    async listPipelineOptions(prevContext) {
      return this.paginateResources({
        requestFn: this.listPipelines,
        requestArgs: {
          params: {
            offset: prevContext.offset || 0,
          },
        },
        resourceName: "dealGroups",
        mapper: ({
          id, title,
        }) => ({
          label: title,
          value: id,
        }),
      });
    },
    async listListOptions(prevContext) {
      return this.paginateResources({
        requestFn: this.listLists,
        requestArgs: {
          params: {
            offset: prevContext.offset || 0,
          },
        },
        resourceName: "lists",
        mapper: ({
          id, name,
        }) => ({
          label: name,
          value: id,
        }),
      });
    },
    async listCampaignOptions(prevContext) {
      return this.paginateResources({
        requestFn: this.listCampaigns,
        requestArgs: {
          params: {
            offset: prevContext.offset || 0,
          },
        },
        resourceName: "campaigns",
        mapper: ({
          id, name,
        }) => ({
          label: name,
          value: id,
        }),
      });
    },
    async listAutomationOptions(prevContext) {
      return this.paginateResources({
        requestFn: this.listAutomations,
        requestArgs: {
          params: {
            offset: prevContext.offset || 0,
          },
        },
        resourceName: "automations",
        mapper: ({
          id, name,
        }) => ({
          label: name,
          value: id,
        }),
      });
    },
    async listContactOptions(prevContext) {
      return this.paginateResources({
        requestFn: this.listContacts,
        requestArgs: {
          params: {
            offset: prevContext.offset || 0,
          },
        },
        resourceName: "contacts",
        mapper: ({
          id, email,
        }) => ({
          label: email,
          value: id,
        }),
      });
    },
    async listDealOptions(prevContext) {
      return this.paginateResources({
        requestFn: this.listDeals,
        requestArgs: {
          params: {
            offset: prevContext.offset || 0,
          },
        },
        resourceName: "deals",
        mapper: ({
          id, title,
        }) => ({
          label: title,
          value: id,
        }),
      });
    },
    async paginateResources({
      requestFn, requestArgs, resourceName, mapper = (resource) => resource,
    }) {
      const limit = requestArgs.params?.limit ?? constants.DEFAULT_LIMIT;
      const offset = (requestArgs.params?.offset ?? 0) + limit;

      const {
        [resourceName]: resources,
        meta,
      } =
        await requestFn({
          ...requestArgs,
          params: {
            limit,
            ...requestArgs.params,
          },
        });

      return {
        options: resources.map(mapper),
        context: {
          offset,
          total: meta.total,
        },
      };
    },
  },
};
