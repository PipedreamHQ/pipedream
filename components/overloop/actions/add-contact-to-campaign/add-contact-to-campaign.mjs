import overloop from "../../overloop.app.mjs";

export default {
  key: "overloop-add-contact-to-campaign",
  name: "Add Contact to Campaign",
  description: "Adds a contact to a campaign. [See the docs](https://apidoc.overloop.com/#enrollments)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    overloop,
    contactId: {
      propDefinition: [
        overloop,
        "contactId",
      ],
    },
    campaignId: {
      propDefinition: [
        overloop,
        "automationId",
        () => ({
          type: "campaign",
          status: "on",
        }),
      ],
    },
  },
  async run({ $ }) {
    const data = {
      data: {
        type: "enrollments",
        attributes: {
          contact_id: this.contactId,
        },
      },
    };

    const { data: response } = await this.overloop.createEnrollment(this.campaignId, {
      data,
      $,
    });

    $.export("$summary", `Contact with ID ${this.contactId} added to campaign with ID ${this.campaignId}.`);

    return response;
  },
};
