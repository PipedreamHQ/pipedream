import onedrive from "../../microsoft_onedrive.app.mjs";
import httpRequest from "../../common/httpRequest.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Create Folder",
  description: "Create a new folder in a drive. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_post_children?view=odsp-graph-online)",
  key: "microsoft_onedrive-create-folder",
  version: "0.1.0",
  type: "action",
  props: {
    onedrive,
    parentFolderId: {
      propDefinition: [
        onedrive,
        "folder",
      ],
      label: "Parent Folder ID",
      description: "The ID of the folder which the the new folder should be created. Use the \"Load More\" button to load subfolders.",
      optional: true,
    },
    sharedFolderReference: {
      type: "string",
      label: "Shared Folder Reference",
      description: "The reference of the shared folder which the the new folder should be created.\n\nE.g. `/drives/{driveId}/items/{folderId}/children`",
      optional: true,
      async options() {
        const { value } = await this.httpRequest({
          url: "/sharedWithMe",
        });
        return value.map((shared) => ({
          label: shared.name,
          value: `/drives/${shared.remoteItem.parentReference.driveId}/items/${shared.remoteItem.id}/children`,
        }));
      },
    },
    folderName: {
      type: "string",
      label: "Folder Name",
      description: "The name of the new folder to be created. e.g. `New Folder`",
    },
  },
  methods: {
    httpRequest,
    createFolder({
      folderName, parentFolderId, sharedFolderReference,
    }) {
      let url = "/root/children";
      if (parentFolderId) {
        url = `/items/${parentFolderId}/children`;
      }
      if (sharedFolderReference) {
        url = sharedFolderReference;
      }
      return this.httpRequest({
        url,
        useSharedDrive: !!sharedFolderReference,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name: folderName,
          folder: {},
          ["@microsoft.graph.conflictBehavior"]: "rename",
        },
        method: "POST",
      });
    },
  },
  async run({ $ }) {
    const {
      folderName, parentFolderId, sharedFolderReference,
    } = this;

    if (sharedFolderReference && parentFolderId) {
      throw new ConfigurationError("You have to select either a `Parent Folder` or a `Shared Folder`.");
    }

    const response = await this.createFolder({
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
