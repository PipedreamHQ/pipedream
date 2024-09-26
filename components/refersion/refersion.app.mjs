import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "refersion",
  propDefinitions: {
    affiliateId: {
      type: "string",
      label: "Affiliate ID",
      description: "The affiliate's ID",
      async options({ page }) {
        const affiliates = await this.listAllAffiliates(page + 1);
        return affiliates.results.map((affiliate) => ({
          label: `${affiliate.first_name} ${affiliate.last_name}`,
          value: affiliate.id,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.refersion.com/v2";
    },
    _getPublicKey() {
      return this.$auth.public_key;
    },
    _getSecretKey() {
      return this.$auth.secret_key;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Refersion-Public-Key": this._getPublicKey(),
        "Refersion-Secret-Key": this._getSecretKey(),
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return axios(ctx, axiosOpts);
    },
    async createAffiliate(data, ctx = this) {
      return this._makeHttpRequest({
        path: "/affiliate/new",
        method: "POST",
        data,
      }, ctx);
    },
    async getAffiliate(data, ctx = this) {
      return this._makeHttpRequest({
        path: "/affiliate/get",
        method: "POST",
        data,
      }, ctx);
    },
    async listAllAffiliates(page, ctx = this) {
      return this._makeHttpRequest({
        path: "/affiliate/list",
        method: "POST",
        data: {
          page: String(page),
          limit: "100",
        },
      }, ctx);
    },
    async createManualCommissionCredit(data, ctx = this) {
      return this._makeHttpRequest({
        path: "/conversion/manual_credit",
        method: "POST",
        data,
      }, ctx);
    },
  },
};
