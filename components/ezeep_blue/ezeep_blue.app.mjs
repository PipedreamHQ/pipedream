import { axios } from "@pipedream/platform";
import FormData from "form-data";

export default {
  type: "app",
  app: "print_service",
  propDefinitions: {
    jobid: {
      type: "string",
      label: "Job ID",
      description: "The unique identifier for the print job",
    },
    printerId: {
      type: "string",
      label: "Printer ID",
      description: "The unique identifier for the printer",
      async options() {
        const printers = await this.listPrinters();
        return printers.map((printer) => ({
          label: printer.name,
          value: printer.id,
        }));
      },
    },
    printType: {
      type: "string",
      label: "Print Type",
      description: "Choose between printing an uploaded file or a file from a URL",
      options: [
        {
          label: "Upload File",
          value: "upload",
        },
        {
          label: "URL File",
          value: "url",
        },
      ],
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the file to print",
      optional: true,
    },
    file: {
      type: "string",
      label: "File Path",
      description: "The local path of the file to upload and print",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.printservice.com";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async sendPrintJob({
      printerId, fileUrl, file, printType,
    }) {
      if (printType === "upload" && file) {
        // Prepare file upload
        const prepareResponse = await this._makeRequest({
          method: "POST",
          path: "/prepare-upload",
        });

        // Upload file
        const formData = new FormData();
        formData.append("file", fs.createReadStream(`/tmp/${file}`));
        const uploadResponse = await this._makeRequest({
          method: "POST",
          path: prepareResponse.uploadUrl,
          headers: formData.getHeaders(),
          data: formData,
        });

        // Print uploaded file
        return this._makeRequest({
          method: "POST",
          path: "/print",
          data: {
            printerId,
            fileId: uploadResponse.fileId,
          },
        });
      } else if (printType === "url" && fileUrl) {
        // Print file from URL
        return this._makeRequest({
          method: "POST",
          path: "/print",
          data: {
            printerId,
            fileUrl,
          },
        });
      } else {
        throw new Error("Invalid print type or missing file information.");
      }
    },
    async listPrinters() {
      return this._makeRequest({
        path: "/printers",
      });
    },
    async checkPrintJobStatus({ jobid }) {
      const status = await this._makeRequest({
        path: `/print-jobs/${jobid}/status`,
      });
      if ([
        0,
        3011,
        2,
      ].includes(status)) {
        return status;
      }
      throw new Error("Print job status is not one of the specified trigger statuses.");
    },
  },
  version: "0.0.{{ts}}",
};
