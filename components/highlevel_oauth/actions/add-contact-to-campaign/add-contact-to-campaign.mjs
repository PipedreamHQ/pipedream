import common from "../../common/base.mjs";

export default {
  ...common,
  key: "highlevel_oauth-add-contact-to-campaign",
  name: "Add Contact to Campaign",
  description: "Adds an existing contact to a campaign. [See the documentation](https://marketplace.gohighlevel.com/docs/ghl/contacts/add-contact-to-campaign)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    contactId: {
      propDefinition: [
        common.props.app,
        "contactId",
      ],
    },
    campaignId: {
      propDefinition: [
        common.props.app,
        "campaignId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.addContactToCampaign({
      $,
      contactId: this.contactId,
      campaignId: this.campaignId,
    });
    if (response?.succeded) {
      $.export("$summary", `Successfully added contact to campaign with ID: ${this.campaignId}`);
    }
    return response;
  },
};
