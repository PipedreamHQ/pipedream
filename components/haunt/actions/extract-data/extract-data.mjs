import haunt from "../../haunt.app.mjs";

export default {
  key: "haunt-extract-data",
  name: "Extract Data",
  description:
    "Extracts structured data or clean text from a public web page using a plain-language prompt. Page-level failures include an `error_code` such as `access_denied`, `login_required`, or `not_found`, so the workflow can choose another path. Failed extractions are not charged. [See the documentation](https://hauntapi.com/docs?utm_source=pipedream&utm_medium=integration&utm_campaign=haunt-component)",
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
    const response = await this.haunt.extractData({
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
