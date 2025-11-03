import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "elastic_email",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email",
    },
    listNames: {
      type: "string[]",
      label: "List Names",
      description: "Names of the mailing lists",
      optional: true,
      async options({ page }) {
        const data = await this.listLists({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({ ListName }) => ListName);
      },
    },
    templateName: {
      type: "string",
      label: "Template Name",
      description: "The name of template",
      async options({ page }) {
        const data = await this.listTemplates({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
            scopeType: "Personal",
          },
        });

        return data.map(({ Name }) => Name);
      },
    },
    unsubscribeEmails: {
      type: "string[]",
      label: "Email Addresses",
      description: "A list of email addresses  to unsubscribe",
    },
    campaign: {
      type: "string",
      label: "Campaign",
      description: "The name of a campaign",
      async options({ page }) {
        const campaigns = await this.listCampaigns({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });
        return campaigns?.map(({ Name: name }) => name) || [];
      },
    },
    contact: {
      type: "string",
      label: "Contact",
      description: "The email address of a contact",
      async options({ page }) {
        const contacts = await this.listContacts({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });
        return contacts?.map(({ Email: email }) => email) || [];
      },
    },
    segmentNames: {
      type: "string[]",
      label: "Segment Names",
      description: "The name of a segment",
      async options({ page }) {
        const segments = await this.listSegments({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });
        return segments?.map(({ Name: name }) => name) || [];
      },
    },
    campaignStatus: {
      type: "string",
      label: "Campaign Status",
      description: "The status of a campaign",
      options: [
        "Deleted",
        "Active",
        "Processing",
        "Sending",
        "Completed",
        "Paused",
        "Cancelled",
        "Draft",
      ],
    },
    contactStatus: {
      type: "string",
      label: "Contact Status",
      description: "The status of a contact",
      options: [
        "Transactional",
        "Engaged",
        "Active",
        "Bounced",
        "Unsubscribed",
        "Abuse",
        "Inactive",
        "Stale",
        "NotConfirmed",
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.elasticemail.com/v4";
    },
    _headers() {
      return {
        "X-ElasticEmail-ApiKey": this.$auth.api_key,
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
    getCampaign({
      campaign, ...opts
    }) {
      return this._makeRequest({
        path: `/campaigns/${campaign}`,
        ...opts,
      });
    },
    loadEvents(opts = {}) {
      return this._makeRequest({
        path: "/events",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        path: "/lists",
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...opts,
      });
    },
    listSegments(opts = {}) {
      return this._makeRequest({
        path: "/segments",
        ...opts,
      });
    },
    sendBulkEmails(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/emails",
        ...opts,
      });
    },
    addContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    unsubscribeContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/suppressions/unsubscribes",
        ...opts,
      });
    },
    createCampaign(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/campaigns",
        ...opts,
      });
    },
    updateCampaign({
      campaign, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/campaigns/${campaign}`,
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    updateContact({
      contact, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contact}`,
        ...opts,
      });
    },
    createSegment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/segments",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.offset = LIMIT * page;
        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        page++;
        hasMore = data.length;

      } while (hasMore);
    },
  },
};
