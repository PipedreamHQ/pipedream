import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "algodocs",
  propDefinitions: {
    extractorId: {
      type: "string",
      label: "Extractor ID",
      description: "The ID of the extractor to be used for processing the document.",
      async options() {
        const extractors = await this.listExtractors();
        return extractors.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder where the document is to be uploaded",
      async options() {
        const folders = await this.listFolders();
        return folders.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document to process that is obtained when uploading a document to AlgoDocs.",
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "x-api-key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    getExtractedDataOfMultipleDocuments({
      extractorId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/extracted_data/${extractorId}`,
        ...args,
      });
    },
    listExtractors(args = {}) {
      return this._makeRequest({
        path: "/extractors",
        ...args,
      });
    },
    listFolders(args = {}) {
      return this._makeRequest({
        path: "/folders",
        ...args,
      });
    },
  },
};
