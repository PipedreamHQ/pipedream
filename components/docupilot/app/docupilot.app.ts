import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  CreateDocumentParams, DocumentResponse, HttpRequestParams,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "docupilot",
  methods: {
    _createDocumentBaseUrl(): string {
      return "https://api.docupilot.app/documents/create/";
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        headers: {
          "apikey": this.$auth.api_key,
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
    async createDocument(params: CreateDocumentParams): Promise<DocumentResponse> {
      return this._httpRequest({
        method: "POST",
        ...params,
      });
    },
  },
});
