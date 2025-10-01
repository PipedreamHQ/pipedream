import hostaway from "../../hostaway.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "hostaway-send-message-to-guest",
  name: "Send Message To Guest",
  description: "Send a conversation message to a guest in Hostaway. [See the documentation](https://api.hostaway.com/documentation#send-conversation-message)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hostaway,
    listingId: {
      propDefinition: [
        hostaway,
        "listingId",
      ],
    },
    reservationId: {
      propDefinition: [
        hostaway,
        "reservationId",
        (c) => ({
          listingId: c.listingId,
        }),
      ],
    },
    conversationId: {
      propDefinition: [
        hostaway,
        "conversationId",
        (c) => ({
          reservationId: c.reservationId,
        }),
      ],
    },
    body: {
      type: "string",
      label: "Message Body",
      description: "The message contents",
    },
    communicationType: {
      type: "string",
      label: "Communication Type",
      description: "The communication gateway",
      options: constants.COMMUNICATION_TYPES,
    },
  },
  async run({ $ }) {
    const { result } = await this.hostaway.sendMessage({
      conversationId: this.conversationId,
      data: {
        accountId: this.hostaway.$auth.account_id,
        conversationId: this.conversationId,
        listingMapId: this.listingId,
        body: this.body,
        communicationType: this.communicationType,
        reservationId: this.reservationId,
      },
      $,
    });

    if (result?.id) {
      $.export("summary", `Successfully sent message with ID ${result.id}.`);
    }

    return result;
  },
};
