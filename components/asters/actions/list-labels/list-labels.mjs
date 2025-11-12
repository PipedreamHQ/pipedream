import asters from "../../asters.app.mjs";

export default {
  key: "asters-list-labels",
  name: "List Labels",
  description: "Retrieve the list of all labels of a specific workspace. [See the documentation](https://docs.asters.ai/api/endpoints/labels)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    asters,
    workspaceId: {
      propDefinition: [
        asters,
        "workspaceId",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.asters.listLabels({
      workspaceId: this.workspaceId,
    });
    $.export("$summary", `Successfully retrieved ${data.length} label${data.length === 1
      ? ""
      : "s"}`);
    return data;
  },
};
