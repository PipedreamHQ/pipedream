import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

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
      default: "davinci-002",
    },
    chatCompletionModelId: {
      label: "Model",
      description: "The ID of the model to use for chat completions",
      type: "string",
      async options() {
        return (await this.getChatCompletionModels({})).map((model) => model.id);
      },
      default: "gpt-4o-mini",
    },
    embeddingsModelId: {
      label: "Model",
      description: "The ID of the embeddings model to use. OpenAI recommends using `text-embedding-ada-002` for nearly all use cases: \"It's better, cheaper, and simpler to use. [Read the blog post announcement](https://openai.com/blog/new-and-improved-embedding-model)\".",
      type: "string",
      async options() {
        return (await this.getEmbeddingsModels({})).map((model) => model.id);
      },
      default: "text-embedding-3-small",
    },
    assistantModel: {
      type: "string",
      label: "Model",
      description: "The ID of the model to use for the assistant",
      async options() {
        const models = (await this.models({})).filter(({ id }) => (id.includes("gpt-3.5-turbo") || id.includes("gpt-4-turbo") || id.includes("gpt-4o")) && (id !== "gpt-3.5-turbo-0301"));
        return models.map(({ id }) => id);
      },
    },
    assistant: {
      type: "string",
      label: "Assistant",
      description: "Select an assistant to modify",
      async options({ prevContext }) {
        const params = prevContext?.after
          ? {
            after: prevContext.after,
          }
          : {};
        const {
          data: assistants, last_id: after,
        } = await this.listAssistants({
          params,
        });
        return {
          options: assistants.map((assistant) => ({
            label: assistant.name || assistant.id,
            value: assistant.id,
          })),
          context: {
            after,
          },
        };
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
      optional: true,
    },
    threadId: {
      type: "string",
      label: "Thread ID",
      description: "The unique identifier for the thread. Example: `thread_abc123`. To locate the thread ID, make sure your OpenAI Threads setting (Settings -> Organization/Personal -> General -> Features and capabilities -> Threads) is set to \"Visible to organization owners\" or \"Visible to everyone\". You can then access the list of threads and click on individual threads to reveal their IDs",
    },
    runId: {
      type: "string",
      label: "Run ID",
      description: "The unique identifier for the run.",
      async options({
        threadId, prevContext,
      }) {
        if (!threadId) {
          return [];
        }
        const params = prevContext?.after
          ? {
            after: prevContext.after,
          }
          : {};
        const {
          data: runs, last_id: after,
        } = await this.listRuns({
          threadId,
          params,
        });
        return {
          options: runs.map(({ id }) => id),
          context: {
            after,
          },
        };
      },
    },
    stepId: {
      type: "string",
      label: "Step ID",
      description: "The unique identifier for the step.",
      async options({
        threadId, runId, prevContext,
      }) {
        const params = prevContext?.after
          ? {
            after: prevContext.after,
          }
          : {};
        const {
          data, last_id: after,
        } = await this.listRunSteps({
          threadId,
          runId,
          params,
        });
        return {
          options: data?.map(({ id }) => id) || [],
          context: {
            after,
          },
        };
      },
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "The system instructions that the assistant uses.",
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
    content: {
      type: "string",
      label: "Content",
      description: "The content of the message",
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role of the entity creating the message",
      options: constants.USER_OPTIONS,
      default: "user",
    },
    toolOutputs: {
      type: "string[]",
      label: "Tool Outputs",
      description: "The outputs from the tool calls. Each object in the array should contain properties `tool_call_id` and `output`.",
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
      options: constants.ORDER_OPTIONS,
      optional: true,
    },
    fileId: {
      type: "string",
      label: "File ID",
      description: "The ID of the file to use for this request.",
      async options({ purpose }) {
        const { data: files } = await this.listFiles({
          purpose: purpose || undefined,
        });
        return files?.map((file) => ({
          label: file.filename,
          value: file.id,
        })) || [];
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
      options: constants.PURPOSES,
    },
    ttsModel: {
      type: "string",
      label: "Model",
      description: "One of the available [TTS models](https://platform.openai.com/docs/models/tts). `tts-1` is optimized for speed, while `tts-1-hd` is optimized for quality.",
      options: constants.TTS_MODELS,
    },
    fineTuningModel: {
      type: "string",
      label: "Fine Tuning Model",
      description: "The name of the model to fine-tune. [See the supported models](https://platform.openai.com/docs/guides/fine-tuning/what-models-can-be-fine-tuned).",
      options: constants.FINE_TUNING_MODEL_OPTIONS,
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
      options: constants.VOICES,
    },
    responseFormat: {
      type: "string",
      label: "Response Format",
      description: "The format to generate audio in. Supported formats are mp3, opus, aac, flac, wav, and pcm.",
      options: constants.AUDIO_RESPONSE_FORMATS,
      optional: true,
    },
    speed: {
      type: "string",
      label: "Speed",
      description: "The speed of the generated audio. Provide a value from 0.25 to 4.0.",
      default: "1.0",
      optional: true,
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
    _betaHeaders(version = "v1") {
      return {
        ...this._commonHeaders(),
        "OpenAI-Beta": `assistants=${version}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      headers,
      ...args
    } = {}) {
      return axios($, {
        ...args,
        url: `${this._baseApiUrl()}${path}`,
        headers: {
          ...headers,
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
          id.match(/^(text-embedding-ada-002|text-embedding-3.*|.*-(davinci|curie|babbage|ada)-.*-001)$/gm)
        );
      });
    },
    async _makeCompletion({
      path, ...args
    }) {
      const data = await this._makeRequest({
        path,
        method: "POST",
        ...args,
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
    createCompletion(args = {}) {
      return this._makeCompletion({
        path: "/completions",
        ...args,
      });
    },
    createChatCompletion(args = {}) {
      return this._makeCompletion({
        path: "/chat/completions",
        ...args,
      });
    },
    createImage(args = {}) {
      return this._makeRequest({
        path: "/images/generations",
        method: "POST",
        ...args,
      });
    },
    createEmbeddings(args = {}) {
      return this._makeRequest({
        path: "/embeddings",
        method: "POST",
        ...args,
      });
    },
    createTranscription({
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
    listAssistants(args = {}) {
      return this._makeRequest({
        path: "/assistants",
        headers: this._betaHeaders(),
        ...args,
      });
    },
    createAssistant(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/assistants",
        headers: this._betaHeaders("v2"),
        ...args,
      });
    },
    modifyAssistant({
      assistant, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/assistants/${assistant}`,
        headers: this._betaHeaders("v2"),
        ...args,
      });
    },
    createThread(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/threads",
        headers: this._betaHeaders("v2"),
        ...args,
      });
    },
    createMessage({
      threadId, metadata, ...args
    }) {
      const parsedMetadata = metadata
        ? JSON.parse(metadata)
        : undefined;
      return this._makeRequest({
        method: "POST",
        path: `/threads/${threadId}/messages`,
        headers: this._betaHeaders(),
        data: {
          ...args.data,
          metadata: parsedMetadata,
        },
        ...args,
      });
    },
    listMessages({
      threadId, ...args
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/messages`,
        headers: this._betaHeaders("v2"),
        ...args,
      });
    },
    modifyMessage({
      threadId, messageId, metadata, ...args
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
        ...args,
      });
    },
    createRun({
      threadId, ...args
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs`,
        method: "POST",
        headers: this._betaHeaders("v2"),
        ...args,
      });
    },
    retrieveRun({
      threadId, runId, ...args
    }) {
      return this._makeRequest({
        headers: this._betaHeaders("v2"),
        path: `/threads/${threadId}/runs/${runId}`,
        ...args,
      });
    },
    modifyRun({
      threadId, runId, data, ...args
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs/${runId}`,
        headers: this._betaHeaders(),
        method: "POST",
        data,
        ...args,
      });
    },
    listRuns({
      threadId, ...args
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs`,
        headers: this._betaHeaders(),
        ...args,
      });
    },
    submitToolOutputs({
      threadId, runId, ...args
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs/${runId}/submit_tool_outputs`,
        headers: this._betaHeaders(),
        method: "POST",
        ...args,
      });
    },
    cancelRun({
      threadId, runId, ...args
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs/${runId}/cancel`,
        headers: this._betaHeaders("v2"),
        method: "POST",
        ...args,
      });
    },
    createThreadAndRun(args = {}) {
      return this._makeRequest({
        path: "/threads/runs",
        headers: this._betaHeaders("v2"),
        method: "POST",
        ...args,
      });
    },
    retrieveRunStep({
      threadId, runId, stepId, ...args
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs/${runId}/steps/${stepId}`,
        headers: this._betaHeaders(),
        ...args,
      });
    },
    listRunSteps({
      threadId, runId, ...args
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs/${runId}/steps`,
        headers: this._betaHeaders(),
        ...args,
      });
    },
    listFiles({
      purpose, ...args
    } = {}) {
      return this._makeRequest({
        path: "/files",
        headers: this._betaHeaders(),
        params: {
          purpose,
        },
        ...args,
      });
    },
    uploadFile(args) {
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
    deleteFile({
      file_id, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        headers: this._betaHeaders(),
        path: `/files/${file_id}`,
        ...args,
      });
    },
    retrieveFile({
      file_id, ...args
    }) {
      return this._makeRequest({
        headers: this._betaHeaders(),
        path: `/files/${file_id}`,
        ...args,
      });
    },
    retrieveFileContent({
      file_id, ...args
    }) {
      return this._makeRequest({
        headers: this._betaHeaders("v2"),
        path: `/files/${file_id}/content`,
        ...args,
      });
    },
    listFineTuningJobs(args = {}) {
      return this._makeRequest({
        path: "/fine_tuning/jobs",
        ...args,
      });
    },
    createSpeech(args = {}) {
      return this._makeRequest({
        path: "/audio/speech",
        method: "POST",
        ...args,
      });
    },
    createFineTuningJob(args = {}) {
      return this._makeRequest({
        path: "/fine_tuning/jobs",
        method: "POST",
        ...args,
      });
    },
    listVectorStores(args = {}) {
      return this._makeRequest({
        path: "/vector_stores",
        headers: this._betaHeaders("v2"),
        ...args,
      });
    },
    createModeration(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/moderations",
        ...args,
      });
    },
    createBatch(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/batches",
        ...args,
      });
    },
    listBatches(args = {}) {
      return this._makeRequest({
        path: "/batches",
        ...args,
      });
    },
    async *paginate({
      resourceFn,
      args = {},
      max,
    }) {
      args = {
        ...args,
        params: {
          ...args.params,
        },
      };
      let hasMore, count = 0;
      do {
        const {
          data, last_id: after,
        } = await resourceFn(args);
        for (const item of data) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        hasMore = data?.length;
        args.params.after = after;
      } while (hasMore);
    },
  },
};
