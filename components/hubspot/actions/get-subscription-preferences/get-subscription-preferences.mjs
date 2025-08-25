import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-get-subscription-preferences",
  name: "Get Subscription Preferences",
  description: "Retrieves the subscription preferences for a contact. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/subscriptions#get-%2Fcommunication-preferences%2Fv4%2Fstatuses%2F%7Bsubscriberidstring%7D)",
  version: "0.0.2",
  type: "action",
  props: {
    hubspot,
    contactEmail: {
      propDefinition: [
        hubspot,
        "contactEmail",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.getSubscriptionPreferences({
      $,
      email: this.contactEmail,
      params: {
        channel: "EMAIL",
      },
    });

    $.export("$summary", `Retrieved subscription preferences for ${this.contactEmail}`);
    return response;
  },
};
