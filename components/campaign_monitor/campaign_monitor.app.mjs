import { axios } from "@pipedream/platform";
const DEFAULT_PAGE_SIZE = 1000;

export default {
  type: "app",
  app: "campaign_monitor",
  propDefinitions: {
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client",
      async options() {
        const clients = await this.listClients();
        return clients?.map(({
          ClientID: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of a sent or scheduled campaign",
      async options({ clientId }) {
        const campaigns = await this.listCampaigns(clientId);
        return campaigns?.map(({
          CampaignID: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    subscriber: {
      type: "string",
      label: "Subscriber",
      description: "The email address of the subscriber",
      async options({
        listId, page,
      }) {
        const { Results: subscribers } = await this.listSubscribers({
          listId,
          params: {
            page: page + 1,
          },
        });
        return subscribers?.map(({
          EmailAddress: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list",
      async options({ clientId }) {
        const lists = await this.listLists({
          clientId,
        });
        return lists?.map(({
          ListID: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    smartEmailId: {
      type: "string",
      label: "Smart Email ID",
      description: "The ID of the smart email to send",
      async options({ clientId }) {
        const emails = await this.listSmartEmails({
          params: {
            clientId,
          },
        });
        return emails?.map(({
          ID: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    consentToTrack: {
      type: "string",
      label: "Consent to Track",
      description: "Whether the subscriber has given permission to have their email opens and clicks tracked",
      options: [
        "Yes",
        "No",
        "Unchanged",
      ],
      default: "Unchanged",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.createsend.com/api/v3.3";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      const requestFn = async () => {
        return await axios($, {
          ...otherOpts,
          url: `${this._baseUrl()}${path}`,
          headers: {
            Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          },
        });
      };
      return await this.retryWithExponentialBackoff(requestFn);
    },
    // The API has been observed to occasionally return -
    // {"Code":120,"Message":"Invalid OAuth Token"}
    // Retry if a 401 Unauthorized or 429 (Rate limit exceeded)
    // status is returned
    async retryWithExponentialBackoff(requestFn, retries = 3, backoff = 500) {
      try {
        return await requestFn();
      } catch (error) {
        if (retries > 0 && (error.response?.status === 401 || error.response?.status === 429)) {
          await new Promise((resolve) => setTimeout(resolve, backoff));
          return this.retryWithExponentialBackoff(requestFn, retries - 1, backoff * 2);
        }
        throw error;
      }
    },
    listClients(opts = {}) {
      return this._makeRequest({
        path: "/clients.json",
        ...opts,
      });
    },
    async listCampaigns(clientId) {
      const scheduledCampaigns = await this.listScheduledCampaigns({
        clientId,
      });
      const { Results: sentCampaigns } = await this.listSentCampaigns({
        clientId,
        params: {
          pagesize: DEFAULT_PAGE_SIZE,
        },
      });
      return [
        ...scheduledCampaigns,
        ...sentCampaigns,
      ];
    },
    listSentCampaigns({
      clientId, ...opts
    }) {
      return this._makeRequest({
        path: `/clients/${clientId}/campaigns.json`,
        ...opts,
      });
    },
    listScheduledCampaigns({
      clientId, ...opts
    }) {
      return this._makeRequest({
        path: `/clients/${clientId}/scheduled.json`,
        ...opts,
      });
    },
    listBounces({
      campaignId, ...opts
    }) {
      return this._makeRequest({
        path: `/campaigns/${campaignId}/bounces.json`,
        ...opts,
      });
    },
    listOpens({
      campaignId, ...opts
    }) {
      return this._makeRequest({
        path: `/campaigns/${campaignId}/opens.json`,
        ...opts,
      });
    },
    listSubscribers({
      listId, ...opts
    }) {
      return this._makeRequest({
        path: `/lists/${listId}/active.json`,
        ...opts,
      });
    },
    listLists({
      clientId, ...opts
    }) {
      return this._makeRequest({
        path: `/clients/${clientId}/lists.json`,
        ...opts,
      });
    },
    listSmartEmails(opts = {}) {
      return this._makeRequest({
        path: "/transactional/smartEmail",
        ...opts,
      });
    },
    sendSmartEmail({
      smartEmailId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/transactional/smartEmail/${smartEmailId}/send`,
        ...opts,
      });
    },
    unsubscribeSubscriber({
      listId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/subscribers/${listId}/unsubscribe.json`,
        ...opts,
      });
    },
    createSubscriber({
      listId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/subscribers/${listId}.json`,
        ...opts,
      });
    },
    async *paginate({
      fn,
      args,
      max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          pagesize: DEFAULT_PAGE_SIZE,
        },
      };
      let hasMore, count = 0;
      do {
        const {
          Results: results, NumberOfPages: numPages,
        } = await fn(args);
        for (const item of results) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        hasMore = args.params.page < numPages;
        args.params.page++;
      } while (hasMore);
    },
  },
};
