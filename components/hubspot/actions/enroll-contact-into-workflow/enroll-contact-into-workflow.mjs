import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-enroll-contact-into-workflow",
  name: "Enroll Contact Into Workflow",
  description: "Add a contact to a workflow. Note: The Workflows API currently only supports contact-based workflows. [See the docs here](https://legacydocs.hubspot.com/docs/methods/workflows/add_contact)",
  version: "0.0.1",
  type: "action",
  props: {
    hubspot,
    workflow: {
      propDefinition: [
        hubspot,
        "workflow",
      ],
    },
    contactEmail: {
      propDefinition: [
        hubspot,
        "contactEmail",
      ],
      description: `The email of the contact to be added to the list. ${hubspot.propDefinitions.contactEmail.description}`,
    },
  },
  async run({ $ }) {
    const {
      workflow,
      contactEmail,
    } = this;
    const response = await this.hubspot.addContactsIntoWorkflow(workflow, contactEmail, $);

    $.export("$summary", "Successfully added contact into workflow");
    return response;
  },
};
