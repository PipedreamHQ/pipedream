import app from "../../doppler_marketing_automation.app.mjs";

export default {
  name: "Get Subscriber",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "doppler_marketing_automation-get-subscriber",
  description: "Get a subscriber. [See the documentation](https://restapi.fromdoppler.com/docs/resources#!/Subscribers/AccountsByAccountNameSubscribersByEmailGet)",
  type: "action",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "subscriberEmail",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getSubscriber({
      $,
      email: this.email,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved subscriber with email ${response.email}`);
    }

    return response;
  },
};
