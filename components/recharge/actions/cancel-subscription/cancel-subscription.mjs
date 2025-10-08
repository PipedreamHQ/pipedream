import recharge from "../../recharge.app.mjs";

export default {
  key: "recharge-cancel-subscription",
  name: "Cancel Subscription",
  description: "Cancels an existing subscription. [See the documentation](https://developer.rechargepayments.com/2021-11/subscriptions/subscriptions_cancel)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    recharge,
    subscriptionId: {
      propDefinition: [
        recharge,
        "subscriptionId",
      ],
    },
    cancellationReason: {
      type: "string",
      label: "Cancellation Reason",
      description: "Reason for subscription cancellation.",
    },
    cancellationReasonComment: {
      type: "string",
      label: "Cancellation Reason Comment",
      description: "Cancellation reason comment. Maximum length is 1024 characters.",
      optional: true,
    },
    sendEmail: {
      type: "boolean",
      label: "Send Email",
      description: "If set to `false`, subscription cancelled email will not be sent to customer and store owner.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.recharge.cancelSubscription({
      $,
      subscriptionId: this.subscriptionId,
      data: {
        cancellation_reason: this.cancellationReason,
        cancellation_reason_comments: this.cancellationReasonComment,
        send_email: this.sendEmail,
      },
    });
    $.export("$summary", `Successfully cancelled subscription ${this.subscriptionId}`);
    return response;
  },
};
