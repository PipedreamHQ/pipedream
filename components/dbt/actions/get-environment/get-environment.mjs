import dbt from "../../dbt.app.mjs";

export default {
  key: "dbt-get-environment",
  name: "Get Environment",
  description: "Retrieve information about an environment. [See the documentation](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/Retrieve%20Projects%20Environment)",
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
    },
  },
  async run({ $ }) {
    const { data } = await this.dbt.getEnvironment({
      accountId: this.accountId,
      projectId: this.projectId,
      environmentId: this.environmentId,
      $,
    });

    if (data) {
      $.export("$summary", `Successfully retrieved data for environment with ID ${this.environmentId}.`);
    }

    return data;
  },
};
