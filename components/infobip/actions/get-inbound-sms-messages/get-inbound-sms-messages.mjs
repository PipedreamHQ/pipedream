import infobip from "../../infobip-enhanced.app.mjs";

export default {
  key: "infobip-get-inbound-sms-messages",
  name: "Get Inbound SMS Messages",
  description:
    "Get inbound SMS messages If you are unable to receive incoming SMS to the endpoint of your choice in real-time, you can use this API call to fetch messages. Each request will return a batch of rece... [See the documentation](https://www.infobip.com/docs/api)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip
  },
  async run({ $ }) {
    const { infobip, ...params } = this;

    const response = await infobip.getInboundSmsMessages({ $ });

    $.export(
      "$summary",
      `Data retrieved successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
