import constants from "../../common/constants.mjs";

export default {
  props: {
    toolTypes: {
      type: "string[]",
      label: "Tool Types",
      description: "The types of tools to enable on the assistant",
      options: constants.TOOL_TYPES,
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.toolTypes?.length) {
      return props;
    }
    return this.getToolProps();
  },
  methods: {
    async getToolProps() {
      const props = {};
      if (this.toolTypes.includes("code_interpreter")) {
        props.fileIds = {
          type: "string[]",
          label: "File IDs",
          description: "List of file IDs to attach to the message",
          optional: true,
          options: async () => {
            const { data } = await this.openai.listFiles({
              purpose: "assistants",
            });
            return data?.map(({
              filename, id,
            }) => ({
              label: filename,
              value: id,
            })) || [];
          },
        };
      }
      if (this.toolTypes.includes("file_search")) {
        props.vectorStoreIds = {
          type: "string[]",
          label: "Vector Store IDs",
          description: "The ID of the vector store to attach to this assistant",
          optional: true,
          options: async () => {
            const { data } = await this.openai.listVectorStores();
            return data?.map(({
              name, id,
            }) => ({
              label: name,
              value: id,
            })) || [];
          },
        };
      }
      if (this.toolTypes.includes("function")) {
        props.functionName = {
          type: "string",
          label: "Function Name",
          description: "The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.",
        };
        props.functionDescription = {
          type: "string",
          label: "Function Description",
          description: "A description of what the function does, used by the model to choose when and how to call the function.",
          optional: true,
        };
        props.functionParameters = {
          type: "object",
          label: "Function Parameters",
          description: "The parameters the functions accepts, described as a JSON Schema object. See the [guide](https://platform.openai.com/docs/guides/text-generation/function-calling) for examples, and the [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for documentation about the format.",
          optional: true,
        };
      }
      return props;
    },
    buildTools() {
      const tools = this.toolTypes?.filter((toolType) => toolType !== "function")?.map((toolType) => ({
        type: toolType,
      })) || [];
      if (this.toolTypes?.includes("function")) {
        tools.push({
          type: "function",
          function: {
            name: this.functionName,
            description: this.functionDescription,
            parameters: this.functionParameters,
          },
        });
      }
      return tools.length
        ? tools
        : undefined;
    },
    buildToolResources() {
      const toolResources = {};
      if (this.toolTypes?.includes("code_interpreter") && this.fileIds?.length) {
        toolResources.code_interpreter = {
          file_ids: this.fileIds,
        };
      }
      if (this.toolTypes?.includes("file_search") && this.vectorStoreIds?.length) {
        toolResources.file_search = {
          vector_store_ids: this.vectorStoreIds,
        };
      }
      return Object.keys(toolResources).length
        ? toolResources
        : undefined;
    },
    async pollRunUntilCompleted(run, threadId, runId, $ = this) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      while (run.status === "queued" || run.status === "in_progress") {
        run = await this.openai.retrieveRun({
          $,
          threadId,
          runId,
        });
        await timer(3000);
      }
      return run;
    },
  },
};
