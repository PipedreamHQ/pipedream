import app from "../../xata.app.mjs";

export default {
  key: "xata-list-branches",
  name: "List Branches",
  description: "List branches of the specified database. [See the documentation](https://xata.io/docs/api-reference/dbs/db_name#list-branches)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    endpoint: {
      propDefinition: [
        app,
        "endpoint",
      ],
    },
    workspace: {
      propDefinition: [
        app,
        "workspace",
      ],
    },
    database: {
      propDefinition: [
        app,
        "database",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listBranches({
      $,
      endpoint: this.endpoint,
      database: this.database,
    });
    $.export("$summary", `Successfully retrieved '${response.branches.length}' branches`);
    return response;
  },
};
