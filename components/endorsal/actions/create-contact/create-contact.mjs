import endorsal from "../../endorsal.app.mjs";

export default {
  key: "endorsal-create-contact",
  name: "Create Contact",
  description: "Creates a new contact for requesting testimonials. [See the documentation](https://developers.endorsal.io/docs/endorsal/b3a6mtczmzu5na-create-a-new-contact)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    endorsal,
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the campaign",
      async options(opts) {
        const campaigns = await this.endorsal.listCampaigns();
        return campaigns.map((campaign) => ({
          value: campaign.id,
          label: campaign.name,
        }));
      },
    },
    contact: {
      type: "object",
      label: "Contact",
      description: "The contact details for requesting testimonials",
    },
  },
  async run({ $ }) {
    const contact = {
      campaignId: this.campaignId,
      ...this.contact,
    };
    const response = await this.endorsal.createContact(contact);
    $.export("$summary", `Successfully created contact with ID: ${response.id}`);
    return response;
  },
};
