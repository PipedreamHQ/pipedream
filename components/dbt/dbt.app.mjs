import { axios } from "@pipedream/platform";
import {
  DEFAULT_LIMIT, API_VERSIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "dbt",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account",
      description: "Identifier of an account",
      async options() {
        const { data } = await this.listAccounts();
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    projectId: {
      type: "string",
      label: "Project",
      description: "Identifier of a project",
      async options({
        accountId, page,
      }) {
        const limit = DEFAULT_LIMIT;
        const { data } = await this.listProjects({
          accountId,
          params: {
            limit,
            offset: page * limit,
          },
        });
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    environmentId: {
      type: "string",
      label: "Environment",
      description: "Identifier of an environment",
      async options({
        accountId, projectId, page,
      }) {
        if (!projectId) {
          return [];
        }
        const limit = DEFAULT_LIMIT;
        const { data } = await this.listEnvironments({
          accountId,
          projectId,
          params: {
            limit,
            offset: page * limit,
          },
        });
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    runId: {
      type: "string",
      label: "Run",
      description: "Identifier of a run",
      async options({
        accountId, projectId, environmentId, page,
      }) {
        const limit = DEFAULT_LIMIT;
        const params = {
          limit,
          offset: page * limit,
        };
        if (projectId) {
          params.project_id = projectId;
        }
        if (environmentId) {
          params.environment_id = environmentId;
        }
        const { data } = await this.listRuns({
          accountId,
          params,
        });
        return data?.map(({ id }) => `${id}`) || [];
      },
    },
    runArtifact: {
      type: "string",
      label: "Run Artifact",
      description: "A run artifact",
      async options({
        accountId, runId, projectId, environmentId,
      }) {
        const params = {};
        if (projectId) {
          params.project_id = projectId;
        }
        if (environmentId) {
          params.environment_id = environmentId;
        }
        const { data } = await this.listRunArtifacts({
          accountId,
          runId,
          params,
        });
        return data || [];
      },
    },
    jobId: {
      type: "string",
      label: "Job",
      description: "Identifier of a job",
      async options({
        accountId, projectId, environmentId, page,
      }) {
        const limit = DEFAULT_LIMIT;
        const params = {
          limit,
          offset: page * limit,
        };
        if (projectId) {
          params.project_id = projectId;
        }
        if (environmentId) {
          params.environment_id = environmentId;
        }
        const { data } = await this.listJobs({
          accountId,
          params,
        });
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://cloud.getdbt.com/api";
    },
    _headers() {
      return {
        "Authorization": `Token ${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      apiVersion = 3,
      ...args
    }) {
      const version = API_VERSIONS[`${apiVersion}`];
      return await axios($, {
        url: `${this._baseUrl()}${version}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    createWebhook({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/webhooks/subscriptions`,
        method: "POST",
        ...args,
      });
    },
    deleteWebhook({
      accountId, webhookId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/webhooks/subscription/${webhookId}`,
        method: "DELETE",
        ...args,
      });
    },
    getRun({
      accountId, runId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/runs/${runId}/`,
        apiVersion: 2,
        ...args,
      });
    },
    getRunArtifact({
      accountId, runId, remainder, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/runs/${runId}/artifacts/${remainder}`,
        apiVersion: 2,
        ...args,
      });
    },
    getEnvironment({
      accountId, projectId, environmentId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/projects/${projectId}/environments/${environmentId}/`,
        ...args,
      });
    },
    listAccounts(args = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...args,
      });
    },
    listRuns({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/runs/`,
        apiVersion: 2,
        ...args,
      });
    },
    listRunArtifacts({
      accountId, runId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/runs/${runId}/artifacts/`,
        apiVersion: 2,
        ...args,
      });
    },
    listProjects({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/projects/`,
        ...args,
      });
    },
    listEnvironments({
      accountId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/projects/${projectId}/environments/`,
        ...args,
      });
    },
    listJobs({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/jobs/`,
        apiVersion: 2,
        ...args,
      });
    },
    triggerJobRun({
      accountId, jobId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/jobs/${jobId}/run/`,
        apiVersion: 2,
        method: "POST",
        ...args,
      });
    },
  },
};
