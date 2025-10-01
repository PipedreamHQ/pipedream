import dbt from "../../dbt.app.mjs";

export default {
  key: "dbt-get-run-artifact",
  name: "Get Run Artifact",
  description: "Retrieve information about a run artifact. [See the documentation](https://docs.getdbt.com/dbt-cloud/api-v2#/operations/Retrieve%20Run%20Artifact)",
  version: "0.0.3",
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
    runArtifact: {
      propDefinition: [
        dbt,
        "runArtifact",
        (c) => ({
          accountId: c.accountId,
          runId: c.runId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dbt.getRunArtifact({
      accountId: this.accountId,
      runId: this.runId,
      remainder: this.runArtifact,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved run artifact ${this.runArtifact}.`);
    }

    return response;
  },
};
