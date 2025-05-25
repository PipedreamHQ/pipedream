import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dust",
  propDefinitions: {
    agentId: {
      type: "string",
      label: "Agent ID",
      description:
        "Select the name of your Agent from the list. Non **Published** agents are not visible in this list.",
      async options() {
        const { agentConfigurations } = await this.listAgents();

        return agentConfigurations.map(({ description, name, sId: value }) => ({
          label: `${name} - ${description}`,
          value,
        }));
      },
    },
    dataSourceId: {
      type: "string",
      label: "Folder ID",
      description: "ID of the data source.",
      async options() {
        const { data_sources: ds } = await this.listDataSources();

        return ds.map(({ description, name, dustAPIDataSourceId: value }) => ({
          label: `${name} - ${description}`,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://dust.tt/api/v1/w/${this.$auth.workspace_id}`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({ $ = this, path, ...opts }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listAgents(opts = {}) {
      return this._makeRequest({
        path: "/assistant/agent_configurations",
        ...opts,
      });
    },
    listDataSources(opts = {}) {
      return this._makeRequest({
        path: "/data_sources",
        ...opts,
      });
    },
    sendMessageToAgent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/assistant/conversations",
        ...opts,
      });
    },
    upsertDocument({ documentId, dataSourceId, ...opts }) {
      return this._makeRequest({
        method: "POST",
        path: `/data_sources/${dataSourceId}/documents/${documentId}`,
        ...opts,
      });
    },
  },
};
