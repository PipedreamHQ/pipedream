import app from "../../the_magic_drip.app.mjs";

export default {
  key: "the_magic_drip-add-lead-to-campaign",
  name: "Add Lead to Campaign",
  description: "Add a lead to a campaign. [See the documentation](https://docs.themagicdrip.com/api-reference/endpoint/post-v1campaignleads)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    campaignId: {
      propDefinition: [
        app,
        "campaignId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the lead",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the lead",
    },
    linkedInPublicUrl: {
      type: "string",
      label: "LinkedIn Public URL",
      description: "LinkedIn public URL of the lead",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company of the lead",
      optional: true,
    },
    companyLinkedInUrl: {
      type: "string",
      label: "Company LinkedIn URL",
      description: "LinkedIn URL of the company",
      optional: true,
    },
    customVariables: {
      type: "object",
      label: "Custom Variables",
      description: "More information about the lead",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app, campaignId, ...lead
    } = this;
    const response = await app.addLeadToCampaign({
      $,
      campaignId,
      data: {
        leadsWithCustomVariables: [
          lead,
        ],
      },
    });
    $.export(
      "$summary",
      `Successfully added lead "${lead.lastName}" to campaign`,
    );
    return response;
  },
};
