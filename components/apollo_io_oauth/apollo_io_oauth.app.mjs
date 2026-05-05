import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "apollo_io_oauth",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...this._headers(),
          ...headers,
        },
        ...args,
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "put",
        ...args,
      });
    },
    patch(args = {}) {
      return this._makeRequest({
        method: "patch",
        ...args,
      });
    },
    searchContacts(args = {}) {
      return this.post({
        path: "/contacts/search",
        ...args,
      });
    },
    searchAccounts(args = {}) {
      return this.post({
        path: "/accounts/search",
        ...args,
      });
    },
    createContact(args = {}) {
      return this.post({
        path: "/contacts",
        ...args,
      });
    },
    updateContact({
      contactId, ...args
    }) {
      return this.patch({
        path: `/contacts/${contactId}`,
        ...args,
      });
    },
    createAccount(args = {}) {
      return this.post({
        path: "/accounts",
        ...args,
      });
    },
    updateAccount({
      accountId, ...args
    }) {
      return this.patch({
        path: `/accounts/${accountId}`,
        ...args,
      });
    },
    createOpportunity(args = {}) {
      return this.post({
        path: "/opportunities",
        ...args,
      });
    },
    updateOpportunity({
      opportunityId, ...args
    }) {
      return this.patch({
        path: `/opportunities/${opportunityId}`,
        ...args,
      });
    },
    getOpportunity({
      opportunityId, ...args
    }) {
      return this._makeRequest({
        path: `/opportunities/${opportunityId}`,
        ...args,
      });
    },
    addContactsToSequence({
      sequenceId, ...args
    }) {
      return this.post({
        path: `/emailer_campaigns/${sequenceId}/add_contact_ids`,
        ...args,
      });
    },
    listContactStages(args = {}) {
      return this._makeRequest({
        path: "/contact_stages",
        ...args,
      });
    },
    listAccountStages(args = {}) {
      return this._makeRequest({
        path: "/account_stages",
        ...args,
      });
    },
    listOpportunityStages(args = {}) {
      return this._makeRequest({
        path: "/opportunity_stages",
        ...args,
      });
    },
    listSequences(args = {}) {
      return this.post({
        path: "/emailer_campaigns/search",
        ...args,
      });
    },
    listEmailAccounts(args = {}) {
      return this._makeRequest({
        path: "/email_accounts",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users/search",
        ...args,
      });
    },
    listLabels(args = {}) {
      return this._makeRequest({
        path: "/labels",
        ...args,
      });
    },
    peopleEnrichment(args = {}) {
      return this.post({
        path: "/people/match",
        ...args,
      });
    },
    async *getIterations({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs.params,
              per_page: constants.DEFAULT_LIMIT,
              page,
            },
          });

        const nextResources =
          resourceName && response[resourceName] || response;

        if (!nextResources?.length) {
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return;
          }
        }

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          return;
        }

        page += 1;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
