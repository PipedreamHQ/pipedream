import convertkit from "../../convertkit.app.mjs";

export default {
  key: "convertkit-add-tag-to-subscriber",
  name: "Add tag to a subscriber",
  description: "Add tag to a subscriber. [See docs here](https://developers.convertkit.com/#tag-a-subscriber)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    convertkit,
    subscriber: {
      propDefinition: [
        convertkit,
        "subscriber",
        () => ({
          returnField: "email_address",
        }),
      ],
    },
    tag: {
      propDefinition: [
        convertkit,
        "tag",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.convertkit.addTagToSubscriber(this.subscriber, this.tag, $);

    if (response) {
      $.export("$summary", "Successfully added tag to subscriber");
    }

    return response;
  },
};
