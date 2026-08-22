import app from "../../figranium.app.mjs";

export default {
  key: "figranium-list-executions",
  name: "List Executions",
  description: "Return a summary of all past executions. [See the documentation](https://figranium.com/docs/api-authentication-and-secure-access).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listExecutions({
      $,
    });

    $.export("$summary", "Successfully retrieved executions.");
    return response;
  },
};
