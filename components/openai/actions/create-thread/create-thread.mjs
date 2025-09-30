import openai from "../../openai.app.mjs";
import common from "../common/common-assistants.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "openai-create-thread",
  name: "Create Thread (Assistants)",
  description: "Creates a thread with optional messages and metadata, and optionally runs the thread using the specified assistant. [See the documentation](https://platform.openai.com/docs/api-reference/threads/createThread)",
  version: "0.0.17",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    openai,
    messages: {
      propDefinition: [
        openai,
        "messages",
      ],
      optional: true,
    },
    metadata: {
      propDefinition: [
        openai,
        "metadata",
      ],
      optional: true,
    },
    runThread: {
      type: "boolean",
      label: "Run Thread",
      description: "Set to `true` to run the thread after creation",
      optional: true,
      reloadProps: true,
    },
    toolTypes: {
      type: "string[]",
      label: "Tool Types",
      description: "The types of tools to enable on the assistant",
      options: constants.TOOL_TYPES.filter((type) => type !== "function"),
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.runThread) {
      props.assistantId = {
        type: "string",
        label: "Assistant ID",
        description: "The unique identifier for the assistant.",
        options: async () => { return this.getAssistantPropOptions(); },
      };
      props.model = {
        type: "string",
        label: "Model",
        description: "The ID of the model to use for the assistant",
        options: async () => { return this.getAssistantModelPropOptions(); },
      };
      props.instructions = {
        type: "string",
        label: "Instructions",
        description: "The system instructions that the assistant uses.",
        optional: true,
      };
      props.waitForCompletion = {
        type: "boolean",
        label: "Wait For Completion",
        description: "Set to `true` to poll the API in 3-second intervals until the run is completed",
        optional: true,
      };
    }
    const toolProps = this.toolTypes?.length
      ? await this.getToolProps()
      : {};
    return {
      ...props,
      ...toolProps,
    };
  },
  methods: {
    ...common.methods,
    async getAssistantPropOptions() {
      const { data } = await this.openai.listAssistants();
      return data.map(({
        name, id,
      }) => ({
        label: name || id,
        value: id,
      }));
    },
    async getAssistantModelPropOptions() {
      const models = await this.openai.getAssistantsModels({});
      return models.map(({ id }) => id);
    },
  },
  async run({ $ }) {
    const messages = this.messages?.length
      ? this.messages.map((message) => ({
        role: "user",
        content: message,
      }))
      : undefined;
    let response = !this.runThread
      ? await this.openai.createThread({
        $,
        data: {
          messages,
          metadata: this.metadata,
          tool_resources: this.buildToolResources(),
        },
      })
      : await this.openai.createThreadAndRun({
        $,
        data: {
          assistant_id: this.assistantId,
          thread: {
            messages,
            metadata: this.metadata,
          },
          model: this.model,
          instructions: this.instructions,
          tools: this.buildTools(),
          tool_resources: this.buildToolResources(),
          metadata: this.metadata,
        },
      });

    if (this.waitForCompletion) {
      const runId = response.id;
      const threadId = response.thread_id;
      response = await this.pollRunUntilCompleted(response, threadId, runId, $);
    }

    $.export("$summary", `Successfully created a thread ${this.runThread
      ? "and run"
      : ""} with ID: ${response.id}`);
    return response;
  },
};
