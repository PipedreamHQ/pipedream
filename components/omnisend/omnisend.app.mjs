import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "omnisend",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "Select the campaign you'd like to send",
      async options({ page }) {
        const { campaign } = await this.listCampaigns({
          params: {
            offset: page * LIMIT,
            limit: LIMIT,
          },
        });
        return campaign.map(({
          campaignID: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier of the contact to update.",
      async options({ page }) {
        const { contacts } = await this.listContacts({
          params: {
            offset: page * LIMIT,
            limit: LIMIT,
          },
        });
        return contacts.map(({
          contactID: value, identifiers, firstName, lastName,
        }) => ({
          label: `${identifiers[0].id || identifiers[1].id || `${firstName} ${lastName}`}`,
          value,
        }));
      },
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The unique identifier of the event to track.",
      async options({ page }) {
        const events = await this.listEvents({
          params: {
            offset: page * LIMIT,
            limit: LIMIT,
          },
        });
        return events.map(({
          eventID: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.omnisend.com/v3";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "X-API-KEY": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listEvents(opts = {}) {
      return this._makeRequest({
        path: "/events",
        ...opts,
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        path: "/orders",
        ...opts,
      });
    },
    startCampaign({
      campaignId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/campaigns/${campaignId}/actions/start`,
        ...opts,
      });
    },
    updateContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    trackEvent({
      eventId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/events/${eventId}`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, dataField, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;
      let data = [];

      do {
        params.limit = LIMIT;
        params.offset = LIMIT * page;
        page++;

        try {
          const response = await fn({
            params,
          });
          data = response[dataField];

          for (const d of data) {
            yield d;

            if (maxResults && ++count === maxResults) {
              return count;
            }
          }
        } catch (e) {
          return [];
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
