import app from "../../string_web_access.app.mjs";

export default {
  key: "string_web_access-fetch-url",
  name: "Fetch URL",
  description: "Fetch a URL and return the page as Markdown, raw content, or a JSON envelope. [See the documentation](https://portal.usestring.ai/docs/api-reference/fetch)",
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
    },
    format: {
      propDefinition: [
        app,
        "format",
      ],
    },
    mainContentOnly: {
      type: "boolean",
      label: "Main Content Only",
      description: "Drop navigation, headers and footers. Only affects Markdown responses.",
      optional: true,
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
    headers: {
      propDefinition: [
        app,
        "headers",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.fetchUrl({
      $,
      data: {
        url: this.url,
        format: this.format ?? "markdown",
        mainContentOnly: this.mainContentOnly,
        executeJS: this.executeJS,
        countryCode: this.countryCode,
        solveCaptcha: this.solveCaptcha,
        headers: this.headers,
      },
    });

    $.export("$summary", `Successfully fetched ${this.url}`);
    return response;
  },
};
