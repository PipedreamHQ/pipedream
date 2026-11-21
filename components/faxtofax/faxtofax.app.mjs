import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "faxtofax",
  propDefinitions: {
    fromNumber: {
      type: "string",
      label: "From Number",
      description: "Which of your FaxToFax numbers to send from. Leave empty to use your first number.",
      optional: true,
      async options() {
        const { numbers } = await this.listNumbers();
        return numbers.map((n) => ({
          label: n.label
            ? `${n.label} (${n.number})`
            : n.number,
          value: n.number,
        }));
      },
    },
    faxId: {
      type: "string",
      label: "Fax ID",
      description: "The fax ID returned by **Send Fax** or **List Faxes**.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://faxtofax.com/api/v1";
    },
    // FaxToFax REST API v1, authenticated with an API key. Errors come back as { error: "<plain-English message>" }.
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      try {
        return await axios($, {
          url: `${this._baseUrl()}${path}`,
          headers: {
            Authorization: `Bearer ${this.$auth.api_key}`,
          },
          ...opts,
        });
      } catch (err) {
        const message = err?.response?.data?.error;
        throw message
          ? new Error(message)
          : err;
      }
    },
    sendFax(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/faxes",
      });
    },
    getFax({
      faxId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/faxes/${encodeURIComponent(faxId)}`,
      });
    },
    listFaxes(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/faxes",
      });
    },
    listNumbers(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/numbers",
      });
    },
  },
};
