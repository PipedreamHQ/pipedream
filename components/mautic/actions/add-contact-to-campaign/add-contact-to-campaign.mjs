import mautic from "../../mautic.app.mjs";

export default {
  key: "mautic-add-contact-to-campaign",
  name: "Add Contact to a Campaign",
  description: "Adds a contact to a specific campaign. [See docs](https://developer.mautic.org/#add-contact-to-a-campaign)",
  version: "0.2.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mautic,
    campaignId: {
      propDefinition: [
        mautic,
        "campaignId",
      ],
      description: "ID of the campaign to add a contact to",
    },
    contactId: {
      propDefinition: [
        mautic,
        "contactId",
      ],
      description: "ID of the contact being added to the campaign",
    },
  },
  async run({ $ }) {
    const {
      campaignId,
      contactId,
    } = this;

    const response = await this.mautic.addContactToCampaign({
      $,
      campaignId,
      contactId,
    });
    $.export("$summary", "Successfully added contact to campaign");
    return response;
  },
};
