import omnisend from "../../omnisend.app.mjs";

export default {
  key: "omnisend-get-events",
  name: "Get Custom Events",
  description: "Retrieve a list of custom events in Omnisend. [See the documentation](https://api-docs.omnisend.com/reference/get_events)",
  version: "0.0.1",
  type: "action",
  props: {
    omnisend,
  },
  async run({ $ }) {
    const response = await this.omnisend.logCustomEvent({
      $,
    });

    $.export("$summary", "Successfully logged custom events");
    return response;
  },
};
