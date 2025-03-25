import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "vectorshift",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Create Pipeline Props
    name: {
      type: "string",
      label: "Pipeline Name",
      description: "Name of the new pipeline",
    },
    config: {
      type: "string",
      label: "Pipeline Config",
      description: "Configuration for the new pipeline as a JSON string",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional description of the new pipeline",
      optional: true,
    },
    // Execute Pipeline Props
    pipelineId: {
      type: "string",
      label: "Pipeline ID",
      description: "The ID of the pipeline to execute",
      async options() {
        const pipelines = await this.listPipelines();
        if (!pipelines) return [];
        return pipelines.map((pipeline) => ({
          label: pipeline.name,
          value: pipeline.id,
        }));
      },
    },
    inputs: {
      type: "string",
      label: "Pipeline Inputs",
      description: "Inputs for the pipeline execution as a JSON string",
    },
    // Add Data to Knowledge Base Props
    knowledgeBaseId: {
      type: "string",
      label: "Knowledge Base ID",
      description: "The ID of the knowledge base",
      async options() {
        const knowledgeBases = await this.listKnowledgeBases();
        if (!knowledgeBases) return [];
        return knowledgeBases.map((kb) => ({
          label: kb.name,
          value: kb.id,
        }));
      },
    },
    fileData: {
      type: "object",
      label: "File Data",
      description: "File data to add to the knowledge base",
      optional: true,
    },
    urlData: {
      type: "object",
      label: "URL Data",
      description: "URL data to add to the knowledge base",
      optional: true,
    },
    wikipedia: {
      type: "string",
      label: "Wikipedia",
      description: "Wikipedia data to add to the knowledge base",
      optional: true,
    },
    youtube: {
      type: "string",
      label: "YouTube",
      description: "YouTube data to add to the knowledge base",
      optional: true,
    },
    arxiv: {
      type: "string",
      label: "ArXiv",
      description: "ArXiv data to add to the knowledge base",
      optional: true,
    },
    git: {
      type: "string",
      label: "Git",
      description: "Git data to add to the knowledge base",
      optional: true,
    },
    addDataConfig: {
      type: "string",
      label: "Add Data Config",
      description: "Configuration for adding data to the knowledge base as a JSON string",
      optional: true,
    },
  },
  methods: {
    // Existing Method
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    // Base URL Method
    _baseUrl() {
      return "https://api.vectorshift.ai/v1";
    },
    // Make Request Method
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers = {}, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.token}`,
        },
        ...otherOpts,
      });
    },
    // List Pipelines Method
    async listPipelines(opts = {}) {
      const response = await this._makeRequest({
        path: "/pipelines",
        method: "GET",
        ...opts,
      });
      if (response.status !== "success") {
        throw new Error(`Failed to list pipelines: ${response.status}`);
      }
      return response.objects;
    },
    // List Knowledge Bases Method
    async listKnowledgeBases(opts = {}) {
      const response = await this._makeRequest({
        path: "/knowledge-bases",
        method: "GET",
        ...opts,
      });
      if (response.status !== "success") {
        throw new Error(`Failed to list knowledge bases: ${response.status}`);
      }
      return response.objects;
    },
    // Create Pipeline Method
    async createPipeline({
      name, config, description,
    }) {
      const data = {
        name,
        config: JSON.parse(config),
      };
      if (description) {
        data.description = description;
      }
      const response = await this._makeRequest({
        path: "/pipeline",
        method: "POST",
        data,
      });
      if (response.status !== "success") {
        throw new Error(`Failed to create pipeline: ${response.status}`);
      }
      return response.id;
    },
    // Execute Pipeline Method
    async executePipeline({
      pipelineId, inputs,
    }) {
      const data = {
        inputs: JSON.parse(inputs),
      };
      const response = await this._makeRequest({
        path: `/pipeline/${pipelineId}/run`,
        method: "POST",
        data,
      });
      if (response.status !== "success") {
        throw new Error(`Failed to execute pipeline: ${response.status}`);
      }
      return response.run_id;
    },
    // Add Data to Knowledge Base Method
    async addDataToKnowledgeBase({
      knowledgeBaseId, fileData, urlData, wikipedia, youtube, arxiv, git, addDataConfig,
    }) {
      if (!fileData && !urlData && !wikipedia && !youtube && !arxiv && !git) {
        throw new Error("At least one of fileData, urlData, wikipedia, youtube, arxiv, or git must be provided.");
      }
      const data = {};
      if (fileData) data.file_data = fileData;
      if (urlData) data.url_data = urlData;
      if (wikipedia) data.wikipedia = wikipedia;
      if (youtube) data.youtube = youtube;
      if (arxiv) data.arxiv = arxiv;
      if (git) data.git = git;
      if (addDataConfig) data.config = JSON.parse(addDataConfig);
      const response = await this._makeRequest({
        path: `/knowledge-base/${knowledgeBaseId}/index`,
        method: "POST",
        data,
      });
      if (response.status !== "success") {
        throw new Error(`Failed to add data to knowledge base: ${response.status}`);
      }
      return response.document_ids;
    },
    // Create Knowledge Base Method
    async createKnowledgeBase({ name }) {
      const data = {
        name,
      };
      const response = await this._makeRequest({
        path: "/knowledge-bases/create",
        method: "POST",
        data,
      });
      if (response.status !== "success") {
        throw new Error(`Failed to create knowledge base: ${response.status}`);
      }
      return response.id;
    },
    // Emit New Pipeline Created Event
    async emitNewPipelineCreated(pipeline) {
      // Implementation to emit event
    },
    // Emit New Knowledge Base Created Event
    async emitNewKnowledgeBaseCreated(knowledgeBase) {
      // Implementation to emit event
    },
    // Emit New Chatbot Created Event
    async emitNewChatbotCreated(chatbot) {
      // Implementation to emit event
    },
  },
};
