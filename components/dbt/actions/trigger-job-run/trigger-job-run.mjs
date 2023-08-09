import dbt from "../../dbt.app.mjs";

export default {
  key: "dbt-get-trigger-job-run",
  name: "Trigger Job Run",
  description: "Trigger a specified job to begin running. [See the documentation]()",
  version: "0.0.1",
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
  },
  async run({ $ }) {
    const { data } = await this.dbt.triggerJobRun({
      accountId: this.accountId,
      jobId: this.jobId,
      data: {
        cause: "Triggered manually",
      },
      $,
    });

    if (data) {
      $.export("$summary", `Successfully triggerd job with ID ${this.jobId}.`);
    }

    return data;
  },
};
