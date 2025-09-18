import infobip from "../../infobip-enhanced.app.mjs";

export default {
  key: "infobip-send-sms-message",
  name: "Send SMS Message V2",
  description:
    "Send SMS message Use this endpoint to send an SMS and set up a rich set of features, such as batch sending with a single API request, scheduling, URL tracking, language and transliteration configur... [See the documentation](https://www.infobip.com/docs/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip
  },
  async run({ $ }) {
    const { infobip, ...params } = this;

    const response = await infobip.sendSmsMessage({ $ });

    $.export(
      "$summary",
      `Message sent successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
