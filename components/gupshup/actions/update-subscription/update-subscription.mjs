import gupshup from "../../gupshup.app.mjs";

export default {
  key: "gupshup-update-subscription",
  name: "Update Subscription",
  description: "Update a subscription. Requires a paid Gupshup account. [See the documentation](https://docs.gupshup.io/reference/updateanexisitngsubscription)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    gupshup,
    info: {
      type: "alert",
      alertType: "info",
      content: "Note: This action requires a paid Gupshup account.",
    },
    subscriptionId: {
      type: "string",
      label: "Subscription ID",
      description: "The ID of the subscription to update",
    },
    modes: {
      type: "string",
      label: "Modes",
      description: "The modes of the subscription",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The subscription URL",
    },
    version: {
      type: "integer",
      label: "Version",
      description: "The version of the subscription",
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Whether the subscription is active",
    },
  },
  async run({ $ }) {
    const response = await this.gupshup.updateSubscription({
      $,
      subscriptionId: this.subscriptionId,
      data: {
        modes: this.modes,
        url: this.url,
        version: this.version,
        active: this.active,
      },
    });
    if (response.status === "success") {
      $.export("$summary", `Successfully updated subscription ${this.subscriptionId}`);
    }
    return response;
  },
};
