import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "klipfolio",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "Name of the Datasource",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the Datasource",
    },
    format: {
      type: "string",
      label: "Format",
      description: "Format of the Datasource, i.e.: `xml`",
    },
    connector: {
      type: "string",
      label: "Connector",
      description: "Connector of the Datasource",
      options: constants.DATASOURCE_CONNECTORS,
    },
    refreshInterval: {
      type: "string",
      label: "Refresh Interval",
      description: "Refresh Interval of the Datasource",
      options: constants.REFRESH_INTERVALS,
    },
    endpointUrl: {
      type: "string",
      label: "Endpoint URL",
      description: "Endpoint URL of the Datasource, i.e.: `http://test/data/scatter.xml`",
    },
    method: {
      type: "string",
      label: "Method",
      description: "Method for the endpoint, i.e.: `GET`",
    },
    datasourceId: {
      type: "string",
      label: "Datasource ID",
      description: "ID of the Datasource",
      async options() {
        const response = await this.getDatasources();
        const datasourceIds = response.data.datasources;
        return datasourceIds.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    additionalProperties: {
      type: "object",
      label: "Additional Properties",
      description: "Data source additional properties. For example, Google Analytics API has the following properties: `oauth_provider_id`, `oauth_user_header`, `oauth_user_token`, `token_id`, `prop:profile_id`.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.klipfolio.com/api/1.0";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "kf-api-key": `${this.$auth.api_key}`,
        },
      });
    },
    async createDatasource(args = {}) {
      return this._makeRequest({
        path: "/datasources",
        method: "post",
        ...args,
      });
    },
    async updateDatasource({
      datasourceId, ...args
    }) {
      return this._makeRequest({
        path: `/datasources/${datasourceId}`,
        method: "put",
        ...args,
      });
    },
    async deleteDatasource({
      datasourceId, ...args
    }) {
      return this._makeRequest({
        path: `/datasources/${datasourceId}`,
        method: "delete",
        ...args,
      });
    },
    async getDatasources(args = {}) {
      return this._makeRequest({
        path: "/datasources",
        ...args,
      });
    },
  },
};
