import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-get-send-details",
  name: "Get Send Details",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve detailed information about a specific send. [See the documentation](https://sendoso.docs.apiary.io/#reference/send-management)",
  type: "action",
  props: {
    sendoso,
    sendId: {
      propDefinition: [
        sendoso,
        "sendId",
      ],
      description: "The unique ID of the send to retrieve.",
    },
  },
  async run({ $ }) {
    const { sendId } = this;

    const response = await this.sendoso.getSend({
      $,
      sendId,
    });

    $.export("$summary", `Successfully retrieved details for send ID: ${sendId}`);
    return response;
  },
};

