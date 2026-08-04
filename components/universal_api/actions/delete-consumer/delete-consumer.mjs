import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-delete-consumer",
  name: "Delete Consumer",
  description:
    "Permanently delete a consumer via the Platform API on Universal API. This is irreversible. Run **List Consumers** first to find the consumer ID. [See the documentation](https://docs.universalapi.io/reference/delete-consumer).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    app,
    consumerId: {
      propDefinition: [
        app,
        "consumerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteConsumer({
      $,
      consumerId: this.consumerId,
    });
    $.export("$summary", `Successfully deleted consumer ${this.consumerId}`);
    return response;
  },
};
