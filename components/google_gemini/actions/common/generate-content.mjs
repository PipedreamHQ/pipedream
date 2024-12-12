import app from "../../google_gemini.app.mjs";
import constants from "../../common/constants.mjs";

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
          ].some((keyword) => description.includes(keyword))
            && supportedGenerationMethods?.includes(constants.MODEL_METHODS.GENERATE_CONTENT),
        }),
      ],
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
