import app from "../../groundsocial.app.mjs";

export default {
  key: "groundsocial-call-endpoint",
  name: "Call Endpoint",
  description: "Call any Groundsocial endpoint (Reddit, X, TikTok, Instagram, YouTube, LinkedIn, Google and 70+ more) and get the platform's JSON. [See the documentation](https://groundsocial.dev/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    endpoint: {
      propDefinition: [
        app,
        "endpoint",
      ],
    },
    params: {
      type: "object",
      label: "Parameters",
      description: "The endpoint's inputs, e.g. `{ \"q\": \"pipedream\", \"sort\": \"top\" }`. Each endpoint's inputs are listed in the [endpoint reference](https://groundsocial.dev/docs/api).",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = typeof this.params === "string"
      ? JSON.parse(this.params)
      : this.params;
    const response = await this.app.callEndpoint({
      $,
      endpointId: this.endpoint,
      params,
    });
    $.export("$summary", `Successfully called ${this.endpoint}`);
    return response;
  },
};
