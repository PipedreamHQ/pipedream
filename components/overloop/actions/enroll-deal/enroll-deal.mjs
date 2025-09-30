import overloop from "../../overloop.app.mjs";

export default {
  key: "overloop-enroll-deal",
  name: "Enroll Deal",
  description: "Enroll a deal in a workflow. [See the docs](https://apidoc.overloop.com/#enrollments)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    overloop,
    dealId: {
      propDefinition: [
        overloop,
        "dealId",
      ],
    },
    workflowId: {
      propDefinition: [
        overloop,
        "automationId",
        () => ({
          type: "workflow",
          status: "on",
          recordType: "deals",
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
          deal_id: this.dealId,
        },
      },
    };

    const { data: response } = await this.overloop.createEnrollment(this.workflowId, {
      data,
      $,
    });

    $.export("$summary", `Deal with ID ${this.dealId} added to workflow with ID ${this.workflowId}.`);

    return response;
  },
};
