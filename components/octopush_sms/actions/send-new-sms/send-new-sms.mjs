import octopush from "../../octopush_sms.app.mjs";

export default {
  key: "octopush_sms-send-new-sms",
  name: "Send New SMS",
  description: "Sends a new SMS using Octopush SMS. [See the documentation](https://dev.octopush.com/en/sms-gateway-api-documentation/send-sms/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    octopush,
    text: {
      type: "string",
      label: "Text",
      description: "The message text (from 1 to 1224 characters).",
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the recipient",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the recipient",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the recipient",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Campaign Type",
      options: [
        "sms_premium",
        "sms_low_cost",
      ],
    },
    sender: {
      type: "string",
      label: "Sender",
      description: "Sender of the message (if the user allows it), 3-11 alphanumeric characters (a-zA-Z0-9)",
      optional: true,
    },
    sendAt: {
      type: "string",
      label: "Send At",
      description: "When you want to send the sms campaign. Format: DateTime ISO8601 (for ex: “2018-10-03T07:42:39-07:00”)",
      optional: true,
    },
    purpose: {
      type: "string",
      label: "Purpose",
      description: "Campaign purpose",
      options: [
        "alert",
        "wholesale",
      ],
      optional: true,
    },
    withReplies: {
      type: "boolean",
      label: "With Replies",
      description: "Set to `true` to get back recipient replies",
      optional: true,
    },
    simulationMode: {
      type: "boolean",
      label: "Simulation Mode",
      description: "If this value is `true`, your request will be simulated, and you will receive a fake result",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.octopush.sendSMS({
      $,
      data: {
        text: this.text,
        recipients: [
          {
            phone_number: this.phone,
            first_name: this.firstName,
            last_name: this.lastName,
          },
        ],
        type: this.type,
        send_at: this.sendAt,
        purpose: this.purpose,
        with_replies: this.withReplies,
        simulation_mode: this.simulationMode,
      },
    });
    $.export("$summary", "Successfully send new SMS.");
    return response;
  },
};
