import vestaboard from "../../vestaboard.app.mjs";

export default {
  key: "vestaboard-get-subscriptions",
  name: "Get Subscriptions",
  description: "Get the list of subscriptions available to the viewer. [See the docs](https://swagger.vestaboard.com/docs/vestaboard/b3A6MTYwMTA4OTQ-get-v2-0-subscriptions)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    vestaboard,
  },
  async run({ $ }) {
    const response = await this.vestaboard.listSubscriptions({
      $,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved ${response.subscriptions.length} subscription${response.subscriptions.length === 1
        ? "s"
        : ""}`);
    }

    return response;
  },
};
