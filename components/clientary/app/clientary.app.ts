import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import utils from "../common/utils";
import {
  MakeRequestParams, AuthParams, RequestMethod,
} from "../common/types";
import { requestMethodParams } from "../common/constants";

export default defineApp({
  type: "app",
  app: "clientary",
  propDefinitions: {
    clientId: {
      type: "integer",
      label: "Client ID",
      description: "Client ID",
      async options({ page }) {
        page++;
        return await utils.getAsyncOptions({
          resourceFn: this.getRequestMethod("getClients"),
          page,
          resourceKey: "clients",
          labelKey: "name",
          valueKey: "id",
        });
      },
    },
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "Project ID",
      async options({ page }) {
        page++;
        return await utils.getAsyncOptions({
          resourceFn: this.getRequestMethod("getProjects"),
          page,
          resourceKey: "projects",
          labelKey: "name",
          valueKey: "id",
        });
      },
    },
    invoiceId: {
      type: "integer",
      label: "Invoice ID",
      description: "Invoice ID",
      async options({ page }) {
        page++;
        return await utils.getAsyncOptions({
          resourceFn: this.getRequestMethod("getInvoices"),
          page,
          resourceKey: "invoices",
          labelKey: "number",
          valueKey: "id",
        });
      },
    },
    assigneeId: {
      type: "integer",
      label: "Assignee ID",
      description: "Assignee ID",
      async options({ page }) {
        page++;
        return await utils.getAsyncOptions({
          resourceFn: this.getRequestMethod("getStaff"),
          page,
          resourceKey: "staff",
          labelKey: "name",
          valueKey: "id",
        });
      },
    },
  },
  methods: {
    _getUrl(path: string): string {
      return `https://${this.$auth.domain}.clientary.com/api/v2${path}`;
    },
    _getHeaders(headers: object = {}): object {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    _getAuthParams(): AuthParams {
      return {
        username: `${this.$auth.api_token}`,
        password: `${this.$auth.api_token}`,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...otherConfig
    }: MakeRequestParams): Promise<object> {
      return axios($, {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        auth: this._getAuthParams(),
        ...otherConfig,
      });
    },
    getRequestMethod(name: string): RequestMethod {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return async ({ ...args }): Promise<any> => {
        const params = requestMethodParams[name];
        return this._makeRequest({
          path: params.path,
          method: params.method ?? "GET",
          ...args,
        });
      };
    },
  },
});
