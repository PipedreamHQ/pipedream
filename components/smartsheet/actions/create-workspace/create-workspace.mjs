import app from "../../smartsheet.app.mjs";

export default {
  type: "action",
  key: "smartsheet-create-workspace",
  name: "Create Workspace",
  description: "Create a new workspace. [See the docs here](https://smartsheet.redoc.ly/tag/workspaces#operation/create-workspace)",
  version: "0.0.1",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the workspace",
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
    };
    const res = await this.app.createWorkspace(data, $);
    $.export("$summary", "Workspace successfully created");
    return res;
  },
};
