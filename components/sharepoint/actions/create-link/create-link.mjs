import sharepoint from "../../sharepoint.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "sharepoint-create-link",
  name: "Create Link",
  description: "Create a sharing link for a DriveItem. [See the documentation](https://docs.microsoft.com/en-us/graph/api/driveitem-createlink?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    sharepoint,
    siteId: {
      propDefinition: [
        sharepoint,
        "siteId",
      ],
    },
    driveId: {
      propDefinition: [
        sharepoint,
        "driveId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
    fileId: {
      propDefinition: [
        sharepoint,
        "fileId",
        (c) => ({
          siteId: c.siteId,
          driveId: c.driveId,
          excludeFolders: false,
        }),
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of sharing link to create. Either `view`, `edit`, or `embed`.",
      options: constants.SHARING_LINK_TYPE_OPTIONS,
    },
    scope: {
      type: "string",
      label: "Scope",
      description: "The scope of link to create. Either `anonymous` or `organization`.",
      options: constants.SHARING_LINK_SCOPE_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sharepoint.createLink({
      $,
      siteId: this.siteId,
      fileId: this.fileId,
      data: {
        type: this.type,
        scope: this.scope,
      },
    });

    if (response?.id) {
      $.export("$summary", `Successfully created a sharing link with ID \`${response.id}\`.`);
    }

    return response;
  },
};
