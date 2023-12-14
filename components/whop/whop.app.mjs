import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "whop",
  propDefinitions: {
    membershipId: {
      type: "string",
      label: "Membership ID",
      description: "The unique identifier for the membership.",
    },
    transactionDetails: {
      type: "object",
      label: "Transaction Details",
      description: "The details of the transaction including payment amount and method.",
    },
    membershipInformation: {
      type: "object",
      label: "Membership Information",
      description: "The information about the user's membership.",
    },
    checkoutData: {
      type: "object",
      label: "Checkout Data",
      description: "The data needed to configure the checkout experience.",
    },
    promotionDetails: {
      type: "object",
      label: "Promotion Details",
      description: "The details of the promotion for generating a promo code.",
    },
    planParameters: {
      type: "object",
      label: "Plan Parameters",
      description: "The parameters for the plan affected by the promo code.",
    },
    userEligibilityDetails: {
      type: "object",
      label: "User Eligibility Details",
      description: "Details for user eligibility for the promo code.",
      optional: true,
    },
    usageLimit: {
      type: "integer",
      label: "Usage Limit",
      description: "The usage limit for the promo code.",
      optional: true,
    },
    expirationDate: {
      type: "string",
      label: "Expiration Date",
      description: "The expiration date for the promo code.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.whop.com/api/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, data, params, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async terminateMembership({ membershipId }) {
      return this._makeRequest({
        method: "POST",
        path: `/memberships/${membershipId}/terminate`,
      });
    },
    async createPromoCode({
      promotionDetails, planParameters, userEligibilityDetails, usageLimit, expirationDate,
    }) {
      const data = {
        ...promotionDetails,
        plan_ids: planParameters.plan_ids,
        new_users_only: userEligibilityDetails?.new_users_only,
        number_of_intervals: usageLimit,
        expiration_datetime: expirationDate,
      };
      return this._makeRequest({
        method: "POST",
        path: "/promo_codes",
        data,
      });
    },
    async createCheckoutSession({
      membershipInformation, checkoutData,
    }) {
      const data = {
        ...checkoutData,
        metadata: membershipInformation,
      };
      return this._makeRequest({
        method: "POST",
        path: "/checkout_sessions",
        data,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
