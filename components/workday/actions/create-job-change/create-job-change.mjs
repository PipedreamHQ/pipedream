import workday from "../../workday.app.mjs";

export default {
  key: "workday-create-job-change",
  name: "Create Job Change",
  description: "Create a job change for a worker. [See the documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#common/v1/post-/workers/-ID-/jobChanges)",
  version: "0.0.4",
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
    supervisoryOrganizationId: {
      propDefinition: [
        workday,
        "supervisoryOrganizationId",
      ],
    },
    jobChangeReasonId: {
      propDefinition: [
        workday,
        "jobChangeReasonId",
      ],
    },
    moveManagersTeam: {
      type: "boolean",
      label: "Move Managers Team",
      description: "Indicates whether teams reporting to the ~Manager~ moved with them during the Change Job Event",
      optional: true,
    },
    effective: {
      type: "string",
      label: "Effective",
      description: "The date this business process takes effect. Example: `2025-08-09T07:00:00.000Z`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.workday.createJobChange({
      $,
      workerId: this.workerId,
      data: {
        supervisoryOrganization: {
          id: this.supervisoryOrganizationId,
        },
        jobChangeReason: {
          id: this.jobChangeReasonId,
        },
        moveManagersTeam: this.moveManagersTeam,
        effective: this.effective,
      },
    });
    $.export("$summary", `Successfully created job change for worker ${this.workerId}`);
    return response;
  },
};
