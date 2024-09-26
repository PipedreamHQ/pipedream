import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "thinkific",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options({ page }) {
        const { items } = await this.listUsers({
          params: {
            page: page + 1,
          },
        });
        return items?.map(({
          id: value, full_name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    courseId: {
      type: "string",
      label: "Course ID",
      description: "The ID of the course",
      async options({ page }) {
        const { items } = await this.listCourses({
          params: {
            page: page + 1,
          },
        });
        return items?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The user's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The user's last name",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The user's email address",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password of the User. If not included, the Express Sign In Link becomes activated for the User. Min length `8`.",
      optional: true,
    },
    roles: {
      type: "string[]",
      label: "Roles",
      description: "The user's roles",
      options: constants.ROLES,
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The user's company name",
      optional: true,
    },
    headline: {
      type: "string",
      label: "Headline",
      description: "The user's headline",
      optional: true,
    },
    affiliateCode: {
      type: "string",
      label: "Affiliate Code",
      description: "User's affiliate code",
      optional: true,
    },
    affiliateCommission: {
      type: "string",
      label: "Affiliate Commission",
      description: "Required only if the User is an affiliate. This should be greater than 0 and less than or equal to 100 if the type is percentage or lower than 9999.99 if is a fixed type.",
      optional: true,
    },
    affiliateCommissionType: {
      type: "string",
      label: "Affiliate Commission Type",
      description: "The affiliate payout type, it can be either `%` (percentage, default) or `$` (fixed amount). Required only if the User is an affiliate.`",
      options: constants.AFFILIATE_COMMISSION_TYPES,
      optional: true,
    },
    affiliatePayoutEmail: {
      type: "string",
      label: "Affiliate Payout Email",
      description: "The email of the User. Required only if the user is an affiliate. Used to pay the User out.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.thinkific.com/api";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "X-Auth-API-Key": `${this.$auth.api_key}`,
          "X-Auth-Subdomain": `${this.$auth.subdomain}`,
          "Content-Type": "application/json",
        },
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v2/webhooks",
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/v2/webhooks/${hookId}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/public/v1/users",
        ...opts,
      });
    },
    listCourses(opts = {}) {
      return this._makeRequest({
        path: "/public/v1/courses",
        ...opts,
      });
    },
    enrollUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/public/v1/enrollments",
        ...opts,
      });
    },
    createUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/public/v1/users",
        ...opts,
      });
    },
    updateUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/public/v1/users/${userId}`,
        ...opts,
      });
    },
  },
};
