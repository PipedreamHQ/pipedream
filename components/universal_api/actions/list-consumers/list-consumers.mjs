import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-list-consumers",
  name: "List Consumers",
  description:
    "List consumers from the Platform API on Universal API. Returns an array (paginated internally, up to `maxResults`); use the returned IDs with **Delete Consumer**. [See the documentation](https://docs.universalapi.io/reference/get-consumer).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
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
    const {
      data, hasMore,
    } = await this.app.paginate({
      fn: this.app.listConsumers,
      args: {
        $,
      },
      maxResults: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${data.length} consumer(s)`);
    return {
      data,
      hasMore,
    };
  },
};
