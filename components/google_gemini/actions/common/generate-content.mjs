import app from "../../google_gemini.app.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    app,
    model: {
      propDefinition: [
        app,
        "model",
        () => ({
          filter: ({
            description,
            supportedGenerationMethods,
          }) => ![
            "discontinued",
            "deprecated",
          ].some((keyword) => description?.includes(keyword))
            && supportedGenerationMethods?.includes(constants.MODEL_METHODS.GENERATE_CONTENT),
        }),
      ],
    },
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
    responseFormat: {
      propDefinition: [
        app,
        "responseFormat",
      ],
    },
    history: {
      type: "string[]",
      label: "Conversation History",
      description: "Previous messages in the conversation. Each item must be a valid JSON string with `text` and `role` (either `user` or `model`). Example: `{\"text\": \"Hello\", \"role\": \"user\"}`",
      optional: true,
    },
    safetySettings: {
      type: "string[]",
      label: "Safety Settings",
      description: "Configure content filtering for different harm categories. Each item must be a valid JSON string with `category` (one of: `HARASSMENT`, `HATE_SPEECH`, `SEXUALLY_EXPLICIT`, `DANGEROUS`, `CIVIC`) and `threshold` (one of: `BLOCK_NONE`, `BLOCK_ONLY_HIGH`, `BLOCK_MEDIUM_AND_ABOVE`, `BLOCK_LOW_AND_ABOVE`). Example: `{\"category\": \"HARASSMENT\", \"threshold\": \"BLOCK_MEDIUM_AND_ABOVE\"}`",
      optional: true,
    },
  },
  methods: {
    formatHistoryToContent(history) {
      if (typeof(history) === "string") {
        try {
          history = JSON.parse(history);
        } catch (e) {
          throw new ConfigurationError(`Invalid JSON in history: ${history}`);
        }
      }

      if (!history || (Array.isArray(history) && !history.length)) {
        return [];
      }

      return history?.map((itemStr) => {
        let item = itemStr;
        if (typeof item === "string") {
          try {
            item = JSON.parse(itemStr);
          } catch (e) {
            throw new ConfigurationError(`Invalid JSON in history item: ${itemStr}`);
          }
        }

        if (!item.text || !item.role || ![
          "user",
          "model",
        ].includes(item.role)) {
          throw new ConfigurationError("Each history item must include `text` and `role` (either `user` or `model`)");
        }

        return {
          parts: [
            {
              text: item.text,
            },
          ],
          role: item.role,
        };
      });
    },
    formatSafetySettings(safetySettings) {
      if (!safetySettings?.length) {
        return undefined;
      }

      return safetySettings.map((settingStr) => {
        let setting = settingStr;
        if (typeof setting === "string") {
          try {
            setting = JSON.parse(settingStr);
          } catch (e) {
            throw new ConfigurationError(`Invalid JSON in safety setting: ${settingStr}`);
          }
        }

        if (!setting.category || !setting.threshold) {
          throw new ConfigurationError("Each safety setting must include 'category' and 'threshold'");
        }

        const category = constants.HARM_CATEGORIES[setting.category];
        if (!category) {
          throw new ConfigurationError(`Invalid category '${setting.category}'. Must be one of: ${Object.keys(constants.HARM_CATEGORIES).join(", ")}`);
        }

        if (!constants.BLOCK_THRESHOLDS[setting.threshold]) {
          throw new ConfigurationError(`Invalid threshold '${setting.threshold}'. Must be one of: ${Object.keys(constants.BLOCK_THRESHOLDS).join(", ")}`);
        }

        return {
          category,
          threshold: setting.threshold,
        };
      });
    },
  },
  async additionalProps() {
    const {
      model,
      responseFormat,
    } = this;

    const {
      outputTokenLimit,
      temperature,
      topP,
      topK,
      maxTemperature,
    } = await this.app.getModel({
      model,
    });

    return {
      ...(responseFormat && {
        responseSchema: {
          type: "string",
          label: "Response Schema",
          description: "Define the structure of the JSON response. Must be a valid JSON schema object. Leave empty to let Gemini determine the structure.",
          optional: true,
        },
      }),
      ...(outputTokenLimit && {
        maxOutputTokens: {
          type: "integer",
          label: "Max Output Tokens",
          description: `The maximum number of tokens to generate in the response. Eg. \`${outputTokenLimit}\`.`,
          optional: true,
          max: outputTokenLimit,
        },
      }),
      ...(temperature && {
        temperature: {
          type: "string",
          label: "Temperature",
          description: `Controls the randomness of the generated text. Lower values make the text more deterministic, while higher values make it more random. Eg. \`${temperature}\`.${maxTemperature
            ? ` Where max temperature is \`${maxTemperature}\`.`
            : ""}`,
          optional: true,
        },
      }),
      ...(topP && {
        topP: {
          type: "string",
          label: "Top P",
          description: `Controls the diversity of the generated text. Lower values make the text more deterministic, while higher values make it more random. Eg. \`${topP}\`.`,
          optional: true,
        },
      }),
      ...(topK && {
        topK: {
          type: "integer",
          label: "Top K",
          description: `Controls the diversity of the generated text. Lower values make the text more deterministic, while higher values make it more random. Eg. \`${topK}\`.`,
          optional: true,
        },
      }),
      stopSequences: {
        type: "string[]",
        label: "Stop Sequences",
        description: "The set of character sequences (up to 5) that will stop output generation. If specified, the API will stop at the first appearance of a `stop_sequence`. The stop sequence will not be included as part of the response.",
        optional: true,
      },
    };
  },
};
