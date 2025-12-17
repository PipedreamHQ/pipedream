import app from "../../https_airbyte_com.app.mjs";

export default {
  key: "https_airbyte_com-list-workspaces",
  name: "List Workspaces",
  description: "Lists workspaces on Airbyte. [See the documentation](https://reference.airbyte.com/reference/listworkspaces)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    includeDeleted: {
      propDefinition: [
        app,
        "includeDeleted",
      ],
    },
  },
  async run({ $ }) {
    const limit = 20;
    const params = {
      includeDeleted: this.includeDeleted,
      limit,
      offset: 0,
    };
    let total = 0;
    const workspaces = [];
    do {
      const { data } = await this.app.listWorkspaces({
        $,
        params,
      });
      workspaces.push(...data);
      total = data?.length;
      params.offset += limit;
    } while (total === limit);

    $.export("$summary", "Successfully retrieved the list of workspaces");

    return workspaces;
  },
};
