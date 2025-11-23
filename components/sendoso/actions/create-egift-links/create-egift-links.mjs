import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-create-egift-links",
  name: "Create eGift Links",
  description: "Generate eGift links. [See the documentation](https://developer.sendoso.com/rest-api/reference/sends/egift/eGiftlink)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendoso,
    touchId: {
      propDefinition: [
        sendoso,
        "touchId",
      ],
    },
    viaFrom: {
      type: "string",
      label: "Via From",
      description: "The name of the application making the send request. Please make sure this is consistent per application.",
    },
    recipientUsers: {
      type: "string[]",
      label: "Recipient Users",
      description: "The list of recipient emails to generate eGift links for.",
    },
  },
  async run({ $ }) {
    const response = await this.sendoso.createEgiftLinks({
      $,
      data: {
        send: {
          touch_id: this.touchId,
          via: "generate_egift_links",
          via_from: this.viaFrom,
          recipient_users: this.recipientUsers.map((email) => ({
            email,
          })),
        },
      },
    });
    $.export("$summary", "Successfully created eGift links");
    return response;
  },
};
