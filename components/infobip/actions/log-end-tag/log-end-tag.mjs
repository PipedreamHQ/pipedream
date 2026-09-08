import infobip from "../../infobip.app.mjs";

export default {
  key: "log-end-tag",
  name: "Confirm Conversion (Log End Tag)",
  description:
    "Confirm conversion Use this endpoint to inform the Infobip platform about the successful conversion on your side. Infobip will use this information to monitor SMS performance and provide you with b... [See the documentation](https://www.infobip.com/docs/api)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip,
    messageId: {
      propDefinition: [infobip, "messageId"],
      optional: false,
    }
  },
  async run({ $ }) {
    const { infobip, messageId, ...params } = this;

    const response = await infobip.logEndTag({
      $,
      pathParams: [{ name: "messageId", value: messageId }],
    });

    $.export(
      "$summary",
      `Conversion logged successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
