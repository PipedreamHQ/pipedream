import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "deepgram",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project",
      description: "Identifier of a project",
      async options() {
        const { projects } = await this.listProjects();
        return projects?.map(({
          name, project_id: id,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    balanceId: {
      type: "string",
      label: "Balance",
      description: "Identifier of a balance",
      async options({ projectId }) {
        const { balances } = await this.listBalances({
          projectId,
        });
        return balances?.map(({ balance_id: id }) => id) || [];
      },
    },
    requestId: {
      type: "string",
      label: "Request",
      description: "Identifier of a request",
      async options({
        projectId, page,
      }) {
        const { requests } = await this.listRequests({
          projectId,
          params: {
            page,
          },
        });
        return requests?.map(({
          path, request_id: id,
        }) => ({
          label: path,
          value: id,
        })) || [];
      },
    },
    language: {
      type: "string",
      label: "Language",
      description: "BCP-47 language tag that hints at the primary spoken language",
      options: constants.LANGUAGES,
      optional: true,
    },
    tier: {
      type: "string",
      label: "Tier",
      description: "Level of model you would like to use in your request",
      options: constants.TIER_OPTIONS,
      default: "base",
      optional: true,
    },
    model: {
      type: "string",
      label: "Model",
      description: "AI model used to process submitted audio",
      options: constants.MODEL_OPTIONS,
      default: "general",
      optional: true,
    },
    redact: {
      type: "string",
      label: "Redact",
      description: "Indicates whether to redact sensitive information, replacing redacted content with asterisks (*)",
      options: constants.REDACT_OPTIONS,
      optional: true,
    },
    start: {
      type: "string",
      label: "Start",
      description: "Start date of the requested date range. Format is YYYY-MM-DD. Defaults to the time of your first request.",
      optional: true,
    },
    end: {
      type: "string",
      label: "End",
      description: "End date of the requested date range. Format is YYYY-MM-DD. Defaults to the current time.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.deepgram.com/v1";
    },
    _headers(headers) {
      return {
        ...headers,
        "Authorization": `Token ${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...args,
      });
    },
    getProject({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}`,
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    getBalance({
      projectId, balanceId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/balances/${balanceId}`,
        ...args,
      });
    },
    listBalances({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/balances`,
        ...args,
      });
    },
    getRequest({
      projectId, requestId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/requests/${requestId}`,
        ...args,
      });
    },
    listRequests({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/requests`,
        ...args,
      });
    },
    summarizeUsage({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/usage`,
        ...args,
      });
    },
    transcribeAudio(args = {}) {
      return this._makeRequest({
        path: "/listen",
        method: "POST",
        ...args,
      });
    },
  },
};
