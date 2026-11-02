import setsmart from "../../setsmart.app.mjs";

export default {
  key: "setsmart-cancel-scheduled-message",
  name: "Cancel Scheduled Message",
  description: "Cancel a message that is scheduled but not sent yet. [See the documentation](https://setsmart.io/api-documentation)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    setsmart,
    scheduledMessageId: {
      type: "string",
      label: "Scheduled Message ID",
      description: "The ID of the scheduled message, as returned by the **List Scheduled Messages** action",
    },
  },
  async run({ $ }) {
    const response = await this.setsmart.cancelScheduledMessage({
      $,
      data: {
        id: this.scheduledMessageId,
      },
    });

    $.export("$summary", `Successfully cancelled the scheduled message ${this.scheduledMessageId}`);
    return response;
  },
};
