import constants from "./common/constants.mjs";
import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import retry from "async-retry";

export default {
  type: "app",
  app: "freshdesk",
  propDefinitions: {
    companyId: {
      type: "integer",
      label: "Company ID",
      description: "ID of the primary company to which this contact belongs",
      useQuery: true,
      async options() {
        const response = await this.getCompanies();
        return response.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
  },
  methods: {
    setLastDateChecked(db, value) {
      db && db.set(constants.DB_LAST_DATE_CHECK, value);
    },
    getLastDateChecked(db) {
      return db && db.get(constants.DB_LAST_DATE_CHECK);
    },
    base64Encode(data) {
      return Buffer.from(data).toString("base64");
    },
    _getHeaders() {
      return {
        "Authorization": "Basic " + this.base64Encode(this.$auth.api_key + ":X"),
        "Content-Type": "application/json;charset=utf-8",
      };
    },
    _getUrl(path) {
      const {
        HTTP_PROTOCOL,
        BASE_PATH,
        VERSION_PATH,
      } = constants;
      return `${HTTP_PROTOCOL}${this.$auth.domain}${BASE_PATH}${VERSION_PATH}${path}`;
    },
    async _makeRequest(args = {}) {
      const {
        $,
        method = "get",
        path,
        params,
        data,
      } = args;
      const config = {
        method,
        url: this._getUrl(path),
        headers: this._getHeaders(),
        params,
        data,
      };
      return axios($ ?? this, config);
    },
    _isRetriableStatusCode(statusCode) {
      constants.retriableStatusCodes.includes(statusCode);
    },
    async _withRetries(apiCall) {
      const retryOpts = {
        retries: 5,
        factor: 2,
      };
      return retry(async (bail) => {
        try {
          const data = await apiCall();

          return data;
        } catch (err) {
          const { status = 500 } = err;
          if (!this._isRetriableStatusCode(status)) {
            bail(`
              Unexpected error (status code: ${status}):
              ${JSON.stringify(err.response)}
            `);
          }
          throw new ConfigurationError("Could not get data");
        }
      }, retryOpts);
    },
    async createCompany({
      $, payload: data,
    }) {
      return this._makeRequest({
        $,
        path: "/companies",
        data,
        method: "post",
      });
    },
    async getCompanies($ = undefined) {
      return this._makeRequest({
        $,
        path: "/companies",
      });
    },
    async createContact({
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "/contacts",
        data,
        method: "post",
      });
    },
  },
};
