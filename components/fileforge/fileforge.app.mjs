import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fileforge",
  propDefinitions: {
    files: {
      type: "string[]",
      label: "HTML Files",
      description: "The HTML files to convert to PDF. Each file should be a valid URL or path to an HTML file.",
    },
    test: {
      type: "boolean",
      label: "Test",
      description: "Enable test mode",
      optional: true,
    },
    host: {
      type: "string",
      label: "Host",
      description: "Specifies the host for the PDF generation.",
      optional: true,
    },
    expiresat: {
      type: "string",
      label: "Expires At",
      description: "The expiration timestamp for the PDF in ISO 8601 format",
      optional: true,
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The desired filename for the generated PDF.",
      optional: true,
    },
    allowviewing: {
      type: "boolean",
      label: "Allow Viewing",
      description: "Specifies whether viewing is allowed.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.fileforge.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "POST", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-API-Key": this.$auth.api_key,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    async generatePDF({
      files, test, host, expiresat, filename, allowviewing,
    }) {
      const formData = new FormData();

      // Append files
      files.forEach((file, index) => {
        formData.append("files", file, `file${index}.html`);
      });

      // Construct options object
      const options = {
        ...(test !== undefined && {
          test,
        }),
        ...(host && {
          host,
        }),
        ...(expiresat && {
          expiresat,
        }),
        ...(filename && {
          filename,
        }),
        ...(allowviewing !== undefined && {
          allowviewing,
        }),
      };

      formData.append("options", JSON.stringify(options));

      return this._makeRequest({
        path: "/pdf/generate/",
        data: formData,
        headers: {
          Accept: "application/pdf",
        },
      });
    },
  },
};
