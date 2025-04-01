import bloomerang from "../../bloomerang.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "bloomerang-add-interaction",
  name: "Add Interaction",
  description: "Adds an interaction to an existing constituent in Bloomerang. [See the documentation](https://bloomerang.co/product/integrations-data-management/api/rest-api/)",
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
    interactionType: {
      propDefinition: [
        bloomerang,
        "interactionType",
      ],
    },
    interactionDate: {
      propDefinition: [
        bloomerang,
        "interactionDate",
      ],
    },
    notes: {
      propDefinition: [
        bloomerang,
        "notes",
      ],
      optional: true,
    },
    campaignId: {
      propDefinition: [
        bloomerang,
        "campaignId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bloomerang.createInteraction({
      constituentId: this.constituentId,
      interactionType: this.interactionType,
      interactionDate: this.interactionDate,
      notes: this.notes,
      campaignId: this.campaignId,
    });

    $.export("$summary", `Successfully added interaction with ID ${response.id}`);
    return response;
  },
};
