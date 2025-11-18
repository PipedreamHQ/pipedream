import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-cancel-send",
  name: "Cancel Send",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Cancel a pending or scheduled send before it is shipped. [See the documentation](https://sendoso.docs.apiary.io/#reference/send-management)",
  type: "action",
  props: {
    sendoso,
    sendId: {
      propDefinition: [
        sendoso,
        "sendId",
      ],
      description: "The unique ID of the send to cancel.",
    },
    reason: {
      type: "string",
      label: "Cancellation Reason",
      description: "Optional reason for cancelling the send.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      sendId,
      reason,
    } = this;

    const response = await this.sendoso.cancelSend({
      $,
      sendId,
      ...(reason && {
        reason,
      }),
    });

    $.export("$summary", `Successfully cancelled send ID: ${sendId}`);
    return response;
  },
};

