import app from "../../string_web_access.app.mjs";

export default {
  key: "string_web_access-extract-data",
  name: "Extract Data From URL",
  description: "Fetch a URL and return only the fields described by a JSON schema. [See the documentation](https://portal.usestring.ai/docs/fetch/structured-extraction)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
      description: "The URL to extract fields from",
    },
    jsonSchema: {
      type: "object",
      label: "JSON Schema",
      description: "The shape to extract, as a [JSON Schema](https://portal.usestring.ai/docs/fetch/structured-extraction) object. E.g. `{\"type\":\"object\",\"properties\":{\"price\":{\"type\":\"string\"}}}`",
    },
    executeJS: {
      propDefinition: [
        app,
        "executeJS",
      ],
    },
    countryCode: {
      propDefinition: [
        app,
        "countryCode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.fetchUrl({
      $,
      data: {
        url: this.url,
        format: "json",
        jsonSchema: this.jsonSchema,
        executeJS: this.executeJS,
        countryCode: this.countryCode,
      },
    });

    $.export("$summary", `Successfully extracted fields from ${this.url}`);
    return response;
  },
};
