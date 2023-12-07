import { axios } from "@pipedream/platform";

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
    documentContent: {
      type: "string",
      label: "Document Content",
      description: "The base64-encoded content of the document you wish to print.",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "The type of content you are sending. Either `pdf_uri`, `pdf_base64`, `raw_uri`, or `raw_base64`.",
      options: [
        {
          label: "PDF URI",
          value: "pdf_uri",
        },
        {
          label: "PDF Base64",
          value: "pdf_base64",
        },
        {
          label: "RAW URI",
          value: "raw_uri",
        },
        {
          label: "RAW Base64",
          value: "raw_base64",
        },
      ],
    },
    dateRange: {
      type: "string[]",
      label: "Date Range",
      description: "An optional date range for the print jobs to list.",
      optional: true,
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
    async createPrintJob({
      printerId, title, contentType, content, source, options, expireAfter, qty, authentication,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/printjobs",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          printerId,
          title,
          contentType,
          content,
          source,
          options,
          expireAfter,
          qty,
          authentication,
        },
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
  },
};
