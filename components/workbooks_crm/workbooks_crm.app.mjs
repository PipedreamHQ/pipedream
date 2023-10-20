import {
  axios,
  ConfigurationError,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "workbooks_crm",
  propDefinitions: {
    organizationQueue: {
      type: "string",
      label: "Organisation Queue",
      description: "A list of Organisations assigned to a waiting list",
      async options({ prevContext }) {
        const { start } = prevContext;
        const {
          data,
          total,
        } = await this.getOrganisationQueues({
          params: {
            _start: start || 0,
            _limit: constants.DEFAULT_LIMIT,
            __skip_total_rows: true,
          },
        });
        const options = data.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
        return {
          options,
          context: {
            start: total + start,
          },
        };
      },
    },
    personQueue: {
      type: "string",
      label: "Person Queue",
      description: "A list of People assigned to a waiting list",
      async options({ prevContext }) {
        const { start } = prevContext;
        const {
          data,
          total,
        } = await this.getPersonQueues({
          params: {
            _start: start || 0,
            _limit: constants.DEFAULT_LIMIT,
            __skip_total_rows: true,
          },
        });
        const options = data.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
        return {
          options,
          context: {
            start: total + start,
          },
        };
      },
    },
    personId: {
      type: "string",
      label: "Person ID",
      description: "A list of People",
      async options({ prevContext }) {
        const { start } = prevContext;
        const {
          data,
          total,
        } = await this.getPeople({
          params: {
            _start: start || 0,
            _limit: constants.DEFAULT_LIMIT,
            __skip_total_rows: true,
          },
        });
        const options = data.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
        return {
          options,
          context: {
            start: total + start,
          },
        };
      },
    },
    orderQueue: {
      type: "string",
      label: "Order Queue",
      description: "A list of Orders assigned to a waiting list",
      async options({ prevContext }) {
        const { start } = prevContext;
        const {
          data,
          total,
        } = await this.getOrderQueues({
          params: {
            _start: start || 0,
            _limit: constants.DEFAULT_LIMIT,
            __skip_total_rows: true,
          },
        });
        const options = data.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
        return {
          options,
          context: {
            start: total + start,
          },
        };
      },
    },
  },
  methods: {
    getToken() {
      return this.$auth.authenticity_token;
    },
    getUrl(path, url) {
      return url || `${constants.BASE_URL}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Cookie": `Workbooks-Session=${this.$auth.session_id}`,
        ...headers,
      };
    },
    getAuthData(data) {
      if (!data) {
        return;
      }
      return {
        _authenticity_token: this.getToken(),
        ...data,
      };
    },
    async makeRequest({
      step = this, path, headers, url, data, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        data: this.getAuthData(data),
        ...args,
      };

      try {
        const response = await axios(step, config);
        if (!response.success) {
          throw response;
        }
        return response;
      } catch (error) {
        console.log("Axios request error", JSON.stringify(error, null, 2));
        const { failures = [] } = error;
        throw new ConfigurationError(failures[0] || error);
      }
    },
    defaultPostData() {
      return {
        __method: [
          "POST",
        ],
        id: [
          0,
        ],
        lock_version: [
          0,
        ],
      };
    },
    getOrganisationQueues(args = {}) {
      return this.makeRequest({
        path: "/crm/organisation_queues.api",
        ...args,
      });
    },
    createOrganisation(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/crm/organisations.api",
        ...args,
      });
    },
    getOrganisations(args = {}) {
      return this.makeRequest({
        path: "/crm/organisations.api",
        ...args,
      });
    },
    getPersonQueues(args = {}) {
      return this.makeRequest({
        path: "/crm/person_queues.api",
        ...args,
      });
    },
    createPerson(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/crm/people.api",
        ...args,
      });
    },
    async getPerson({
      criteria, field = "id", filterType = "eq", ...args
    } = {}) {
      const response = await this.getPeople({
        ...args,
        params: {
          "_ff": [
            field,
          ],
          "_ft": [
            filterType,
          ],
          "_fc": [
            criteria,
          ],
          ...args.params,
        },
      });
      return response.data[0];
    },
    async updatePerson({
      personId, ...args
    } = {}) {
      const { lock_version: lockVersion } = await this.getPerson({
        criteria: personId,
      });
      return this.makeRequest({
        ...args,
        method: "put",
        path: "/crm/people.api",
        data: {
          ...args.data,
          lock_version: [
            lockVersion,
          ],
        },
      });
    },
    getPeople(args = {}) {
      return this.makeRequest({
        path: "/crm/people.api",
        ...args,
      });
    },
    getOrderQueues(args = {}) {
      return this.makeRequest({
        path: "/accounting/sales_order_queues.api",
        ...args,
      });
    },
    createOrder(args = {}) {
      return this.makeRequest({
        ...args,
        method: "put",
        path: "/accounting/sales_orders.api",
        data: {
          ...this.defaultPostData(),
          ...args.data,
        },
      });
    },
    getOrders(args = {}) {
      return this.makeRequest({
        path: "/accounting/sales_orders.api",
        ...args,
      });
    },
    async getOrder({
      criteria, field = "id", filterType = "eq", ...args
    } = {}) {
      const response = await this.getOrders({
        ...args,
        params: {
          "_ff": [
            field,
          ],
          "_ft": [
            filterType,
          ],
          "_fc": [
            criteria,
          ],
          ...args.params,
        },
      });
      return response.data[0];
    },
    getWebhookSubscriptions(args = {}) {
      return this.makeRequest({
        path: "/admin/triggers/webhook_subscriptions.api",
        ...args,
      });
    },
    async getWebhookSubscription({
      criteria, field = "id", filterType = "eq", ...args
    } = {}) {
      const response = await this.getWebhookSubscriptions({
        ...args,
        params: {
          "_ff": [
            field,
          ],
          "_ft": [
            filterType,
          ],
          "_fc": [
            criteria,
          ],
          ...args.params,
        },
      });
      return response.data[0];
    },
    createWebhookSubscription(args = {}) {
      return this.makeRequest({
        ...args,
        method: "put",
        path: "/admin/triggers/webhook_subscriptions.api",
        data: {
          ...this.defaultPostData(),
          ...args.data,
        },
      });
    },
    async deleteWebhookSubscription({
      webhookId, ...args
    } = {}) {
      const { lock_version: lockVersion } = await this.getWebhookSubscription({
        criteria: webhookId,
      });
      return this.makeRequest({
        ...args,
        method: "put",
        path: "/admin/triggers/webhook_subscriptions.api",
        data: {
          __method: [
            "DELETE",
          ],
          id: [
            webhookId,
          ],
          lock_version: [
            lockVersion,
          ],
          ...args.data,
        },
      });
    },
    getCreditNotes(args = {}) {
      return this.makeRequest({
        path: "/accounting/credit_notes.api",
        ...args,
      });
    },
    getInvoices(args = {}) {
      return this.makeRequest({
        path: "/accounting/invoices.api",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      max = constants.MAX_RESOURCES,
    }) {
      let start = 0;
      let resourcesCount = 0;
      let nextResources;
      let total = 0;

      while (true) {
        try {
          const response =
            await resourceFn({
              ...resourceFnArgs,
              params: {
                ...resourceFnArgs?.params,
                _limit: constants.DEFAULT_LIMIT,
                _start: start,
                __skip_total_rows: true,
              },
            });
          total = response.total;
          nextResources = response.data;
        } catch (error) {
          console.log("resourceFn error", error);
          return;
        }

        if (nextResources?.length < 1) {
          return;
        }

        start += total;

        for (const resource of nextResources) {
          resourcesCount += 1;
          yield resource;
        }

        if (resourcesCount >= max) {
          return;
        }
      }
    },
  },
};
