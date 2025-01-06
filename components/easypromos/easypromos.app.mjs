import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "easypromos",
  version: "0.0.{{ts}}",
  propDefinitions: {
    userid: {
      type: "integer",
      label: "User ID",
      description: "The ID of the user",
      async options() {
        const users = await this.getUsers();
        return users.map((user) => ({
          label: user.name,
          value: user.id,
        }));
      },
    },
    promotionid: {
      type: "integer",
      label: "Promotion ID",
      description: "The ID of the promotion",
      async options() {
        const promotions = await this.getPromotions();
        return promotions.map((promotion) => ({
          label: promotion.name,
          value: promotion.id,
        }));
      },
    },
  },
  methods: {
    // Existing method
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    // Base URL for the Easypromos API
    _baseUrl() {
      return "https://api.easypromos.com";
    },
    // Helper method to make HTTP requests
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        data,
        params,
        headers = {},
        ...otherOpts
      } = opts;

      const requestHeaders = {
        ...headers,
        Authorization: `Bearer ${this.$auth.access_token}`,
      };

      if (data) {
        requestHeaders["Content-Type"] = "application/json";
      }

      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: requestHeaders,
        data,
        params,
        ...otherOpts,
      });
    },
    // Method to fetch users
    async getUsers(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/users",
        params: opts.params,
      });
    },
    // Method to fetch promotions
    async getPromotions(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/promotions",
        params: opts.params,
      });
    },
    // Emit event when a user earns or spends coins
    async emitCoinTransaction({
      userid, promotionid,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/coin-transactions",
        data: {
          user_id: userid,
          promotion_id: promotionid,
        },
      });
    },
    // Emit event when a registered user submits participation
    async emitParticipationSubmission({ promotionid }) {
      return this._makeRequest({
        method: "POST",
        path: "/participations",
        data: {
          promotion_id: promotionid,
        },
      });
    },
    // Emit event when a user registers in the promotion
    async emitUserRegistration({ promotionid }) {
      return this._makeRequest({
        method: "POST",
        path: "/registrations",
        data: {
          promotion_id: promotionid,
        },
      });
    },
  },
};
