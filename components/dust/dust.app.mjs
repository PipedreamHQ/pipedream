import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dust",
  propDefinitions: {
    assistantId: {
      type: "string",
      label: "Assistant ID",
      description: "Select the name of your Assistant from the list. Your Dust Assistant must be a **Shared** or **Company** Assistant. Personal Assistants are not visible in this list.",
      async options() {
        const { agentConfigurations } = await this.listAssistants();

        return agentConfigurations.map(({
          description, name, sId: value,
        }) => ({
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

        return ds.map(({
          description, name, dustAPIDataSourceId: value,
        }) => ({
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
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listAssistants(opts = {}) {
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
    sendMessageToAssistant(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/assistant/conversations",
        ...opts,
      });
    },
    upsertDocument({
      documentId, dataSourceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/data_sources/${dataSourceId}/documents/${documentId}`,
        ...opts,
      });
    },
  },
};
