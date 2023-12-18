import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "whop",
  propDefinitions: {
    affiliateCode: {
      type: "string",
      label: "Affiliate Code",
      description: "The code to apply as the affiliate for the transaction.",
      async options({ page }) {
        const { data } = await this.listMembers({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          username: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    membershipId: {
      type: "string",
      label: "Membership ID",
      description: "The unique identifier for the membership.",
      async options({ page }) {
        const { data } = await this.listMemberships({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, email, plan,
        }) => ({
          label: `${email} - ${plan}`,
          value,
        }));
      },
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "The metadata that will be attached to the Membership upon successful purchase.",
    },
    planId: {
      type: "string",
      label: "Plan Id",
      description: "The ID of the plan that the checkout session is associated with.",
      async options({ page }) {
        const { data } = await this.listPlans({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, internal_notes: label, product, plan_type,
        }) => ({
          label: label || `${product} - ${plan_type}`,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.whop.com/api/v2";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    createPromoCode(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/promo_codes",
        ...opts,
      });
    },
    createCheckoutSession(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/checkout_sessions",
        ...opts,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
      });
    },
    listMembers(opts = {}) {
      return this._makeRequest({
        path: "/members",
        ...opts,
      });
    },
    listMemberships(opts = {}) {
      return this._makeRequest({
        path: "/memberships",
        ...opts,
      });
    },
    listPlans(opts = {}) {
      return this._makeRequest({
        path: "/plans",
        ...opts,
      });
    },
    terminateMembership({ membershipId }) {
      return this._makeRequest({
        method: "POST",
        path: `/memberships/${membershipId}/terminate`,
      });
    },
  },
};
