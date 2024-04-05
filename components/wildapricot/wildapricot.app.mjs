import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "wildapricot",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The unique identifier for the account",
      async options() {
        const accounts = await this.listAccounts();
        return accounts?.map(({
          Id: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier for the contact",
      async options({
        accountId, page,
      }) {
        const limit = constants.DEFAULT_LIMIT;
        const contacts = await this.listContacts({
          accountId,
          params: {
            "$top": limit,
            "$skip": page * limit,
          },
        });
        return contacts?.map(({
          Id: value, DisplayName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The unique identifier for the event",
      async options({
        accountId, page,
      }) {
        const limit = constants.DEFAULT_LIMIT;
        const { Events: events } = await this.listEvents({
          accountId,
          params: {
            "$top": limit,
            "$skip": page * limit,
          },
        });
        return events?.map(({
          Id: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    eventRegistrationId: {
      type: "string",
      label: "Event Registration ID",
      description: "The unique identifier for the event registration",
      async options({
        accountId, eventId, contactId,
      }) {
        if (!eventId && !contactId) {
          throw new Error("Must provide one of Contact ID or Event ID");
        }
        const eventRegistrations = await this.listEventRegistrations({
          accountId,
          params: {
            contactId,
            eventId,
          },
        });
        return eventRegistrations?.map(({
          Id: value, DisplayName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    eventRegistrationTypeId: {
      type: "string",
      label: "Event Registration Type ID",
      description: "The unique identifier for the event registration type",
      async options({
        accountId, eventId,
      }) {
        const types = await this.listEventRegistrationTypes({
          accountId,
          params: {
            eventId,
          },
        });
        return types?.map(({
          Id: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.wildapricot.org/v2.2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    listAccounts(opts = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...opts,
      });
    },
    async listContacts({
      accountId, params, ...opts
    }) {
      const path = `/accounts/${accountId}/contacts`;
      const { ResultId: resultId } = await this._makeRequest({
        path,
        params: {
          ...params,
          "$async": true,
        },
        ...opts,
      });
      // poll until contacts are retrieved
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      let complete, results;
      do {
        let {
          Contacts: contacts, State: state,
        } = await this._makeRequest({
          path,
          accountId,
          params: {
            resultId,
          },
        });
        results = contacts;
        complete = state === "Complete";
        await timer(1000);
      } while (!complete);
      return results;
    },
    listContactFields({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/contactfields`,
        ...opts,
      });
    },
    listEvents({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/events`,
        ...opts,
      });
    },
    listEventRegistrations({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/eventregistrations`,
        ...opts,
      });
    },
    listEventRegistrationTypes({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/EventRegistrationTypes`,
        ...opts,
      });
    },
    listPayments({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/payments`,
        ...opts,
      });
    },
    createContact({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/contacts`,
        method: "POST",
        ...opts,
      });
    },
    updateContact({
      accountId, contactId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/contacts/${contactId}`,
        method: "PUT",
        ...opts,
      });
    },
    createEventRegistration({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/eventregistrations`,
        method: "POST",
        ...opts,
      });
    },
    updateEventRegistration({
      accountId, eventRegistrationId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/eventregistrations/${eventRegistrationId}`,
        method: "PUT",
        ...opts,
      });
    },
    deleteEventRegistration({
      accountId, eventRegistrationId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/eventregistrations/${eventRegistrationId}`,
        method: "DELETE",
        ...opts,
      });
    },
  },
};
