import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "microsoft_dynamics_365_sales",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The identifier of a contact",
      optional: true,
      async options() {
        const { value } = await this.listContacts();
        return value?.map(({
          contactid: value, fullname: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    solutionId: {
      type: "string",
      label: "Solution ID",
      description: "Identifier of a solution",
      async options() {
        const { value } = await this.listSolutions();
        return value?.filter(({ isvisible }) => isvisible)?.map(({
          solutionid: value, uniquename, friendlyname,
        }) => ({
          value,
          label: friendlyname || uniquename,
        })) || [];
      },
    },
    opportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "Identifier of an opportunity",
      async options({ prevContext }) {
        const response = await this.listOpportunities({
          url: prevContext?.url,
        });
        return {
          options: response.value?.map(({
            opportunityid: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            url: response["@odata.nextLink"],
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.api_url}/api/data/v9.2`;
    },
    _makeRequest({
      $ = this,
      path,
      url,
      headers,
      ...opts
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "odata-maxversion": "4.0",
          "odata-version": "4.0",
          "content-type": "application/json",
          "If-None-Match": null,
        },
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    getPublisher({
      publisherId, ...opts
    }) {
      return this._makeRequest({
        path: `/publishers(${publisherId})`,
        ...opts,
      });
    },
    getSolution({
      solutionId, ...opts
    }) {
      return this._makeRequest({
        path: `/solutions(${solutionId})`,
        ...opts,
      });
    },
    listSolutions(opts = {}) {
      return this._makeRequest({
        path: "/solutions",
        ...opts,
      });
    },
    listOpportunities(opts = {}) {
      return this._makeRequest({
        path: "/opportunities",
        ...opts,
      });
    },
    listActivityPointers(opts = {}) {
      return this._makeRequest({
        path: "/activitypointers",
        ...opts,
      });
    },
    getEntity({
      entityId, ...opts
    }) {
      return this._makeRequest({
        path: `/${entityId}`,
        ...opts,
      });
    },
    createCustomEntity(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/EntityDefinitions",
        ...opts,
      });
    },
    async *paginate({
      fn, args = {}, max,
    }) {
      let count = 0;
      let nextLink = null;

      do {
        const response = await fn(args);
        const items = response.value;
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        nextLink = response["@odata.nextLink"];
        args.url = nextLink;
      } while (nextLink);
    },
  },
};
