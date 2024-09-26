import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "expedy",
  propDefinitions: {
    printerUid: {
      type: "string",
      label: "Printer UID",
      description: "The unique identifier of the designated printer",
      async options() {
        const printers = await this.listPrinters();
        return printers?.map(({
          printer_uid: value, printer_name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.expedy.fr/api/v2";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Accept: "application/json",
          Authorization: `${this.$auth.api_sid}:${this.$auth.api_key}`,
        },
      });
    },
    listPrinters(opts = {}) {
      return this._makeRequest({
        path: "/printers/all",
        ...opts,
      });
    },
    createPrintJob({
      printerUid, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/printers/${printerUid}/print`,
        ...opts,
      });
    },
  },
};
