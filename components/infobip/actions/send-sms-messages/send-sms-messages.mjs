import infobip from "../../infobip-enhanced.app.mjs";

export default {
  key: "infobip-send-sms-messages",
  name: "Send SMS message",
  description:
    "Send SMS message With this API method, you can do anything from sending a basic message to one person, all the way to sending customized messages to thousands of recipients in one go. It comes with... [See the documentation](https://www.infobip.com/docs/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip
  },
  async run({ $ }) {
    const { infobip, ...params } = this;

    const response = await infobip.sendSmsMessages({ $ });

    $.export(
      "$summary",
      `Message sent successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
