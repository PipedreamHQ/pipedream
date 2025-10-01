import app from "../../doppler_marketing_automation.app.mjs";

export default {
  key: "doppler_marketing_automation-unsubscribe-email",
  name: "Unsubscribe Email",
  description: "Unsubscribe an email address from the account. Once unsubscribed, the user will not receive any more communication. [See the documentation](https://restapi.fromdoppler.com/docs/resources#!/Subscribers/AccountsByAccountNameUnsubscribedPost)",
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
        "subscriberEmail",
        () => ({
          filter: ({ status }) => status != "unsubscribed",
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.unsubscribeSubscriber({
      $,
      data: {
        email: this.email,
      },
    });
    $.export("$summary", `Successfully unsubscribed email: ${this.email}`);
    return response;
  },
};
