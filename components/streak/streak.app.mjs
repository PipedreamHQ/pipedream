import {
  axios,
  ConfigurationError,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "streak",
  propDefinitions: {
    pipelineId: {
      type: "string",
      label: "Pipeline",
      description: "Filter by pipeline",
      async options() {
        const pipelines = await this.listPipelines();
        return pipelines.map((pipeline) => ({
          label: pipeline.name,
          value: pipeline.key,
        }));
      },
    },
    teamId: {
      type: "string",
      label: "Team",
      description: "Filter by team",
      async options() {
        const { results } = await this.listTeams();
        return results.map((team) => ({
          label: team.name,
          value: team.key,
        }));
      },
    },
    teamMembers: {
      type: "string[]",
      label: "Team Members",
      description: "Team members",
      async options({ teamId }) {
        if (!teamId) {
          throw new ConfigurationError("**Team** prop configuration required");
        }
        const { members } = await this.listTeamMembers({
          teamId,
        });
        return members.map((member) => ({
          label: member.fullName,
          value: member.email,
        }));
      },
    },
    stage: {
      type: "string",
      label: "Stage",
      description: "Stage of the box",
      async options({ pipelineId }) {
        const results = await this.listStages({
          pipelineId,
        });
        return Object.entries(results).map(([
          key,
          value,
        ]) => ({
          label: value.name,
          value: key,
        }));
      },
    },
  },
  methods: {
    customFieldToProp(field) {
      if (field.type === "TEXT_INPUT") {
        return {
          type: "string",
          label: field.name,
          optional: true,
        };
      }
      if (field.type === "DATE") {
        return {
          type: "integer",
          label: field.name,
          description: "Date in Unix milliseconds timestamp",
          optional: true,
        };
      }
      if (field.type === "TAG") {
        return {
          type: "string[]",
          label: field.name,
          options: field.tagSettings.tags.map((x) => ({
            label: x.tag,
            value: x.key,
          })),
          optional: true,
        };
      }
      if (field.type === "DROPDOWN") {
        return {
          type: "string",
          label: field.name,
          options: field.dropdownSettings.items.map((x) => ({
            label: x.name,
            value: x.key,
          })),
          optional: true,
        };
      }
      if (field.type === "CHECKBOX") {
        return {
          type: "boolean",
          label: field.name,
          optional: true,
        };
      }
    },
    _getBaseUrl() {
      return "https://www.streak.com/api/";
    },
    _getAuth() {
      return {
        username: this.$auth.api_key,
      };
    },
    async _makeRequest(args = {}) {
      const {
        method = "GET",
        path,
        $ = this,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._getBaseUrl()}${path}`,
        auth: this._getAuth(),
        ...otherArgs,
      };
      return axios($, config);
    },
    async createWebhook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "v2/webhooks",
        ...args,
      });
    },
    async deleteWebhook({
      id, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `v2/webhooks/${id}`,
        ...args,
      });
    },
    async getContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        path: `v2/contacts/${contactId}`,
        ...args,
      });
    },
    async listPipelines(args = {}) {
      return this._makeRequest({
        path: "v1/pipelines",
        ...args,
      });
    },
    async listStages({
      pipelineId, ...args
    }) {
      return this._makeRequest({
        path: `v1/pipelines/${pipelineId}/stages`,
        ...args,
      });
    },
    async listTeams(args = {}) {
      return this._makeRequest({
        path: "v2/users/me/teams",
        ...args,
      });
    },
    async listTeamMembers({
      teamId, ...args
    }) {
      return this._makeRequest({
        path: `v2/teams/${teamId}`,
        ...args,
      });
    },
    async listBoxes({
      pipelineId, ...args
    }) {
      return this._makeRequest({
        path: `v1/pipelines/${pipelineId}/boxes`,
        ...args,
      });
    },
    async listComments({
      boxId, ...args
    }) {
      return this._makeRequest({
        path: `v2/boxes/${boxId}/comments`,
        ...args,
      });
    },
    async listTasks({
      boxId, ...args
    }) {
      return this._makeRequest({
        path: `v2/boxes/${boxId}/tasks`,
        ...args,
      });
    },
    async listContacts({
      boxId, ...args
    }) {
      return this._makeRequest({
        path: `v1/boxes/${boxId}`,
        ...args,
      });
    },
    async createBox({
      pipelineId, ...args
    }) {
      return this._makeRequest({
        path: `v2/pipelines/${pipelineId}/boxes`,
        method: "post",
        ...args,
      });
    },
    async updateFieldValue({
      boxId, fieldId, value, ...args
    }) {
      return this._makeRequest({
        ...args,
        path: `v1/boxes/${boxId}/fields/${fieldId}`,
        method: "post",
        data: {
          value,
        },
      });
    },
  },
};
