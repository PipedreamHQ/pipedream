import app from "../../workbooks_crm.app.mjs";

export default {
  key: "workbooks_crm-create-person",
  name: "Create Person",
  description: "Creates a person. People are recorded in your database, e.g a contact, an employee.",
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
      description: "A queue that this Person could be assigned to.",
      propDefinition: [
        app,
        "personQueue",
      ],
    },
    name: {
      type: "string",
      label: "Person Name",
      description: "The Person's name.",
    },
    biography: {
      type: "string",
      label: "Biography",
      description: "A description of this Person.",
      optional: true,
    },
    mainEmail: {
      type: "string",
      label: "Main Email",
      description: "The main email address of this Person.",
      optional: true,
    },
  },
  async run({ $: step }) {
    const {
      name,
      assignedTo,
      biography,
      mainEmail,
    } = this;

    const response = await this.app.createPerson({
      step,
      data: {
        name,
        "assigned_to": assignedTo,
        biography,
        "main_location[email]": mainEmail,
      },
    });

    step.export("$summary", `Successfully created person with ID ${response.data.id}`);

    return response;
  },
};
