import openai from "../../openai.app.mjs";
import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  name: "Chat using File Search",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "openai-chat-using-file-search",
  description: "Chat with your files knowledge base (vector stores). [See the documentation](https://platform.openai.com/docs/guides/tools-file-search)",
  type: "action",
  props: {
    openai,
    alert: {
      type: "alert",
      alertType: "info",
      content: "To use this action, you need to have set up a knowledge base in a vector store and uploaded files to it. [More infomation here](https://platform.openai.com/docs/guides/tools-file-search?lang=javascript#overview).",
    },
    modelId: {
      propDefinition: [
        openai,
        "chatCompletionModelId",
      ],
    },
    vectorStoreId: {
      propDefinition: [
        openai,
        "vectorStoreId",
      ],
      description: "The identifier of a vector store. Currently supports only one vector store at a time",
    },
    input: {
      type: "string",
      label: "Chat Input",
      description: "Text inputs to the model used to generate a response",
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "Inserts a system (or developer) message as the first item in the model's context",
      optional: true,
    },
    includeSearchResults: {
      type: "boolean",
      label: "Include Search Results",
      description: "Include the search results in the response",
      default: false,
      optional: true,
    },
    maxNumResults: {
      type: "integer",
      label: "Max Number of Results",
      description: "Customize the number of results you want to retrieve from the vector store",
      optional: true,
    },
    metadataFiltering: {
      type: "boolean",
      label: "Metadata Filtering",
      description: "Configure how the search results are filtered based on file metadata",
      optional: true,
      reloadProps: true,
    },
    previousResponseId: {
      type: "string",
      label: "Previous Response ID",
      description: "The unique ID of the previous response to the model. Use this to create multi-turn conversations",
      optional: true,
    },
    truncation: {
      type: "string",
      label: "Truncation",
      description: "Specifies the truncation mode for the response if it's larger than the context window size",
      optional: true,
      default: "auto",
      options: [
        "auto",
        "disabled",
      ],
    },
    responseFormat: {
      type: "string",
      label: "Response Format",
      description: "- **Text**: Returns unstructured text output.\n- **JSON Schema**: Enables you to define a [specific structure for the model's output using a JSON schema](https://platform.openai.com/docs/guides/structured-outputs?api-mode=responses).",
      options: [
        "text",
        "json_schema",
      ],
      default: "text",
      optional: true,
      reloadProps: true,
    },
    skipThisStep: {
      type: "boolean",
      label: "Skip This Step",
      description: "Pass in a boolean custom expression to skip this step's execution at runtime",
      optional: true,
      default: false,
    },
  },
  additionalProps() {
    const {
      modelId,
      metadataFiltering,
      responseFormat,
    } = this;
    const props = {};

    if (this.openai.isReasoningModel(modelId)) {
      props.reasoningEffort = {
        type: "string",
        label: "Reasoning Effort",
        description: "Constrains effort on reasoning for reasoning models",
        optional: true,
        options: [
          "low",
          "medium",
          "high",
        ],
      };

      // aparrently not supported yet as of 12/march/2025
      // props.generateSummary = {
      //   type: "string",
      //   label: "Generate Reasoning Summary",
      //   description: "A summary of the reasoning performed by the model",
      //   optional: true,
      //   options: [
      //     "concise",
      //     "detailed",
      //   ],
      // };
    }

    // TODO: make this configuration user-friendly
    // https://platform.openai.com/docs/guides/retrieval?attributes-filter-example=region#attribute-filtering
    if (metadataFiltering) {
      props.filters = {
        type: "object",
        label: "Filters",
        description: "Filter the search results based on file metadata. [See the documentation here](https://platform.openai.com/docs/guides/retrieval#attribute-filtering)",
      };
    }

    if (responseFormat === constants.CHAT_RESPONSE_FORMAT.JSON_SCHEMA.value) {
      props.jsonSchema = {
        type: "string",
        label: "JSON Schema",
        description: "Define the schema that the model's output must adhere to. [Generate one here](https://platform.openai.com/docs/guides/structured-outputs/supported-schemas).",
      };
    }

    return props;
  },
  methods: {
    ...common.methods,
  },
  async run({ $ }) {
    if (this.skipThisStep) {
      $.export("$summary", "Step execution skipped");
      return;
    }

    const data = {
      model: this.modelId,
      input: this.input,
      instructions: this.instructions,
      previous_response_id: this.previousResponseId,
      truncation: this.truncation,
      tools: [
        {
          type: "file_search",
          vector_store_ids: [
            this.vectorStoreId,
          ],
          max_num_results: this.maxNumResults,
        },
      ],
    };

    if (this.includeSearchResults) {
      data.include = [
        "output[*].file_search_call.search_results",
      ];
    }

    if (this.filters) {
      data.tools[0].filters = this.filters;
    }

    if (this.openai.isReasoningModel(this.modelId) && this.reasoningEffort) {
      data.reasoning = {
        ...data.reasoning,
        effort: this.reasoningEffort,
      };
    }

    if (this.openai.isReasoningModel(this.modelId) && this.generateSummary) {
      data.reasoning = {
        ...data.reasoning,
        generate_summary: this.generateSummary,
      };
    }

    if (this.responseFormat === constants.CHAT_RESPONSE_FORMAT.JSON_SCHEMA.value) {
      try {
        data.text = {
          format: {
            type: this.responseFormat,
            ...JSON.parse(this.jsonSchema),
          },
        };
      } catch (error) {
        throw new Error("Invalid JSON format in the provided JSON Schema");
      }
    }

    const response = await this.openai.responses({
      $,
      data,
    });

    if (response) {
      $.export("$summary", `Successfully sent chat with id ${response.id}`);
      $.export("chat_responses", response.output);
    }

    return response;
  },
};
