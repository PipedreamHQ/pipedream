import app from "../../transistor_fm.app.mjs";

export default {
  name: "Create subscriber",
  description: "Create a subscriber. [See the docs here](https://developers.transistor.fm/#subscribers)",
  key: "transistor_fm-create-subscriber",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    showId: {
      propDefinition: [
        app,
        "showId",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    skipWelcomeEmail: {
      type: "boolean",
      label: "Skip welcome email",
      description: "Whether to skip sending the welcome email.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      show_id: this.showId,
      email: this.email,
      skip_welcome_email: this.skipWelcomeEmail,
    };
    const res = await this.app.createSubscriber(data, $);
    $.export("$summary", `Subscriber ${this.email} successfully created`);
    return res;
  },
};
