import { axios } from "@pipedream/platform";
import {
  API_KEY_HEADER,
  BASE_URL,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "algodocs",
  propDefinitions: {
    extractorId: {
      type: "string",
      label: "Extractor ID",
      description:
        "The ID of the extractor. Run the **List Extractors** action to get a list of valid extractor IDs. Example: `6d86215bf9cb4fc6ac1f6967`.",
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description:
        "The ID of the folder. Run the **List Folders** action to get a list of valid folder IDs. Example: `1a5e2f9c624b`.",
    },
    documentId: {
      type: "string",
      label: "Document ID",
      description:
        "The ID of the document. Run the **List Documents** action to get a list of valid document IDs. Example: `789012`.",
    },
  },
  methods: {
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        baseURL: BASE_URL,
        url: path,
        headers: {
          [API_KEY_HEADER]: this.$auth.api_key,
          ...headers,
        },
        ...opts,
      });
    },
    listFolders({ $ } = {}) {
      return this._makeRequest({
        $,
        path: "/folders",
      });
    },
    listExtractors({ $ } = {}) {
      return this._makeRequest({
        $,
        path: "/extractors",
      });
    },
    uploadLocalFile({
      $, extractorId, folderId, data, headers,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `/document/upload_local/${extractorId}/${folderId}`,
        data,
        headers,
      });
    },
    getExtractedDataByDocument({
      $, documentId, params,
    } = {}) {
      return this._makeRequest({
        $,
        path: `/extracted_data/${documentId}`,
        params,
      });
    },
    getExtractedDataByExtractor({
      $, extractorId, params,
    } = {}) {
      return this._makeRequest({
        $,
        path: `/extracted_data/${extractorId}`,
        params,
      });
    },
  },
};
