import app from "../../workbooks_crm.app.mjs";

export default {
  key: "workbooks_crm-update-person",
  name: "Update Person",
  description: "Updates a person.",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    personId: {
      description: "Person ID to be updated.",
      propDefinition: [
        app,
        "personId",
      ],
    },
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
      personId,
      name,
      assignedTo,
      biography,
      mainEmail,
    } = this;

    const response = await this.app.updatePerson({
      step,
      personId,
      data: {
        "id": [
          personId,
        ],
        "assigned_to": [
          assignedTo,
        ],
        "main_location[email]": [
          mainEmail,
        ],
        "name": [
          name,
        ],
        "biography": [
          biography,
        ],
      },
    });

    step.export("$summary", `Successfully updated person with ID ${response.affected_objects[0].id}`);

    return response;
  },
};
