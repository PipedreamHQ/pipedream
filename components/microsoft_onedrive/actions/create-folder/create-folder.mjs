import onedrive from "../../microsoft_onedrive.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Create Folder",
  description: "Create a new folder in a drive. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_post_children?view=odsp-graph-online)",
  key: "microsoft_onedrive-create-folder",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    onedrive,
    parentFolderType: {
      type: "string",
      label: "Parent Folder Type",
      description: "Whether to nest the new folder within a folder in your drive (`default`) or a shared folder (`shared`)",
      optional: true,
      options: [
        "default",
        "shared",
      ],
      reloadProps: true,
    },
    parentFolderId: {
      propDefinition: [
        onedrive,
        "folder",
      ],
      label: "Parent Folder ID",
      description: "The ID of the folder which the the new folder should be created. Use the \"Load More\" button to load subfolders.",
      hidden: true,
    },
    sharedFolderReference: {
      propDefinition: [
        onedrive,
        "sharedFolderReference",
      ],
      hidden: true,
    },
    folderName: {
      type: "string",
      label: "Folder Name",
      description: "The name of the new folder to be created. e.g. `New Folder`",
    },
  },
  async additionalProps(props) {
    if (this.parentFolderType === "default") {
      props.parentFolderId.hidden = false;
      props.sharedFolderReference.hidden = true;
    }
    if (this.parentFolderType === "shared") {
      props.sharedFolderReference.hidden = false;
      props.parentFolderId.hidden = true;
    }
    return {};
  },
  async run({ $ }) {
    const {
      folderName, parentFolderId, sharedFolderReference,
    } = this;

    if (sharedFolderReference && parentFolderId) {
      throw new ConfigurationError("You have to select either a `Parent Folder` or a `Shared Folder`.");
    }

    const response = await this.onedrive.createFolder({
      folderName,
      parentFolderId,
      sharedFolderReference,
    });

    if (response?.id) {
      $.export("$summary", `Successfully created folder with ID ${response.id}.`);
    }

    return response;
  },
};
