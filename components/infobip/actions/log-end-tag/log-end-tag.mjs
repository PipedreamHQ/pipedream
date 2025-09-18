import infobip from "../../infobip-enhanced.app.mjs";

export default {
  key: "infobip-log-end-tag",
  name: "Confirm Conversion (Log End Tag)",
  description:
    "Confirm conversion Use this endpoint to inform the Infobip platform about the successful conversion on your side. Infobip will use this information to monitor SMS performance and provide you with b... [See the documentation](https://www.infobip.com/docs/api)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip
  },
  async run({ $ }) {
    const { infobip, ...params } = this;

    const response = await infobip.logEndTag({ $ });

    $.export(
      "$summary",
      `Conversion logged successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
