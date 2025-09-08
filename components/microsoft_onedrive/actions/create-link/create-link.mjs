import onedrive from "../../microsoft_onedrive.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  name: "Create Link",
  version: "0.0.2",
  key: "microsoft_onedrive-create-link",
  type: "action",
  description: "Create a sharing link for a DriveItem. [See the documentation](https://docs.microsoft.com/en-us/graph/api/driveitem-createlink?view=graph-rest-1.0&tabs=http)",
  props: {
    onedrive,
    driveItemId: {
      propDefinition: [
        onedrive,
        "fileId",
        () => ({
          excludeFolders: false,
        }),
      ],
      label: "Drive Item ID",
      description: "The ID of the DriveItem to create a sharing link for. **Search for the file/folder by name.**",
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
    const {
      driveItemId,
      type,
      scope,
    } = this;

    const response = await this.onedrive.createLink({
      driveItemId,
      type,
      scope,
    });

    $.export("$summary", `Successfully created a sharing link with id \`${response.id}\`.`);

    return response;
  },
};
