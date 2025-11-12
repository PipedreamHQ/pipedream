import activecampaign from "../../activecampaign.app.mjs";

export default {
  key: "activecampaign-add-contact-to-automation",
  name: "Add Contact to Automation",
  description: "Adds an existing contact to an existing automation. See the docs [here](https://developers.activecampaign.com/reference/create-new-contactautomation).",
  version: "0.2.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    activecampaign,
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Contact ID of the Contact, to be linked to the contactAutomation",
      optional: false,
      propDefinition: [
        activecampaign,
        "contacts",
      ],
    },
    automationId: {
      type: "string",
      label: "Automation ID",
      description: "Automation ID of the automation, to be linked to the contactAutomation.",
      optional: false,
      propDefinition: [
        activecampaign,
        "automations",
      ],
    },
  },
  async run({ $ }) {
    const {
      contactId,
      automationId,
    } = this;

    const response = await this.activecampaign.addContactToAutomation({
      data: {
        contactAutomation: {
          contact: parseInt(contactId),
          automation: parseInt(automationId),
        },
      },
    });

    $.export("$summary", `Successfully added a contact automation with ID ${response.contactAutomation.id}`);

    return response;
  },
};
