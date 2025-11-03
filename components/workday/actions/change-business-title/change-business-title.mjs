import workday from "../../workday.app.mjs";

export default {
  key: "workday-change-business-title",
  name: "Change Business Title",
  description: "Change the business title of a worker. [See the documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#common/v1/post-/workers/-ID-/businessTitleChanges)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    workday,
    workerId: {
      propDefinition: [
        workday,
        "workerId",
      ],
    },
    proposedBusinessTitle: {
      type: "string",
      label: "Proposed Business Title",
      description: "The new business title for the worker",
    },
  },
  async run({ $ }) {
    const response = await this.workday.changeBusinessTitle({
      $,
      workerId: this.workerId,
      data: {
        proposedBusinessTitle: this.proposedBusinessTitle,
      },
    });
    $.export("$summary", `Successfully changed business title for worker ${this.workerId}`);
    return response;
  },
};
