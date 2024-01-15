import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "ezeep_blue",
  propDefinitions: {
    jobid: {
      type: "string",
      label: "Job ID",
      description: "The unique identifier for the print job",
    },
    printerId: {
      type: "string",
      label: "Printer ID",
      description: "The unique identifier for the printer.",
      async options({ page }) {
        const { results } = await this.listPrinters({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });
        return results.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    paperId: {
      type: "string",
      label: "Paper ID",
      description: "Id of of paper size.",
      async options({ printerId }) {
        const [
          { PaperFormats },
        ] = await this.getPrinterProperties({
          params: {
            id: printerId,
          },
        });
        return PaperFormats.map(({
          Id: value, Name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    orientation: {
      type: "integer",
      label: "Orientation",
      description: "Id of orientation mode.",
      async options({ printerId }) {
        const [
          {
            OrientationsSupported, OrientationsSupportedId,
          },
        ] = await this.getPrinterProperties({
          params: {
            id: printerId,
          },
        });
        return OrientationsSupported.map((label, index) => ({
          label,
          value: OrientationsSupportedId[index],
        }));
      },
    },
    resolution: {
      type: "string",
      label: "Resolution",
      description: "DPI / quality.",
      async options({ printerId }) {
        const [
          { Resolutions },
        ] = await this.getPrinterProperties({
          params: {
            id: printerId,
          },
        });
        return Resolutions;
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
  },
  methods: {
    _baseUrl(version = "v2") {
      return version === "v1"
        ? "https://printapi.ezeep.com/sfapi"
        : "https://api2.ezeep.com/printing/v1";
    },
    _headers(headers) {
      return headers
        ? headers
        : {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        };
    },
    _makeRequest({
      $ = this, path, version, headers, url = null, ...opts
    }) {
      return axios($, {
        url: url || (this._baseUrl(version) + path),
        headers: this._headers(headers),
        ...opts,
      });
    },
    prepareFileUpload() {
      return this._makeRequest({
        path: "/PrepareUpload",
        version: "v1",
      });
    },

    uploadFile(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        ...opts,
      });
    },
    printFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Print",
        version: "v1",
        ...opts,
      });
    },
    getPrinterProperties(opts = {}) {
      return this._makeRequest({
        path: "/GetPrinterProperties",
        version: "v1",
        ...opts,
      });
    },
    listPrinters() {
      return this._makeRequest({
        path: "/printers",
      });
    },
    getPrintJobStatus(opts = {}) {
      return this._makeRequest({
        path: "/status",
        version: "v1",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let count = 0;
      let page = 0;
      let nextPage = false;

      do {
        params.limit = LIMIT;
        params.offset = LIMIT * page;
        page++;
        const {
          results,
          next,
        } = await fn({
          params,
        });

        for (const d of results) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }
        nextPage = next;

      } while (nextPage);
    },
  },
};
