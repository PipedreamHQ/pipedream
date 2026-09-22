import app from "../../langfuse.app.mjs";

export default {
  key: "langfuse-get-trace-by-id",
  name: "Get Trace by ID",
  description: "Retrieve a trace from Langfuse by its ID. [See the documentation](https://api.reference.langfuse.com/#tag/trace/GET/api/public/traces/{traceId}).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    traceId: {
      propDefinition: [
        app,
        "traceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getTrace({
      $,
      traceId: this.traceId,
    });
    $.export("$summary", `Retrieved trace ${this.traceId}`);
    return response;
  },
};
