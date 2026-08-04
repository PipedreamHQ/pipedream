import app from "../../roblox.app.mjs";

export default {
  key: "roblox-get-group",
  name: "Get Group",
  description: "Get information about a Roblox group by ID. [See the documentation](https://create.roblox.com/docs/cloud/reference/Group#Cloud_GetGroup)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    groupId: {
      propDefinition: [
        app,
        "groupId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getGroup({
      $,
      groupId: this.groupId,
    });
    $.export("$summary", `Retrieved group ${response.displayName} (${response.id})`);
    return response;
  },
};
