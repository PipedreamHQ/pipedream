import infobip from "../../infobip-enhanced.app.mjs";

export default {
  key: "infobip-send-binary-sms-message",
  name: "Send Binary SMS Message",
  description:
    "Send binary SMS message Send single or multiple binary messages to one or more destination address. The API response will not contain the final delivery status, use [Delivery Reports](https://www.i... [See the documentation](https://www.infobip.com/docs/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip
  },
  async run({ $ }) {
    const { infobip, ...params } = this;

    const response = await infobip.sendBinarySmsMessage({ $ });

    $.export(
      "$summary",
      `Message sent successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
