import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_vertex_ai",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Identifier of a project",
      async options({ prevContext }) {
        const params = prevContext.nextPageToken
          ? {
            pageToken: prevContext.nextPageToken,
          }
          : {};
        const {
          projects, nextPageToken,
        } = await this.listProjects({
          params,
        });
        const options = projects?.map(({
          projectId: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
    model: {
      type: "string",
      label: "Model",
      description: "The model to use for video generation",
      options: [
        {
          label: "Veo 2.0 Generate 001 (Stable)",
          value: "veo-2.0-generate-001",
        },
        {
          label: "Veo 3.0 Generate Preview (Preview)",
          value: "veo-3.0-generate-preview",
        },
        {
          label: "Veo 3.0 Fast Generate Preview (Preview)",
          value: "veo-3.0-fast-generate-preview",
        },
      ],
      default: "veo-3.0-generate-preview",
    },
  },
  methods: {
    _baseUrl() {
      return "https://us-central1-aiplatform.googleapis.com/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...otherOpts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        url: "https://cloudresourcemanager.googleapis.com/v1/projects",
        ...opts,
      });
    },
    generateContent({
      projectId, model, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/locations/us-central1/publishers/google/models/${model}:generateContent`,
        ...opts,
      });
    },
    generateVideosLongRunning({
      projectId, model, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/locations/us-central1/publishers/google/models/${model}:predictLongRunning`,
        ...opts,
      });
    },
    fetchOperation({
      projectId, model, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/locations/us-central1/publishers/google/models/${model}:fetchPredictOperation`,
        ...opts,
      });
    },
  },
};
