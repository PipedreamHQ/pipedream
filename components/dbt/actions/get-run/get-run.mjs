import dbt from "../../dbt.app.mjs";

export default {
  key: "dbt-get-run",
  name: "Get Run",
  description: "Retrieve information about a run. [See the documentation](https://docs.getdbt.com/dbt-cloud/api-v2#/operations/Retrieve%20Run)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    runId: {
      propDefinition: [
        dbt,
        "runId",
        (c) => ({
          accountId: c.accountId,
          projectId: c.projectId,
          environmentId: c.environmentId,
        }),
      ],
    },
    includeRelated: {
      type: "string[]",
      label: "Include Related",
      description: "List of related fields to pull with the run",
      options: [
        "job",
        "trigger",
        "environment",
        "repository",
        "run_steps",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.dbt.getRun({
      accountId: this.accountId,
      runId: this.runId,
      params: this.includeRelated
        ?
        {
          include_related: JSON.stringify(this.includeRelated),
        }
        :
        {},
      $,
    });

    if (data) {
      $.export("$summary", `Successfully retrieved data for run with ID ${this.runId}.`);
    }

    return data;
  },
};
