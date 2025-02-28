import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "griptape",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "The name of the assistant",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the assistant",
      optional: true,
    },
    input: {
      type: "string",
      label: "Input",
      description: "The input of the assistant",
    },
    knowledgeBaseId: {
      type: "string",
      label: "Knowledge Base ID",
      description: "The ID of the knowledge base",
      async options({ page }) {
        const { knowledge_bases: knowledgeBases } = await this.listKnowledgeBases({
          params: {
            page,
          },
        });
        return knowledgeBases.map(({
          knowledge_base_id: value,
          name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    rulesetId: {
      type: "string",
      label: "Ruleset ID",
      description: "The ID of the ruleset",
      async options({ page }) {
        const { rulesets } = await this.listRulesets({
          params: {
            page,
          },
        });
        return rulesets.map(({
          ruleset_id: value,
          name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    structureId: {
      type: "string",
      label: "Structure ID",
      description: "The ID of the structure",
      async options({ page }) {
        const { structures } = await this.listStructures({
          params: {
            page,
          },
        });
        return structures.map(({
          structure_id: value,
          name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    toolId: {
      type: "string",
      label: "Tool ID",
      description: "The ID of the tool",
      async options({ page }) {
        const { tools } = await this.listTools({
          params: {
            page,
          },
        });
        return tools.map(({
          tool_id: value,
          name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    assistantId: {
      type: "string",
      label: "Assistant ID",
      description: "The ID of the assistant you want to update or delete.",
      async options({ page }) {
        const { assistants } = await this.listAssistants({
          params: {
            page,
          },
        });
        return assistants.map(({
          assistant_id: value,
          name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://cloud.griptape.ai/api${path}`;
    },
    getHeaders(headers) {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
        Accept: "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    patch(args = {}) {
      return this._makeRequest({
        method: "PATCH",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listKnowledgeBases(args = {}) {
      return this._makeRequest({
        path: "/knowledge-bases",
        ...args,
      });
    },
    listRulesets(args = {}) {
      return this._makeRequest({
        path: "/rulesets",
        ...args,
      });
    },
    listStructures(args = {}) {
      return this._makeRequest({
        path: "/structures",
        ...args,
      });
    },
    listTools(args = {}) {
      return this._makeRequest({
        path: "/tools",
        ...args,
      });
    },
    listAssistants(args = {}) {
      return this._makeRequest({
        path: "/assistants",
        ...args,
      });
    },
  },
};
