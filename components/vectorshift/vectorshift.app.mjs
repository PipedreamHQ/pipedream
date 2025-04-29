import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "vectorshift",
  propDefinitions: {
    knowledgeBaseId: {
      type: "string",
      label: "Knowledge Base ID",
      description: "The ID of the knowledge base",
      async options() {
        const { objects } = await this.listKnowledgeBases({
          params: {
            verbose: true,
          },
        });

        return objects?.map(({
          _id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    pipelineId: {
      type: "string",
      label: "Pipeline ID",
      description: "The ID of the pipeline to execute",
      async options() {
        const { objects } = await this.listPipelines();

        return objects.map(({
          _id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.vectorshift.ai/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
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
    listPipelines({
      params = {}, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/pipelines",
        params: {
          verbose: true,
          ...params,
        },
        ...opts,
      });
    },
    listKnowledgeBases({
      params = {}, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/knowledge-bases",
        params: {
          verbose: true,
          ...params,
        },
        ...opts,
      });
    },
    listChatbots({
      params = {}, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/chatbots",
        params: {
          verbose: true,
          ...params,
        },
        ...opts,
      });
    },
    createPipeline(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/pipeline",
        ...opts,
      });
    },
    executePipeline({
      pipelineId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/pipeline/${pipelineId}/run`,
        ...opts,
      });
    },
    addDataToKnowledgeBase({
      knowledgeBaseId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/knowledge-base/${knowledgeBaseId}/index`,
        ...opts,
      });
    },
  },
};
