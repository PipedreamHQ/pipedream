import overloop from "../../overloop.app.mjs";

export default {
  key: "overloop-enroll-contact",
  name: "Enroll Contact",
  description: "Enroll a contact in a workflow. [See the docs](https://apidoc.overloop.com/#enrollments)",
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
    workflowId: {
      propDefinition: [
        overloop,
        "automationId",
        () => ({
          type: "workflow",
          status: "on",
          recordType: "contacts",
        }),
      ],
      label: "Workflow ID",
      description: "The identifier of a workflow",
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

    const { data: response } = await this.overloop.createEnrollment(this.workflowId, {
      data,
      $,
    });

    $.export("$summary", `Contact with ID ${this.contactId} added to workflow with ID ${this.workflowId}.`);

    return response;
  },
};
