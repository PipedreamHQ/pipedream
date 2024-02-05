import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "seqera",
  propDefinitions: {
    pipelineId: {
      type: "string",
      label: "Pipeline ID",
      description: "The ID of the pipeline",
    },
    computeEnvId: {
      type: "string",
      label: "Compute Environment ID",
      description: "The ID of the compute environment",
    },
    actionId: {
      type: "string",
      label: "Action ID",
      description: "The ID of the pipeline action",
    },
    pipelineName: {
      type: "string",
      label: "Pipeline Name",
      description: "The name of the pipeline to create",
    },
    computeEnvName: {
      type: "string",
      label: "Compute Environment Name",
      description: "The name of the compute environment to create",
    },
    actionName: {
      type: "string",
      label: "Action Name",
      description: "The name of the pipeline action to create",
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The ID of the event to emit when a new run is created",
      async options({ prevContext }) {
        const page = prevContext.page
          ? prevContext.page
          : 0;
        const { items } = await this.listEvents({
          params: {
            page,
          },
        });
        return {
          options: items.map((e) => ({
            label: e.name,
            value: e.id,
          })),
          context: {
            page: page + 1,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tower.nf";
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createPipeline({ pipelineName }) {
      return this._makeRequest({
        method: "POST",
        path: "/api/workflow",
        data: {
          name: pipelineName,
        },
      });
    },
    async createComputeEnv({ computeEnvName }) {
      return this._makeRequest({
        method: "POST",
        path: "/api/compute-env",
        data: {
          name: computeEnvName,
        },
      });
    },
    async createPipelineAction({
      pipelineId, computeEnvId, actionName,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/api/workflow/${pipelineId}/action`,
        data: {
          computeEnvId,
          name: actionName,
        },
      });
    },
    async listEvents({ params }) {
      return this._makeRequest({
        path: "/api/events",
        params,
      });
    },
    async emitEvent({ eventId }) {
      return this._makeRequest({
        method: "POST",
        path: `/api/events/${eventId}/emit`,
      });
    },
  },
  version: "0.0.{{ts}}",
};
