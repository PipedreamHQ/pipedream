import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "printnode",
  propDefinitions: {
    printerId: {
      type: "integer",
      label: "Printer ID",
      description: "The ID of the printer you wish to print to or retrieve data about.",
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
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Basic ${Buffer.from(`${this.$auth.api_key}:`).toString("base64")}`,
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
    async getPrinter({ printerId }) {
      return this._makeRequest({
        path: `/printers/${printerId}`,
      });
    },
    async listPrintJobs({ dateRange }) {
      const params = {};
      if (dateRange) {
        params.dateRange = dateRange.join(",");
      }
      return this._makeRequest({
        path: "/printjobs",
        params,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
