import app from "../../avosms.app.mjs";

export default {
  name: "Send SMS",
  description: "Send a unique or mass SMS campaign. [See the documentation](https://www.avosms.com/en/api/documentation/sms/send)",
  key: "avosms-send-sms",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    recipients: {
      type: "string",
      label: "Recipients",
      description: "Recipient phone number(s). For mass SMS, separate numbers with commas.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "SMS content (max 600 characters).",
    },
    sender: {
      type: "string",
      label: "Sender Name",
      description: "Sender name (3-11 characters). Defaults to a short number if not provided.",
      optional: true,
    },
    deliveryDate: {
      type: "string",
      label: "Delivery Date",
      description: "Scheduled sending date in `DD/MM/YYYY` format.",
      optional: true,
    },
    deliveryHour: {
      type: "string",
      label: "Delivery Hour",
      description: "Scheduled sending time in `HH:MM` format.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "`N` for Notification or `M` for Marketing.",
      optional: true,
      options: [
        {
          label: "Notification",
          value: "N",
        },
        {
          label: "Marketing",
          value: "M",
        },
      ],
    },
    clickFollow: {
      type: "integer",
      label: "Click Follow",
      description: "Enable link tracking. `1` to enable, `0` to disable.",
      optional: true,
      options: [
        {
          label: "Enable",
          value: 1,
        },
        {
          label: "Disable",
          value: 0,
        },
      ],
    },
  },
  async run({ $ }) {
    const {
      recipients,
      message,
      sender,
      deliveryDate,
      deliveryHour,
      type,
      clickFollow,
    } = this;

    const response = await this.app.sendSms({
      $,
      data: {
        recipients,
        message,
        ...(sender && {
          sender,
        }),
        ...(deliveryDate && {
          deliveryDate,
        }),
        ...(deliveryHour && {
          deliveryHour,
        }),
        ...(type && {
          type,
        }),
        ...(clickFollow !== undefined && {
          clickFollow,
        }),
      },
    });

    $.export("$summary", `Successfully sent SMS campaign with ID ${response.send_id} to ${response.total_sms_sent} recipient(s)`);

    return response;
  },
};
