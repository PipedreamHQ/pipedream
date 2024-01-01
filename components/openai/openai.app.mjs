import { axios } from "@pipedream/platform";
import { FINE_TUNING_MODEL_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "openai",
  propDefinitions: {
    completionModelId: {
      label: "Model",
      description: "The ID of the model to use for completions. **This action doesn't support the ChatGPT `turbo` models**. Use the **Chat** action for those, instead.",
      type: "string",
      async options() {
        return (await this.getCompletionModels({})).map((model) => model.id);
      },
      default: "text-davinci-003",
    },
    chatCompletionModelId: {
      label: "Model",
      description: "The ID of the model to use for chat completions",
      type: "string",
      async options() {
        return (await this.getChatCompletionModels({})).map((model) => model.id);
      },
      default: "gpt-3.5-turbo",
    },
    embeddingsModelId: {
      label: "Model",
      description: "The ID of the embeddings model to use. OpenAI recommends using `text-embedding-ada-002` for nearly all use cases: \"It's better, cheaper, and simpler to use. [Read the blog post announcement](https://openai.com/blog/new-and-improved-embedding-model)\".",
      type: "string",
      async options() {
        return (await this.getEmbeddingsModels({})).map((model) => model.id);
      },
      default: "text-embedding-ada-002",
    },
    assistantModel: {
      type: "string",
      label: "Model",
      description: "The ID of the model to use for the assistant",
      async options() {
        const models = await this.models({});
        return models.map((model) => ({
          label: model.id,
          value: model.id,
        }));
      },
    },
    assistant: {
      type: "string",
      label: "Assistant",
      description: "Select an assistant to modify",
      async options() {
        const assistants = await this.listAssistants({});
        return assistants.map((assistant) => ({
          label: assistant.name || assistant.id,
          value: assistant.id,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the assistant.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the assistant.",
    },
    threadId: {
      type: "string",
      label: "Thread ID",
      description: "The unique identifier for the thread.",
    },
    runId: {
      type: "string",
      label: "Run ID",
      description: "The unique identifier for the run.",
      async options({ threadId }) {
        if (!threadId) {
          return [];
        }
        const { data: runs } = await this.listRuns({
          threadId,
        });
        return runs.map(({ id }) => id);
      },
    },
    stepId: {
      type: "string",
      label: "Step ID",
      description: "The unique identifier for the step.",
    },
    assistantId: {
      type: "string",
      label: "Assistant ID",
      description: "The unique identifier for the assistant.",
    },
    model: {
      type: "string",
      label: "Model",
      description: "The ID of the model to use.",
      optional: true,
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "The system instructions that the assistant uses.",
      optional: true,
    },
    tools: {
      type: "string[]",
      label: "Tools",
      description: "Each tool should be a valid JSON object. [See the documentation](https://platform.openai.com/docs/api-reference/assistants/createAssistant#assistants-createassistant-tools) for more information. Examples of function tools [can be found here](https://cookbook.openai.com/examples/how_to_call_functions_with_chat_models#basic-concepts).",
      optional: true,
    },
    file_ids: {
      type: "string[]",
      label: "File IDs",
      description: "A list of [file](https://platform.openai.com/docs/api-reference/files) IDs attached to this assistant.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format. Keys can be a maximum of 64 characters long and values can be a maxium of 512 characters long.",
      optional: true,
    },
    messages: {
      type: "string[]",
      label: "Messages",
      description: "An array of messages to start the thread with.",
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The ID of the message to modify",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the message",
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role of the entity creating the message",
      options: [
        {
          label: "User",
          value: "user",
        },
      ],
      default: "user",
    },
    fileIds: {
      type: "string[]",
      label: "File IDs",
      description: "List of file IDs to attach to the message",
      optional: true,
    },
    toolOutputs: {
      type: "string[]",
      label: "Tool Outputs",
      description: "The outputs from the tool calls.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of items to retrieve.",
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Sort order by the created_at timestamp of the objects.",
      options: [
        {
          label: "Ascending",
          value: "asc",
        },
        {
          label: "Descending",
          value: "desc",
        },
      ],
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "A cursor for use in pagination to fetch the next set of items.",
      optional: true,
    },
    before: {
      type: "string",
      label: "Before",
      description: "A cursor for use in pagination, identifying the message ID to end the list before",
      optional: true,
    },
    file_id: {
      type: "string",
      label: "File ID",
      description: "The ID of the file to use for this request.",
      async options({ prevContext }) {
        const files = await this.listFiles({
          purpose: prevContext
            ? prevContext.purpose
            : undefined,
        });
        return files.map((file) => ({
          label: file.filename,
          value: file.id,
        }));
      },
    },
    file: {
      type: "string",
      label: "File",
      description: "The path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp). See the [Assistants Tools guide](https://platform.openai.com/docs/assistants/tools) to learn more about the types of files supported. The Fine-tuning API only supports `.jsonl` files.",
    },
    purpose: {
      type: "string",
      label: "Purpose",
      description: "The intended purpose of the uploaded file. Use 'fine-tune' for fine-tuning and 'assistants' for assistants and messages.",
      options: [
        "fine-tune",
        "assistants",
      ],
    },
    ttsModel: {
      type: "string",
      label: "Model",
      description: "One of the available [TTS models](https://platform.openai.com/docs/models/tts). `tts-1` is optimized for speed, while `tts-1-hd` is optimized for quality.",
      options: [
        "tts-1",
        "tts-1-hd",
      ],
    },
    fineTuningModel: {
      type: "string",
      label: "Fine Tuning Model",
      description: "The name of the model to fine-tune. [See the supported models](https://platform.openai.com/docs/guides/fine-tuning/what-models-can-be-fine-tuned).",
      options: FINE_TUNING_MODEL_OPTIONS,
    },
    input: {
      type: "string",
      label: "Input",
      description: "The text to generate audio for. The maximum length is 4096 characters.",
    },
    voice: {
      type: "string",
      label: "Voice",
      description: "The voice to use when generating the audio.",
      options: [
        "alloy",
        "echo",
        "fable",
        "onyx",
        "nova",
        "shimmer",
      ],
    },
    responseFormat: {
      type: "string",
      label: "Response Format",
      description: "The format to audio in.",
      options: [
        "mp3",
        "opus",
        "aac",
        "flac",
      ],
      optional: true,
    },
    speed: {
      type: "string",
      label: "Speed",
      description: "The speed of the generated audio. Provide a value from 0.25 to 4.0.",
      default: "1.0",
      optional: true,
    },
    trainingFile: {
      type: "string",
      label: "Training File",
      description: "The ID of an uploaded file that contains training data. You can use the **Upload File** action and reference the returned ID here.",
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _baseApiUrl() {
      return "https://api.openai.com/v1";
    },
    _commonHeaders() {
      return {
        "Authorization": `Bearer ${this._apiKey()}`,
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v1.0",
      };
    },
    _betaHeaders() {
      return {
        ...this._commonHeaders(),
        "OpenAI-Beta": "assistants=v1",
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    } = {}) {
      return axios($, {
        ...args,
        url: `${this._baseApiUrl()}${path}`,
        headers: {
          ...args.headers,
          ...this._commonHeaders(),
        },
        maxBodyLength: Infinity,
      });
    },
    async models({ $ }) {
      const { data: models } = await this._makeRequest({
        $,
        path: "/models",
      });
      return models.sort((a, b) => a?.id.localeCompare(b?.id));
    },
    async getChatCompletionModels({ $ }) {
      const models = await this.models({
        $,
      });
      return models.filter((model) => model.id.match(/turbo|gpt/gi));
    },
    async getCompletionModels({ $ }) {
      const models = await this.models({
        $,
      });
      return models.filter((model) => {
        const { id } = model;
        return (
          id.match(/^(?=.*\b(babbage|davinci|ada|curie)\b)(?!.*\b(whisper|turbo|edit|insert|search|embedding|similarity|001)\b).*$/gm)
        );
      });
    },
    async getEmbeddingsModels({ $ }) {
      const models = await this.models({
        $,
      });
      return models.filter((model) => {
        const { id } = model;
        return (
          id.match(/^(text-embedding-ada-002|.*-(davinci|curie|babbage|ada)-.*-001)$/gm)
        );
      });
    },
    async _makeCompletion({
      $, path, args,
    }) {
      const data = await this._makeRequest({
        $,
        path,
        method: "POST",
        data: args,
      });

      // For completions, return the text of the first choice at the top-level
      let generated_text;
      if (path === "/completions") {
        const { choices } = data;
        generated_text = choices?.[0]?.text;
      }
      // For chat completions, return the assistant message at the top-level
      let generated_message;
      if (path === "/chat/completions") {
        const { choices } = data;
        generated_message = choices?.[0]?.message;
      }

      return {
        generated_text,
        generated_message,
        ...data,
      };
    },
    async createCompletion({
      $, args,
    }) {
      return this._makeCompletion({
        $,
        path: "/completions",
        args,
      });
    },
    async createChatCompletion({
      $, args,
    }) {
      return this._makeCompletion({
        $,
        path: "/chat/completions",
        args,
      });
    },
    async createImage({
      $, args,
    }) {
      return this._makeRequest({
        $,
        path: "/images/generations",
        data: args,
        method: "POST",
      });
    },
    async createEmbeddings({
      $, args,
    }) {
      return this._makeRequest({
        $,
        path: "/embeddings",
        data: args,
        method: "POST",
      });
    },
    async createTranscription({
      $, form,
    }) {
      return this._makeRequest({
        $,
        path: "/audio/transcriptions",
        method: "POST",
        headers: {
          ...this._commonHeaders(),
          "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
        },
        data: form,
      });
    },
    async listAssistants({ $ }) {
      const { data: assistants } = await this._makeRequest({
        $,
        path: "/assistants",
        headers: this._betaHeaders(),
      });
      return assistants;
    },
    async createAssistant({
      $,
      model,
      name,
      description,
      instructions,
      tools,
      file_ids,
      metadata,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/assistants",
        headers: this._betaHeaders(),
        data: {
          model,
          name,
          description,
          instructions,
          tools,
          file_ids,
          metadata,
        },
      });
    },
    async modifyAssistant({
      $,
      assistant,
      model,
      name,
      description,
      instructions,
      tools,
      file_ids,
      metadata,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `/assistants/${assistant}`,
        headers: this._betaHeaders(),
        data: {
          model,
          name,
          description,
          instructions,
          tools,
          file_ids,
          metadata,
        },
      });
    },
    async createThread({
      $,
      messages,
      metadata,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/threads",
        headers: this._betaHeaders(),
        data: {
          messages,
          metadata,
        },
      });
    },
    async createMessage({
      threadId, content, role, fileIds, metadata,
    }) {
      const parsedMetadata = metadata
        ? JSON.parse(metadata)
        : undefined;
      return this._makeRequest({
        method: "POST",
        path: `/threads/${threadId}/messages`,
        headers: this._betaHeaders(),
        data: {
          role,
          content,
          file_ids: fileIds,
          metadata: parsedMetadata,
        },
      });
    },
    async listMessages({
      threadId, limit, order, after, before,
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/messages`,
        headers: this._betaHeaders(),
        params: {
          limit,
          order,
          after,
          before,
        },
      });
    },
    async modifyMessage({
      threadId, messageId, metadata,
    }) {
      const parsedMetadata = metadata
        ? JSON.parse(metadata)
        : undefined;
      return this._makeRequest({
        method: "PATCH",
        headers: this._betaHeaders(),
        path: `/threads/${threadId}/messages/${messageId}`,
        data: {
          metadata: parsedMetadata,
        },
      });
    },
    async createRun({
      threadId, assistantId, ...opts
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs`,
        method: "POST",
        headers: this._betaHeaders(),
        data: {
          assistant_id: assistantId,
          ...opts,
        },
      });
    },
    async retrieveRun({
      threadId, runId,
    }) {
      return this._makeRequest({
        headers: this._betaHeaders(),
        path: `/threads/${threadId}/runs/${runId}`,
      });
    },
    async modifyRun({
      threadId, runId, ...opts
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs/${runId}`,
        headers: this._betaHeaders(),
        method: "POST",
        data: opts,
      });
    },
    async listRuns({
      threadId, ...opts
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs`,
        headers: this._betaHeaders(),
        params: opts,
      });
    },
    async submitToolOutputs({
      threadId, runId, toolOutputs,
    }) {
      // Assuming toolOutputs should be parsed as JSON objects
      const parsedToolOutputs = toolOutputs.map(JSON.parse);
      return this._makeRequest({
        path: `/threads/${threadId}/runs/${runId}/submit_tool_outputs`,
        headers: this._betaHeaders(),
        method: "POST",
        data: {
          tool_outputs: parsedToolOutputs,
        },
      });
    },
    async cancelRun({
      threadId, runId,
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs/${runId}/cancel`,
        headers: this._betaHeaders(),
        method: "POST",
      });
    },
    async createThreadAndRun({
      assistantId, ...opts
    }) {
      return this._makeRequest({
        path: "/threads/runs",
        headers: this._betaHeaders(),
        method: "POST",
        data: {
          assistant_id: assistantId,
          ...opts,
        },
      });
    },
    async retrieveRunStep({
      threadId, runId, stepId,
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs/${runId}/steps/${stepId}`,
        headers: this._betaHeaders(),
      });
    },
    async listRunSteps({
      threadId, runId, ...opts
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs/${runId}/steps`,
        headers: this._betaHeaders(),
        params: opts,
      });
    },
    async listFiles({ purpose } = {}) {
      return this._makeRequest({
        path: "/files",
        headers: this._betaHeaders(),
        params: {
          purpose,
        },
      });
    },
    async uploadFile(args) {
      return this._makeRequest({
        method: "POST",
        path: "/files",
        ...args,
        headers: {
          ...args.headers,
          ...this._betaHeaders(),
        },
      });
    },
    async deleteFile({ file_id }) {
      return this._makeRequest({
        method: "DELETE",
        headers: this._betaHeaders(),
        path: `/files/${file_id}`,
      });
    },
    async retrieveFile({ file_id }) {
      return this._makeRequest({
        headers: this._betaHeaders(),
        path: `/files/${file_id}`,
      });
    },
    async retrieveFileContent({ file_id }) {
      return this._makeRequest({
        headers: this._betaHeaders(),
        path: `/files/${file_id}/content`,
      });
    },
    async listFineTuningJobs(args) {
      return this._makeRequest({
        path: "/fine_tuning/jobs",
        ...args,
      });
    },
    async createSpeech(args) {
      return this._makeRequest({
        path: "/audio/speech",
        method: "POST",
        ...args,
      });
    },
    async createFineTuningJob(args) {
      return this._makeRequest({
        path: "/fine_tuning/jobs",
        method: "POST",
        ...args,
      });
    },
  },
};
