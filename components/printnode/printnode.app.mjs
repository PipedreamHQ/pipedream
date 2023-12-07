import { axios } from "@pipedream/platform";
import { PRINT_CONTENT_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "printnode",
  propDefinitions: {
    printerId: {
      type: "integer",
      label: "Printer ID",
      description: "Select a Printer or provide a custom Printer ID.",
      async options() {
        const printers = await this.listPrinters();
        return printers?.map?.(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "The type of content you are sending. [See the documentation for more information](https://www.printnode.com/en/docs/api/curl#create-printjob-content). You must also specify a `File Path` or `File URL`.",
      options: PRINT_CONTENT_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.printnode.com";
    },
    async _makeRequest({
      $ = this, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        auth: {
          username: this.$auth.api_key,
          password: "",
        },
      });
    },
    async createPrintJob(args) {
      return this._makeRequest({
        method: "POST",
        url: "/printjobs",
        ...args,
      });
    },
    async getPrinter({
      printerId, ...args
    }) {
      return this._makeRequest({
        url: `/printers/${printerId}`,
        ...args,
      });
    },
    async listPrinters() {
      return this._makeRequest({
        url: "/printers",
      });
    },
    async listPrintJobs(args) {
      return this._makeRequest({
        url: "/printjobs",
        ...args,
      });
    },
    async createWebhook(args) {
      return this._makeRequest({
        method: "POST",
        url: "/webhook",
        ...args,
      });
    },
    async deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        url: `/webhook/${webhookId}`,
      });
    },
  },
};
