import openai from "../../openai.app.mjs";
import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";
import { WEB_SEARCH_CHAT_MODELS } from "../../common/models.mjs";

export default {
  ...common,
  name: "Chat using Web Search",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "openai-chat-using-web-search",
  description: "Chat using the web search tool. [See the documentation](https://platform.openai.com/docs/guides/tools-web-search)",
  type: "action",
  props: {
    openai,
    modelId: {
      type: "string",
      label: "Model",
      description: "Model used to generate the response",
      default: WEB_SEARCH_CHAT_MODELS[0],
      options: WEB_SEARCH_CHAT_MODELS,
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
    userLocation: {
      type: "string[]",
      label: "User Location",
      description: "Additional configuration for approximate location parameters for the search",
      optional: true,
      options: [
        "City",
        "Region",
        "Country",
        "Timezone",
      ],
    },
    searchContextSize: {
      type: "string",
      label: "Search Context Size",
      description: "Determines the amount of context to use during the web search",
      optional: true,
      default: "medium",
      options: [
        "low",
        "medium",
        "high",
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
      responseFormat,
      userLocation,
    } = this;
    const props = {};

    if (userLocation?.includes("City")) {
      props.city = {
        type: "string",
        label: "City",
        description: "Free text input for the city of the user, e.g. `San Francisco`",
      };
    }

    if (userLocation?.includes("Region")) {
      props.region = {
        type: "string",
        label: "Region",
        description: "Free text input for the region of the user, e.g. `California`",
      };
    }

    if (userLocation?.includes("Country")) {
      props.country = {
        type: "string",
        label: "Country",
        description: "The two-letter [ISO country code](https://en.wikipedia.org/wiki/ISO_3166-1) of the user, e.g. `US`",
      };
    }

    if (userLocation?.includes("Timezone")) {
      props.timezone = {
        type: "string",
        label: "Timezone",
        description: "The [IANA timezone](https://timeapi.io/documentation/iana-timezones) of the user, e.g. `America/Los_Angeles`",
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
          type: "web_search_preview",
          user_location: {
            type: "approximate",
            city: this.city,
            country: this.country,
            region: this.region,
            timezone: this.timezone,
          },
          search_context_size: this.searchContextSize,
        },
      ],
    };

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
