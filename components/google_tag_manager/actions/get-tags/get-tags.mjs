import app from "../../google_tag_manager.app.mjs";

export default {
  name: "Get Tags",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "google_tag_manager-get-tags",
  description: "Get all tags of an workspace. [See the documentation](https://developers.google.com/tag-platform/tag-manager/api/v2/reference/accounts/containers/workspaces/tags/list)",
  type: "action",
  props: {
    app,
    accountId: {
      optional: false,
      propDefinition: [
        app,
        "accountId",
      ],
    },
    containerId: {
      optional: false,
      propDefinition: [
        app,
        "containerId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
    workspaceId: {
      optional: false,
      propDefinition: [
        app,
        "workspaceId",
        (c) => ({
          accountId: c.accountId,
          containerId: c.containerId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getTags({
      $,
      accountId: this.accountId,
      containerId: this.containerId,
      workspaceId: this.workspaceId,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved ${response.tag.length ?? 0} tags`);
    }

    return response;
  },
};
