import postalytics from "../../postalytics.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "postalytics-send-track-postcard-letter",
  name: "Send and Track Postcard or Letter",
  description: "Send a postcard or letter with the capability of tracking delivery and response. [See the documentation](https://postalytics.docs.apiary.io/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    postalytics,
    campaignId: {
      propDefinition: [
        postalytics,
        "campaignId",
      ],
    },
    contactId: {
      propDefinition: [
        postalytics,
        "contactId",
      ],
    },
    templateId: {
      propDefinition: [
        postalytics,
        "templateId",
      ],
    },
    mailPieceData: {
      type: "object",
      label: "Mail Piece Data",
      description: "Additional data for the mail piece, such as personalization details",
      optional: true,
    },
  },
  async run({ $ }) {
    const mailPieceData = this.mailPieceData || {};

    const response = await this.postalytics.sendMailPiece(this.campaignId, this.contactId, mailPieceData);

    $.export("$summary", `Sent postcard/letter for campaign ID ${this.campaignId} to contact ID ${this.contactId}`);
    return response;
  },
};
