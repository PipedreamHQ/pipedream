import app from "../../string_web_access.app.mjs";

export default {
  key: "string_web_access-extract-data",
  name: "Extract Data From URL",
  description: "Fetch a URL and return only the fields described by a JSON schema. If the page doesn't yield the schema's required fields, the page comes back instead, with `extracted: false` and a `reason`. [See the documentation](https://portal.usestring.ai/docs/fetch/structured-extraction)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
      description: "The URL to extract fields from, e.g. `https://example.com/products/widget`",
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
    solveCaptcha: {
      propDefinition: [
        app,
        "solveCaptcha",
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
        solveCaptcha: this.solveCaptcha ?? false,
      },
    });

    if (response?.extracted === false) {
      $.export("$summary", `Could not extract the fields from ${this.url} (${response.reason}); returned the page instead`);
      return response;
    }

    $.export("$summary", `Successfully extracted fields from ${this.url}`);
    return response;
  },
};
