import stannp from "../../stannp.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "stannp-create-campaign",
  name: "Create a New Campaign",
  description: "Create a new campaign in Stannp. [See the documentation](https://www.stannp.com/us/direct-mail-api/campaigns)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    stannp,
    campaignName: {
      propDefinition: [
        stannp,
        "campaignName",
      ],
    },
    campaignType: {
      propDefinition: [
        stannp,
        "campaignType",
      ],
    },
    templateId: {
      propDefinition: [
        stannp,
        "templateId",
        (c) => ({
          groupId: c.groupId,
        }),
      ],
      async options({ groupId }) {
        if (groupId) {
          return this.stannp.listTemplates({
            groupId,
          });
        }
        return [];
      },
    },
    groupId: {
      propDefinition: [
        stannp,
        "groupId",
      ],
      async options() {
        return this.stannp.listGroups();
      },
    },
    whatRecipients: {
      propDefinition: [
        stannp,
        "whatRecipients",
      ],
    },
    addons: {
      propDefinition: [
        stannp,
        "addons",
      ],
    },
    admail: {
      propDefinition: [
        stannp,
        "admail",
      ],
    },
    recipientId: {
      propDefinition: [
        stannp,
        "recipientId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.stannp.createCampaign({
      campaignName: this.campaignName,
      campaignType: this.campaignType,
      templateId: this.templateId,
      groupId: this.groupId,
      whatRecipients: this.whatRecipients,
      addons: this.addons,
      admail: this.admail,
      recipientId: this.recipientId,
    });

    $.export("$summary", `Successfully created campaign ${this.campaignName}`);
    return response;
  },
};
