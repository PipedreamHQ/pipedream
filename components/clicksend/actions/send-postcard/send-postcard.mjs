import clicksend from "../../clicksend.app.mjs";

export default {
  key: "clicksend-send-postcard",
  name: "Send Postcard",
  description: "Sends a physical postcard globally. PDF document printed and delivered via post.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    clicksend,
    pdfDocument: {
      ...clicksend.propDefinitions.pdfDocument,
      description: "The PDF document to be printed and delivered via post",
    },
    recipientAddress: {
      ...clicksend.propDefinitions.recipientAddress,
      description: "The address to which the physical postcard will be sent",
    },
    personalisedMessageContent: {
      ...clicksend.propDefinitions.personalisedMessageContent,
      optional: true,
      description: "The personalised message content for the physical postcard",
    },
  },
  async run({ $ }) {
    const response = await this.clicksend.sendPostcard({
      pdfDocument: this.pdfDocument,
      recipientAddress: this.recipientAddress,
      personalisedMessageContent: this.personalisedMessageContent,
    });
    $.export("$summary", "Successfully sent postcard");
    return response;
  },
};
