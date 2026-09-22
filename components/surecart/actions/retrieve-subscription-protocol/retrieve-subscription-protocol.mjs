import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-subscription-protocol",
  name: "Retrieve Subscription Protocol",
  description: "Retrieve the account-level subscription protocol settings, including cancellation behavior and retry windows. [See the documentation](https://developer.surecart.com/api-reference/subscription-protocols/retrieve)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
  },
  async run({ $ }) {
    const response = await this.surecart.getSubscriptionProtocol({
      $,
    });
    $.export("$summary", "Successfully retrieved subscription protocol");
    return response;
  },
};
