import app from "../../paykickstart.app.mjs";

export default {
  key: "paykickstart-cancel-subscription",
  name: "Cancel Subscription",
  description: "Cancels an active subscription in PayKickstart. [See the documentation](https://docs.paykickstart.com/)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    invoiceId: {
      propDefinition: [
        app,
        "invoiceId",
      ],
    },
    cancelAt: {
      type: "integer",
      label: "Cancel At",
      description: "Unix timestamp for specific cancellation date (optional)",
      optional: true,
    },
    fireEvent: {
      type: "integer",
      label: "Fire Event",
      description: "Whether to trigger cancellation events (1 = yes, 0 = no)",
      optional: true,
      default: 1,
      options: [
        {
          label: "Yes",
          value: 1,
        },
        {
          label: "No",
          value: 0,
        },
      ],
    },
    chargeOverage: {
      type: "integer",
      label: "Charge Overage",
      description: "Calculate and charge overage fees during cancellation (1 = yes, 0 = no)",
      optional: true,
      default: 0,
      options: [
        {
          label: "Yes",
          value: 1,
        },
        {
          label: "No",
          value: 0,
        },
      ],
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
    idempotentHint: true,
  },
  async run({ $ }) {
    const {
      app,
      invoiceId,
      cancelAt,
      fireEvent,
      chargeOverage,
    } = this;

    const data = {
      invoice_id: invoiceId,
      fire_event: fireEvent,
      charge_overage: chargeOverage,
    };

    if (cancelAt) {
      data.cancel_at = cancelAt;
    }

    const response = await app.cancelSubscription({
      $,
      data,
    });

    $.export("$summary", `Successfully cancelled subscription ${invoiceId}`);
    return response;
  },
};
