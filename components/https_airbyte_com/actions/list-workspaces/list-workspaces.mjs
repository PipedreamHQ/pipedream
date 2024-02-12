import app from "../../https_airbyte_com.app.mjs";

export default {
  key: "https_airbyte_com-list-workspaces",
  name: "List Workspaces",
  description: "Lists workspaces on Airbyte. [See the documentation](https://reference.airbyte.com/reference/listworkspaces)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listWorkspaces({
      $,
    });

    $.export("$summary", "Successfully retrieved the list of workspaces");

    return response;
  },
};
