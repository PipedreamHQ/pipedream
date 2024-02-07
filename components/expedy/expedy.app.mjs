import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "expedy",
  propDefinitions: {
    printerUid: {
      type: "string",
      label: "Printer UID",
      description: "The unique identifier of the designated printer",
    },
    printerMsg: {
      type: "string",
      label: "Printer Message",
      description: "The content to be printed",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.expedy.io/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async sendPrintJob(printerUid, printerMsg) {
      return this._makeRequest({
        method: "POST",
        path: "/printjobs",
        data: {
          printer_uid: printerUid,
          printer_msg: printerMsg,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
