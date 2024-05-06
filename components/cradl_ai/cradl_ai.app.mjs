import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cradl_ai",
  propDefinitions: {
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document to be processed",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user performing the action",
      optional: true,
    },
    processingFlowId: {
      type: "string",
      label: "Processing Flow ID",
      description: "The ID of the processing flow",
      optional: true,
    },
    document: {
      type: "string",
      label: "Document",
      description: "The document to be parsed or processed",
    },
    modelId: {
      type: "string",
      label: "Model ID",
      description: "The ID of the model to be used for parsing",
    },
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The ID of the existing flow where the document will be sent",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.cradl.ai";
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
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async emitDocumentProcessingEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/documentProcessingEvent",
        ...opts,
      });
    },
    async parseDocument(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/parseDocument",
        ...opts,
      });
    },
    async sendDocumentToFlow(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sendDocument",
        ...opts,
      });
    },
  },
};
