import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "baremetrics",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "Name of the customer",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Your own notes for this customer. These will be displayed in the profile",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "An email address for this customer",
      optional: true,
    },
    startedAt: {
      type: "string",
      label: "Started At",
      description: "A unix timestamp in seconds of when this subscription started",
    },
    oid: {
      type: "string",
      label: "OID",
      description: "The unique OID",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The ISO code of the currency of this plan",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "How much is this plan? (In cents)",
    },
    interval: {
      type: "string",
      label: "Interval",
      description: "The time interval at which the plan is charged",
      options: constants.INTERVALS,
    },
    intervalCount: {
      type: "string",
      label: "intervalCount",
      description: "intervalCount",
    },
    sourceId: {
      type: "string",
      label: "Source ID",
      description: "ID of the source of the customer",
      async options() {
        const response = await this.getSources({});
        const sourcesIDs = response.sources;
        return sourcesIDs.map(({
          id, provider,
        }) => ({
          value: id,
          label: provider,
        }));
      },
    },
    customerOid: {
      type: "string",
      label: "Customer OID",
      description: "Your unique OID for the customer",
      async options({ sourceId }) {
        const response = await this.getCustomers({
          sourceId,
        });
        const customersOids = response.customers;
        return customersOids.map(({
          oid, name,
        }) => ({
          value: oid,
          label: name,
        }));
      },
    },
    planOid: {
      type: "string",
      label: "Plan OID",
      description: "Your unique OID for the plan",
      async options({ sourceId }) {
        const response = await this.getPlans({
          sourceId,
        });
        const plansOids = response.plans;
        return plansOids.map(({
          oid, name,
        }) => ({
          value: oid,
          label: name,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.baremetrics.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createCustomer({
      source_id, ...args
    }) {
      return this._makeRequest({
        method: "post",
        path: `/${source_id}/customers`,
        ...args,
      });
    },
    async createPlan({
      source_id, ...args
    }) {
      return this._makeRequest({
        method: "post",
        path: `/${source_id}/plans`,
        ...args,
      });
    },
    async createSubscription({
      source_id, ...args
    }) {
      return this._makeRequest({
        method: "post",
        path: `/${source_id}/subscriptions`,
        ...args,
      });
    },
    async updateCustomer({
      source_id, customer_oid, ...args
    }) {
      return this._makeRequest({
        method: "put",
        path: `/${source_id}/customers/${customer_oid}`,
        ...args,
      });
    },
    async getCustomers({
      sourceId: source_id, ...args
    }) {
      return this._makeRequest({
        path: `/${source_id}/customers`,
        ...args,
      });
    },
    async getPlans({
      sourceId: source_id, ...args
    }) {
      return this._makeRequest({
        path: `/${source_id}/plans`,
        ...args,
      });
    },
    async getSources(args = {}) {
      return this._makeRequest({
        path: "/sources",
        ...args,
      });
    },
  },
};
