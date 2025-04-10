import bloomerang from "../../bloomerang.app.mjs";
import {
  CHANNEL_OPTIONS, PURPOSE_OPTIONS,
} from "../../common/constants.mjs";

export default {
  key: "bloomerang-add-interaction",
  name: "Add Interaction",
  description: "Adds an interaction to an existing constituent in Bloomerang. [See the documentation](https://bloomerang.co/product/integrations-data-management/api/rest-api/#/Interactions/post_interaction)",
  version: "0.0.1",
  type: "action",
  props: {
    bloomerang,
    constituentId: {
      propDefinition: [
        bloomerang,
        "constituentId",
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the interaction",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject od the interation",
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "The channel of the interation",
      options: CHANNEL_OPTIONS,
    },
    purpose: {
      type: "string",
      label: "Purpose",
      description: "The purpose of the interation",
      options: PURPOSE_OPTIONS,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Note for the interaction",
      optional: true,
    },
    isInbound: {
      type: "boolean",
      label: "Is Inbound",
      description: "Was the interaction initiated by constituent?",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bloomerang.createInteraction({
      $,
      data: {
        AccountId: this.constituentId,
        Date: this.date,
        Subject: this.subject,
        Channel: this.channel,
        Purpose: this.purpose,
        note: this.note,
        IsInbound: this.isInbound,
      },
    });

    $.export("$summary", `Successfully added interaction with ID ${response.Id}`);
    return response;
  },
};
