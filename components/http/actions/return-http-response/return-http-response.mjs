import http from "../../http.app.mjs";

export default {
  key: "http-return-http-response",
  name: "Return HTTP Response",
  description:
    "Use with an HTTP trigger that uses \"Return a custom response from your workflow\" as its `HTTP Response`",
  type: "action",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    http,
    resStatusCode: {
      type: "integer",
      label: "Response Status Code",
      description:
        "The [status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) to return in the HTTP response.",
      default: 200,
      min: 100,
      max: 599,
    },
    resHeaders: {
      type: "object",
      label: "Response Headers",
      description: "The headers to return in the HTTP response.",
      optional: true,
    },
    resBody: {
      type: "any",
      label: "Response Body",
      description: "The body to return in the HTTP response.",
      optional: true,
      default: "{ \"success\": true }",
    },
  },
  async run({ $ }) {
    const status = this.resStatusCode;
    await $.respond({
      status,
      headers: this.resHeaders,
      body: this.resBody,
    });
    $.export("$summary", `Responded successfully with status ${status}`);
  },
};
