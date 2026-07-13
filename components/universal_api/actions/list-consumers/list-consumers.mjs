import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-list-consumers",
  name: "List Consumers",
  description:
    "List consumers from the Platform API on Universal API. Returns a cursor-paginated array; use the returned IDs with **Delete Consumer**. [See the documentation](https://docs.universalapi.io/reference/get-consumer).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listConsumers({
      $,
      cursor: this.cursor,
      limit: this.limit,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} consumer(s)`);
    return response;
  },
};
