import app from "../../themarketer.app.mjs";

export default {
  key: "themarketer-remove-subscriber",
  name: "Remove Subscriber",
  description: "Removes a subscriber. [See the documentation](https://developers.themarketer.com/reference/post_api-v1-remove-subscriber)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    channels: {
      propDefinition: [
        app,
        "channels",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.removeSubscriber({
      $,
      params: {
        email: this.email,
        channels: this.channels,
      },
    });

    $.export("$summary", "Successfully removed subscriber");

    return response;
  },
};
