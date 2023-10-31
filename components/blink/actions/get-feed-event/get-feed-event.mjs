import blink from "../../blink.app.mjs";

export default {
  key: "blink-get-feed-event",
  name: "Get Feed Event",
  description: "Retrieve a specific feed event. [See the documentation](https://developer.joinblink.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    blink,
    feedEventId: {
      propDefinition: [
        blink,
        "feedEventId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.blink.getFeedEvent({
      feedEventId: this.feedEventId,
    });
    $.export("$summary", `Successfully: retrieved feed event with ID: ${this.feedEventId}`);
    return response;
  },
};
