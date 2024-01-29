import omnisend from "../../omnisend.app.mjs";

export default {
  key: "omnisend-track-event",
  name: "Track Custom Event",
  description: "Log a custom event for better analytics and targeted marketing. [See the documentation](https://api-docs.omnisend.com/reference/get_events)",
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
