import syncOne from "../../syncon_one.app.mjs";

export default {
  key: "syncon_one-make-api-request",
  name: "Make an API Request",
  description:
    "Calls any Syncon One API endpoint with your key, for anything the other actions do not cover. [See the API reference](https://synconone.com/docs/api-reference).",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: true, openWorldHint: true, readOnlyHint: false },
  props: {
    syncOne,
    method: {
      type: "string",
      label: "Method",
      options: ["GET", "POST", "PATCH", "DELETE"],
      default: "GET",
    },
    path: {
      type: "string",
      label: "Path",
      description: "For example /people or /tasks/tsk_abc123. Start with a slash.",
    },
    params: {
      type: "object",
      label: "Query",
      optional: true,
      description: "Query string parameters.",
    },
    body: {
      type: "object",
      label: "Body",
      optional: true,
      description: "The JSON body, for POST and PATCH.",
    },
  },
  async run({ $ }) {
    if (!this.path || !this.path.startsWith("/"))
      throw new Error("The path must start with a slash.");
    const response = await this.syncOne._makeRequest({
      $,
      path: this.path,
      method: this.method,
      params: this.params,
      data: this.body,
    });
    $.export("$summary", `${this.method} ${this.path}`);
    return response;
  },
};
