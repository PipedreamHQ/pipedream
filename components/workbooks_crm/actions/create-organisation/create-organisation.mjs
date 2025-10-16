import app from "../../workbooks_crm.app.mjs";

export default {
  key: "workbooks_crm-create-organisation",
  name: "Create Organisation",
  description: "Creates an organisation. Organisations are recorded on your database, e.g Customers, Suppliers, Partners, Competition.",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    assignedTo: {
      label: "Assigned To",
      description: "A queue that this Organisation could be assigned to.",
      propDefinition: [
        app,
        "organizationQueue",
      ],
    },
    name: {
      type: "string",
      label: "Organisation Name",
      description: "The name of the Organisation.",
    },
    biography: {
      type: "string",
      label: "Biography",
      description: "A description of this Organisation.",
      optional: true,
    },
  },
  async run({ $: step }) {
    const {
      name,
      assignedTo,
      biography,
    } = this;

    const response = await this.app.createOrganisation({
      step,
      data: {
        name,
        assigned_to: assignedTo,
        biography,
      },
    });

    step.export("$summary", `Successfully created organisation with ID ${response.data.id}`);

    return response;
  },
};
