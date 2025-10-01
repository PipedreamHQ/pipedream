import app from "../../google_tag_manager.app.mjs";

export default {
  name: "Get Tag",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "google_tag_manager-get-tag",
  description: "Get a specific tag of a workspace. [See the documentation](https://developers.google.com/tag-platform/tag-manager/api/v2/reference/accounts/containers/workspaces/tags/get)",
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
    tagId: {
      optional: false,
      propDefinition: [
        app,
        "tagId",
        (c) => ({
          accountId: c.accountId,
          containerId: c.containerId,
          workspaceId: c.workspaceId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getTag({
      $,
      accountId: this.accountId,
      containerId: this.containerId,
      workspaceId: this.workspaceId,
      tagId: this.tagId,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved tag with ID ${this.tagId}`);
    }

    return response;
  },
};
