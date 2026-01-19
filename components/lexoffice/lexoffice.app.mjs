import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lexoffice",
  propDefinitions: {
    voucherId: {
      type: "string",
      label: "Voucher ID",
      description: "The ID of the associated voucher",
      optional: true,
      async options({ page }) {
        const { content } = await this.listVouchers({
          params: {
            page,
            voucherType: "any",
            voucherStatus: "any",
          },
        });

        return content.map(({
          id: value, voucherType, voucherStatus,
        }) => ({
          label: `${voucherType} (${voucherStatus}) - ${value}`,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.lexware.io/v1";
    },
    _headers(headers = {}) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Accept": "application/json",
      };
    },
    _makeRequest({
      $ = this,
      path,
      headers,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...opts,
      });
    },
    listVouchers(opts = {}) {
      return this._makeRequest({
        path: "/voucherlist",
        ...opts,
      });
    },
    uploadFile({
      voucherId,
      ...opts
    } = {}) {
      const path = voucherId
        ? `/vouchers/${voucherId}/files`
        : "/files";
      return this._makeRequest({
        path,
        method: "POST",
        ...opts,
      });
    },
  },
};
