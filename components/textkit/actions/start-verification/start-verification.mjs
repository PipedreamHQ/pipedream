import textkit from "../../textkit.app.mjs";

export default {
  key: "textkit-start-verification",
  name: "Start Verification",
  description: "Text a one-time code to a phone number."
    + " Then ask the user for the code and pass it to **Check Verification** with the same phone number."
    + " Codes expire after 10 minutes. With a test key, nothing is sent and the code is always `111111`."
    + " [See the documentation](https://jointextkit.com/docs/verify)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    textkit,
    phone: {
      propDefinition: [
        textkit,
        "phone",
      ],
    },
    appName: {
      type: "string",
      label: "App Name",
      description: "Your product name, shown in the message, up to 24 characters (e.g. `Acme`)",
      optional: true,
    },
    from: {
      propDefinition: [
        textkit,
        "from",
      ],
      description: "Send from one of your numbers in E.164 format (e.g. `+15005550100`) instead of the TextKit pool. Use **List Numbers** to find your numbers (the `phone_number` field).",
    },
    userIp: {
      type: "string",
      label: "User IP",
      description: "Your end user's IP address, used for per-IP rate limits (e.g. `203.0.113.7`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.textkit.startVerification({
      $,
      data: {
        channel: "sms",
        phone: this.phone,
        app_name: this.appName || undefined,
        from: this.from || undefined,
        user_ip: this.userIp || undefined,
      },
    });
    $.export("$summary", `Sent a verification code to ${this.phone}`);
    return response;
  },
};
