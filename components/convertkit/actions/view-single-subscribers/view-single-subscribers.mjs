import convertkit from "../../convertkit.app.mjs";

export default {
  key: "convertkit-view-single-subscribers",
  name: "View a Single Subscribers",
  description: "Returns data for a single subscriber. [See docs here](https://developers.convertkit.com/#view-a-single-subscriber)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    convertkit,
    subscriber: {
      propDefinition: [
        convertkit,
        "subscriber",
        () => ({
          returnField: "id",
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.convertkit.getSubscriber(this.subscriber, $);
    if (response) {
      $.export("$summary", "Successfully found subscriber");
    }
    return response;
  },
};
