import lemlist from "../../lemlist.app.mjs";

export default {
  key: "lemlist-update-lead-in-a-campaign",
  name: "Update Lead In Campaign",
  description: "This action updates a lead in a specific campaign. If the lead doesn't exist a 404 error will be returned. [See the docs here](https://developer.lemlist.com/#update-a-lead-in-a-campaign)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    lemlist,
    campaignId: {
      propDefinition: [
        lemlist,
        "campaignId",
      ],
      withLabel: true,
    },
    campaignEmail: {
      propDefinition: [
        lemlist,
        "campaignEmail",
        (c) => ({
          campaignId: c.campaignId.value,
        }),
      ],
    },
    firstName: {
      propDefinition: [
        lemlist,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        lemlist,
        "lastName",
      ],
    },
    picture: {
      propDefinition: [
        lemlist,
        "picture",
      ],
    },
    phone: {
      propDefinition: [
        lemlist,
        "phone",
      ],
    },
    linkedinUrl: {
      propDefinition: [
        lemlist,
        "linkedinUrl",
      ],
    },
    companyName: {
      propDefinition: [
        lemlist,
        "companyName",
      ],
    },
    icebreaker: {
      propDefinition: [
        lemlist,
        "icebreaker",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lemlist.updateLeadInACampaign({
      $,
      email: this.campaignEmail,
      campaignId: this.campaignId.value,
      data: {
        firstName: this.firstName,
        lastName: this.lastName,
        picture: this.picture,
        phone: this.phone,
        linkedinUrl: this.linkedinUrl,
        companyName: this.companyName,
        icebreaker: this.icebreaker,
      },
    });

    $.export("$summary", `Successfully updated ${this.campaignEmail} lead in ${this.campaignId.label} campaign!`);
    return response;
  },
};

