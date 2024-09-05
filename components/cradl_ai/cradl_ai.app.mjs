import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cradl_ai",
  propDefinitions: {
    modelId: {
      type: "string",
      label: "Model ID",
      description: "The ID of the model to be used for parsing",
      async options({ prevContext }) {
        const params = prevContext?.nextToken
          ? {
            nextToken: prevContext.nextToken,
          }
          : {};
        const {
          models, nextToken,
        } = await this.listModels({
          params,
        });
        const options = models?.map(({
          modelId: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            nextToken,
          },
        };
      },
    },
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The ID of the existing flow where the document will be sent",
      async options({ prevContext }) {
        const params = prevContext?.nextToken
          ? {
            nextToken: prevContext.nextToken,
          }
          : {};
        const {
          workflows, nextToken,
        } = await this.listWorkflows({
          params,
        });
        const options = workflows?.map(({
          workflowId: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            nextToken,
          },
        };
      },
    },
    datasetId: {
      type: "string",
      label: "Dataset ID",
      description: "The ID of the dataset to use",
      optional: true,
      async options({ prevContext }) {
        const params = prevContext?.nextToken
          ? {
            nextToken: prevContext.nextToken,
          }
          : {};
        const {
          datasets, nextToken,
        } = await this.listDatasets({
          params,
        });
        const options = datasets?.map(({
          datasetId: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            nextToken,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.lucidtech.ai/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...otherOpts,
      });
    },
    listModels(opts = {}) {
      return this._makeRequest({
        path: "/models",
        ...opts,
      });
    },
    listWorkflows(opts = {}) {
      return this._makeRequest({
        path: "/workflows",
        ...opts,
      });
    },
    listDatasets(opts = {}) {
      return this._makeRequest({
        path: "/datasets",
        ...opts,
      });
    },
    listExecutions({
      workflowId, ...opts
    }) {
      return this._makeRequest({
        path: `/workflows/${workflowId}/executions`,
        ...opts,
      });
    },
    createDocumentHandle(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/documents",
        ...opts,
      });
    },
    uploadDocument({
      fileUrl, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        url: fileUrl,
        ...opts,
      });
    },
    runWorkflow({
      workflowId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/workflows/${workflowId}/executions`,
        ...opts,
      });
    },
    getRunResult({
      workflowId, executionId, ...opts
    }) {
      return this._makeRequest({
        path: `/workflows/${workflowId}/executions/${executionId}`,
        ...opts,
      });
    },
    createPrediction(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/predictions",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      args,
      resourceType,
      max,
    }) {
      args.params = {
        ...args.params,
      };
      let count = 0;
      do {
        const response = await resourceFn(args);
        const results = response[resourceType];
        for (const item of results) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        args.params.nextToken = response?.nextToken;
      } while (args.params.nextToken);
    },
  },
};
