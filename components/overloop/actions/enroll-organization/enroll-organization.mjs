import overloop from "../../overloop.app.mjs";

export default {
  key: "overloop-enroll-organization",
  name: "Enroll Organization",
  description: "Enroll an organization in a workflow. [See the docs](https://apidoc.overloop.com/#enrollments)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    overloop,
    organizationId: {
      propDefinition: [
        overloop,
        "organizationId",
      ],
      optional: false,
    },
    workflowId: {
      propDefinition: [
        overloop,
        "automationId",
        () => ({
          type: "workflow",
          status: "on",
          recordType: "organizations",
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
          organization_id: this.organizationId,
        },
      },
    };

    const { data: response } = await this.overloop.createEnrollment(this.workflowId, {
      data,
      $,
    });

    $.export("$summary", `Organization with ID ${this.organizationId} added to workflow with ID ${this.workflowId}.`);

    return response;
  },
};
