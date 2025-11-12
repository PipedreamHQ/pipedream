import asters from "../../asters.app.mjs";

export default {
  key: "asters-list-social-accounts",
  name: "List Social Accounts",
  description: "Retrieve the list of all social accounts of a specific workspace. [See the documentation](https://docs.asters.ai/api/endpoints/social-accounts)",
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
    const { data } = await this.asters.listSocialAccounts({
      workspaceId: this.workspaceId,
    });
    $.export("$summary", `Successfully retrieved ${data.length} social account${data.length === 1
      ? ""
      : "s"}`);
    return data;
  },
};
