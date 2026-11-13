import dpd2 from "../../dpd2.app.mjs";

export default {
  key: "dpd2-find-subscriber",
  name: "Find Subscriber",
  description: "Find a subscription store's subscriber by their email address, with their subscription's status. [See the documentation](https://docs.getdpd.com/api/reference/operations/listsubscribers/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dpd2,
    storefrontId: {
      propDefinition: [
        dpd2,
        "subscriptionStorefrontId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The subscriber's email address, e.g. `sam@example.com`. Only exact matches are returned, ignoring case.",
    },
  },
  async run({ $ }) {
    const matches = await this.dpd2.listSubscribers({
      $,
      storefrontId: this.storefrontId,
      params: {
        username: this.email,
      },
    }) || [];
    const subscribers = matches.filter(({ username }) => this.dpd2.sameEmail(username, this.email));
    $.export("$summary", subscribers.length
      ? `Found subscriber ${subscribers[0].username}`
      : `No subscriber with the email ${this.email}`);
    return subscribers;
  },
};
