import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "ninox",
  propDefinitions: {
    teamId: {
      label: "Team ID",
      description: "The ID of the team",
      type: "string",
      async options() {
        const teams = await this.getTeams();

        return teams.map((team) => ({
          label: team.name,
          value: team.id,
        }));
      },
    },
    databaseId: {
      label: "Database ID",
      description: "The ID of the database",
      type: "string",
      async options({ teamId }) {
        const databases = await this.getDatabases({
          teamId,
        });

        return databases.map((database) => ({
          label: database.name,
          value: database.id,
        }));
      },
    },
    tableId: {
      label: "Table ID",
      description: "The ID of the table",
      type: "string",
      async options({
        teamId, databaseId,
      }) {
        const tables = await this.getTables({
          teamId,
          databaseId,
        });

        return tables.map((table) => table.caption);
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.ninox.com/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._apiKey()}`,
        },
        ...args,
      });
    },
    // async createWebhook({ ...args }) {
    //   return this._makeRequest({
    //     path: "/webhooks",
    //     method: "post",
    //     ...args,
    //   });
    // },
    // async removeWebhook(webhookId) {
    //   return this._makeRequest({
    //     path: `/webhooks/${webhookId}`,
    //     method: "delete",
    //   });
    // },
    async getTeams(args = {}) {
      return this._makeRequest({
        path: "/teams",
        ...args,
      });
    },
    async getDatabases({
      teamId, ...args
    }) {
      return this._makeRequest({
        path: `/teams/${teamId}/databases`,
        ...args,
      });
    },
    async getTables({
      teamId, databaseId, ...args
    }) {
      const response = await this._makeRequest({
        path: `/teams/${teamId}/databases/${databaseId}`,
        ...args,
      });

      try {
        return Object.values(response?.schema?.types)
      } catch (error) {
        return []
      };
    },
    async getRecords({
      teamId, databaseId, tableId, ...args
    }) {
      return this._makeRequest({
        path: `/teams/${teamId}/databases/${databaseId}/tables/${tableId}/records`,
        ...args,
      });
    },
    async createRecord({
      teamId, databaseId, tableId, ...args
    }) {
      return this._makeRequest({
        path: `/teams/${teamId}/databases/${databaseId}/tables/${tableId}/records`,
        method: "post",
        ...args,
      });
    },
  },
});
