import vestaboard from "../../vestaboard.app.mjs";

export default {
  key: "vestaboard-get-current-message",
  name: "Get Current Message",
  description: "Retrieves the current message. [See the docs](https://docs.vestaboard.com/read-write)",
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
    const response = await this.vestaboard.getCurrentMessage({
      $,
    });

    if (response) {
      $.export("$summary", "Successfully retrieved current message.");
    }

    return response;
  },
};
