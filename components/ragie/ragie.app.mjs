import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ragie",
  propDefinitions: {
    // Create Document Props
    createDocumentFile: {
      type: "string",
      label: "File",
      description: "The binary file to upload, extract, and index for retrieval.",
    },
    createDocumentMode: {
      type: "string",
      label: "Mode",
      description: "Partition strategy for the document. Options are 'hi_res' or 'fast'.",
      optional: true,
      options: [
        {
          label: "hi_res",
          value: "hi_res",
        },
        {
          label: "fast",
          value: "fast",
        },
      ],
    },
    createDocumentMetadata: {
      type: "object",
      label: "Metadata",
      description: "Metadata for the document. Keys must be strings. Values may be strings, numbers, booleans, or lists of strings.",
      optional: true,
    },
    createDocumentExternalId: {
      type: "string",
      label: "External ID",
      description: "An optional identifier for the document. A common value might be an ID in an external system or the URL where the source file may be found.",
      optional: true,
    },
    createDocumentName: {
      type: "string",
      label: "Name",
      description: "An optional name for the document. If set, the document will have this name. Otherwise, it will default to the file's name.",
      optional: true,
    },
    createDocumentPartition: {
      type: "string",
      label: "Partition",
      description: "An optional partition identifier. Partitions must be lowercase alphanumeric and may only include the special characters '_' and '-'.",
      optional: true,
    },
    // Update Document File Props
    updateDocumentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document to update.",
      async options() {
        const response = await this.listDocuments();
        return response.documents.map((doc) => ({
          label: doc.name || doc.id,
          value: doc.id,
        }));
      },
    },
    updateDocumentFile: {
      type: "string",
      label: "File",
      description: "The new binary file to upload, extract, and index for retrieval.",
    },
    updateDocumentMode: {
      type: "string",
      label: "Mode",
      description: "Partition strategy for the document. Options are 'hi_res' or 'fast'.",
      optional: true,
      options: [
        {
          label: "hi_res",
          value: "hi_res",
        },
        {
          label: "fast",
          value: "fast",
        },
      ],
    },
    updateDocumentPartition: {
      type: "string",
      label: "Partition",
      description: "An optional partition identifier.",
      optional: true,
    },
    // Create Instruction Props
    createInstructionName: {
      type: "string",
      label: "Name",
      description: "The name of the instruction. Must be unique.",
    },
    createInstructionPrompt: {
      type: "string",
      label: "Prompt",
      description: "A natural language instruction which will be applied to documents as they are created and updated.",
    },
    createInstructionActive: {
      type: "boolean",
      label: "Active",
      description: "Whether the instruction is active. Active instructions are applied to documents when they're created or when their file is updated.",
      optional: true,
      default: true,
    },
    createInstructionScope: {
      type: "string",
      label: "Scope",
      description: "Determines whether the instruction is applied to the entire document or to each chunk of the document.",
      optional: true,
      options: [
        {
          label: "Document",
          value: "document",
        },
        {
          label: "Chunk",
          value: "chunk",
        },
      ],
    },
    createInstructionFilter: {
      type: "object",
      label: "Filter",
      description: "An optional metadata filter that is matched against document metadata during update and creation.",
      optional: true,
    },
    createInstructionPartition: {
      type: "string",
      label: "Partition",
      description: "An optional partition identifier. Instructions can be scoped to a partition.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ragie.ai";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers = {}, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        ...otherOpts,
      });
    },
    // List Documents
    async listDocuments(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/documents",
        params: opts,
      });
    },
    // Create Document
    async createDocument(opts = {}) {
      const {
        createDocumentFile, createDocumentMode, createDocumentMetadata, createDocumentExternalId, createDocumentName, createDocumentPartition,
      } = opts;
      const formData = new FormData();
      formData.append("file", createDocumentFile);
      if (createDocumentMode) formData.append("mode", createDocumentMode);
      if (createDocumentMetadata) formData.append("metadata", JSON.stringify(createDocumentMetadata));
      if (createDocumentExternalId) formData.append("external_id", createDocumentExternalId);
      if (createDocumentName) formData.append("name", createDocumentName);
      if (createDocumentPartition) formData.append("partition", createDocumentPartition);

      return this._makeRequest({
        method: "POST",
        path: "/documents",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
    },
    // Update Document File
    async updateDocumentFile(opts = {}) {
      const {
        updateDocumentId, updateDocumentFile, updateDocumentMode, updateDocumentPartition,
      } = opts;
      const formData = new FormData();
      formData.append("file", updateDocumentFile);
      if (updateDocumentMode) formData.append("mode", updateDocumentMode);
      if (updateDocumentPartition) formData.append("partition", updateDocumentPartition);

      return this._makeRequest({
        method: "PUT",
        path: `/documents/${updateDocumentId}/file`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
    },
    // Create Instruction
    async createInstruction(opts = {}) {
      const {
        createInstructionName, createInstructionPrompt, createInstructionActive, createInstructionScope, createInstructionFilter, createInstructionPartition,
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/instructions",
        data: {
          name: createInstructionName,
          prompt: createInstructionPrompt,
          active: createInstructionActive,
          scope: createInstructionScope,
          filter: createInstructionFilter,
          partition: createInstructionPartition,
        },
      });
    },
    // List Instructions (for possible future use)
    async listInstructions(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/instructions",
        params: opts,
      });
    },
    // List Connections
    async listConnections(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/connections",
        params: opts,
      });
    },
    // Additional methods to emit events can be added here if necessary
  },
  version: "0.0.{{ts}}",
};
