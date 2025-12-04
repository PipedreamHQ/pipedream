import app from "../../returnless.app.mjs";

export default {
  key: "returnless-list-return-statuses",
  name: "List Return Statuses",
  description: "List all return statuses. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/6129c8f41f66f-list-all-return-statuses)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
    idempotentHint: true,
  },
  type: "action",
  props: {
    app,
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const resources = await this.app.listReturnStatuses({
      $,
    });

    $.export("$summary", `Successfully retrieved ${resources.length} return status(es)`);
    return resources.data;
  },
};
