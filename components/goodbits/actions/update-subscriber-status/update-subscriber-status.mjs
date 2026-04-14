import app from "../../goodbits.app.mjs";

export default {
  key: "goodbits-update-subscriber-status",
  name: "Update Subscriber Status",
  description: "Update the status of a subscriber. [See the documentation](https://support.goodbits.io/article/115-goodbit-api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    status: {
      propDefinition: [
        app,
        "status",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.updateSubscriberStatus({
      $,
      email: this.email,
      data: {
        subscriber: {
          status: this.status,
        },
      },
    });
    $.export("$summary", "Successfully updated subscriber status");
    return response;
  },
};
