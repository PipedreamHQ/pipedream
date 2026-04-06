import { axios } from "@pipedream/platform";
import {
  getFallbackEntityOptions,
  parseEntityOptionsFromArgsPayload,
} from "./common/entities.mjs";

/**
 * Business Edge (CI, Inc.) — DevKey auth: `Authorization: Basic base64("DevKey:" + dev_key)`.
 * Configure the Pipedream app account with `base_url` (no trailing slash, e.g. https://hangerbolt.ci-inc.com) and `dev_key`.
 */
export default {
  type: "app",
  app: "business_edge",
  propDefinitions: {
    entity: {
      type: "string",
      label: "Entity",
      description:
        "Entity for this request. Options load from customer V3 `args.json` when "
        + "available; otherwise numeric codes 1–20 are shown (configurable fallback).",
      async options({ $ }) {
        const fromApi = await this.fetchEntityOptions({
          $,
        });
        if (Array.isArray(fromApi) && fromApi.length > 0) {
          return fromApi;
        }
        return getFallbackEntityOptions();
      },
    },
  },
  methods: {
    /**
     * Normalize configured base URL (no trailing slash).
     * @returns {string}
     */
    _baseUrl() {
      const raw = this.$auth?.base_url ?? "";
      return String(raw).replace(/\/+$/, "");
    },
    /**
     * Authorization header for DevKey (Basic `DevKey:<dev_key>`).
     * @returns {string}
     */
    _authorizationHeader() {
      const devKey = this.$auth?.dev_key ?? "";
      const token = Buffer.from(`DevKey:${devKey}`, "utf8").toString("base64");
      return `Basic ${token}`;
    },
    /**
     * Try to load Entity enum/options from customer V3 args (GET, same auth as exports).
     * @param {object} opts
     * @param {object} opts.$
     * @returns {Promise<{ label: string, value: string }[]|null>}
     */
    async fetchEntityOptions({ $ }) {
      try {
        const url = `${this._baseUrl()}/masterfiles/customerV3/args.json?MimicReq=true`;
        const payload = await axios($, {
          method: "GET",
          url,
          headers: {
            Authorization: this._authorizationHeader(),
            Accept: "application/json",
          },
        });
        return parseEntityOptionsFromArgsPayload(payload);
      } catch {
        return null;
      }
    },
    /**
     * Bounded, non-sensitive summary for API error responses (avoids full body
     * stringify).
     * @param {object} data
     * @returns {string}
     */
    _summarizeApiError(data) {
      const MAX_LEN = 500;
      const summary = {
        Success: data.Success,
        LogID: data.LogID,
        Error: typeof data.Error === "string"
          ? data.Error.slice(0, 200)
          : undefined,
        ErrorList: data.ErrorList,
        ErrorLog: Array.isArray(data.ErrorLog)
          ? data.ErrorLog.slice(0, 3).map((e) => ({
            Type: e?.Type,
            TypeDesc: e?.TypeDesc,
            Message: typeof e?.Message === "string"
              ? e.Message.slice(0, 150)
              : e?.Message,
          }))
          : undefined,
      };
      let text = JSON.stringify(summary);
      if (text.length > MAX_LEN) {
        text = `${text.slice(0, MAX_LEN - 3)}...`;
      }
      return text;
    },
    /**
     * Throws if the API body indicates failure (HTTP may still be 200).
     * @param {object} data Parsed JSON response body
     */
    _throwIfApiError(data) {
      if (!data || typeof data !== "object") {
        return;
      }
      if (data.Success !== false) {
        return;
      }
      throw new Error(
        `Business Edge API error: ${this._summarizeApiError(data)}`,
      );
    },
    /**
     * POST JSON to a Business Edge export endpoint.
     * @param {object} opts
     * @param {object} opts.$ Pipedream context passed to axios
     * @param {string} opts.endpoint Export path with leading `/` (e.g.
     * `/masterfiles/customerV3/export.json`)
     * @param {object} opts.data Request body
     * @returns {Promise<object>}
     */
    async postExport({
      $, endpoint, data,
    }) {
      const url = `${this._baseUrl()}${endpoint}`;
      const response = await axios($, {
        method: "POST",
        url,
        headers: {
          "Authorization": this._authorizationHeader(),
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        data,
      });
      this._throwIfApiError(response);
      return response;
    },
  },
};
