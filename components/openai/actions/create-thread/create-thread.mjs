import openai from "../../openai.app.mjs";
import { parseToolsArray } from "../../common/helpers.mjs";

export default {
  key: "openai-create-thread",
  name: "Create Thread (Assistants)",
  description: "Creates a thread with optional messages and metadata, and optionally runs the thread using the specified assistant. [See the documentation](https://platform.openai.com/docs/api-reference/threads/createThread)",
  version: "0.0.6",
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
  },
  async additionalProps() {
    const props = {};
    if (!this.runThread) {
      return props;
    }
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
    props.tools = {
      type: "string[]",
      label: "Tools",
      description: "Each tool should be a valid JSON object. [See the documentation](https://platform.openai.com/docs/api-reference/assistants/createAssistant#assistants-createassistant-tools) for more information. Examples of function tools [can be found here](https://cookbook.openai.com/examples/how_to_call_functions_with_chat_models#basic-concepts).",
      optional: true,
    };
    return props;
  },
  methods: {
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
      const models = (await this.openai.models({})).filter(({ id }) => (id.includes("gpt-3.5-turbo") || id.includes("gpt-4-turbo")) && (id !== "gpt-3.5-turbo-0301"));
      return models.map(({ id }) => id);
    },
  },
  async run({ $ }) {
    const response = !this.runThread
      ? await this.openai.createThread({
        $,
        data: {
          messages: this.messages,
          metadata: this.metadata,
        },
      })
      : await this.openai.createThreadAndRun({
        $,
        assistantId: this.assistantId,
        data: {
          thread: {
            messages: this.messages,
            metadata: this.metadata,
          },
          model: this.model,
          instructions: this.instructions,
          tools: parseToolsArray(this.tools),
          metadata: this.metadata,
        },
      });

    $.export("$summary", `Successfully created a thread ${this.runThread
      ? "and initiated run"
      : ""} with ID: ${response.id}`);
    return response;
  },
};
