import haunt from "../../haunt.app.mjs";

export default {
  key: "haunt-extract-data",
  name: "Extract Data",
  description:
    "Extracts structured data or clean text from a public web page using a plain-language prompt. When a page cannot be read, the response carries an honest `error_code` (such as `access_denied`, `login_required`, `not_found`) instead of invented content, so your workflow can branch on it. Failed reads are not charged. [See the documentation](https://hauntapi.com/docs?utm_source=pipedream&utm_medium=integration&utm_campaign=sweep-2026-07)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    haunt,
    url: {
      propDefinition: [
        haunt,
        "url",
      ],
    },
    prompt: {
      propDefinition: [
        haunt,
        "prompt",
      ],
    },
    responseFormat: {
      propDefinition: [
        haunt,
        "responseFormat",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      url: this.url,
      prompt: this.prompt,
    };
    if (this.responseFormat) {
      data.response_format = this.responseFormat;
    }
    const response = await this.haunt.extract({
      $,
      data,
    });
    if (response?.success) {
      $.export("$summary", `Successfully extracted data from ${this.url}`);
    } else {
      $.export("$summary", `Haunt could not read ${this.url} (${response?.error_code ?? "extraction_failed"}); the read was not charged`);
    }
    return response;
  },
};
