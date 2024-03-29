import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "loopify",
  propDefinitions: {
    eventType: {
      type: "integer",
      label: "Event Type",
      description: "The type of event to emit",
    },
    contact: {
      type: "object",
      label: "Contact",
      description: "The contact details",
      options: async function (opts) {
        // To be implemented: logic to retrieve contact options.
        // This is a placeholder to show where you would call an API to get contacts.
        return [];
      },
    },
    apiEntry: {
      type: "string",
      label: "API Entry Block",
      description: "The block to which the contact should be added in a Loopify flow",
      options: async function (opts) {
        // To be implemented: logic to retrieve API Entry Block options.
        // This is a placeholder to show where you would call an API to get API entry blocks.
        return [];
      },
    },
    flowId: {
      type: "string",
      label: "Flow ID",
      description: "The ID of the flow",
      options: async function (opts) {
        // To be implemented: logic to retrieve flow ID options.
        // This is a placeholder to show where you would call an API to get flow IDs.
        return [];
      },
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.loopify.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async emitEvent({ eventType }) {
      // Logic to emit event based on eventType
      // Placeholder for actual event emission logic
    },
    async addContactToApiEntryBlock({
      contact, apiEntry, flowId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/flows/${flowId}/new-entry`,
        data: {
          contactIds: [
            contact.id,
          ],
          segment: {
            filterGroups: [
              {
                index: 0,
                type: "contact",
                conjunction: "AND",
                joinType: "some",
                filters: [
                  {
                    index: 0,
                    source: contact.source,
                    sourceType: contact.sourceType,
                    comparator: "contains",
                    patternType: contact.patternType,
                    pattern: contact.pattern,
                  },
                ],
                excludeEventResult: true,
              },
            ],
          },
        },
      });
    },
    async createOrUpdateContact({ contact }) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data: contact,
      });
    },
  },
  version: "0.0.{{ts}}",
};
