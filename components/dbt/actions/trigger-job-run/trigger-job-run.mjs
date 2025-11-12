import dbt from "../../dbt.app.mjs";

export default {
  key: "dbt-trigger-job-run",
  name: "Trigger Job Run",
  description: "Trigger a specified job to begin running. [See the documentation](https://docs.getdbt.com/dbt-cloud/api-v2#/operations/Trigger%20Job%20Run)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dbt,
    accountId: {
      propDefinition: [
        dbt,
        "accountId",
      ],
    },
    projectId: {
      propDefinition: [
        dbt,
        "projectId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
      optional: true,
    },
    environmentId: {
      propDefinition: [
        dbt,
        "environmentId",
        (c) => ({
          accountId: c.accountId,
          projectId: c.projectId,
        }),
      ],
      optional: true,
    },
    jobId: {
      propDefinition: [
        dbt,
        "jobId",
        (c) => ({
          accountId: c.accountId,
          projectId: c.projectId,
          environmentId: c.environmentId,
        }),
      ],
    },
    cause: {
      type: "string",
      label: "Cause",
      description: "Cause of the triggered job",
      optional: true,
      default: "Triggered via Pipedream",
    },
    steps: {
      type: "string[]",
      label: "Steps Override",
      description: "Steps to override the job's default steps",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.dbt.triggerJobRun({
      accountId: this.accountId,
      jobId: this.jobId,
      data: {
        cause: this.cause,
        steps_override: this.steps || undefined,
      },
      $,
    });

    if (data) {
      $.export("$summary", `Successfully triggered job with ID ${this.jobId}.`);
    }

    return data;
  },
};
