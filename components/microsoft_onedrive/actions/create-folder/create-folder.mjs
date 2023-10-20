import onedrive from "../../microsoft_onedrive.app.mjs";
import httpRequest from "../../common/httpRequest.mjs";

export default {
  name: "Create Folder",
  description: "Create a new folder in a drive. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_post_children?view=odsp-graph-online)",
  key: "microsoft_onedrive-create-folder",
  version: "0.0.1",
  type: "action",
  props: {
    onedrive,
    parentFolderId: {
      propDefinition: [
        onedrive,
        "folder",
      ],
      label: "Parent Folder ID",
      description: "The ID of the folder which the the new folder should be created.",
      optional: true,
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
      folderName, parentFolderId,
    }) {
      let url = "/root/children";
      if (parentFolderId) {
        url = `/items/${parentFolderId}/children`;
      }
      return this.httpRequest({
        url,
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
      folderName, parentFolderId,
    } = this;

    const response = await this.createFolder({
      folderName,
      parentFolderId,
    });

    if (response?.id) {
      $.export("$summary", `Successfully created folder with ID ${response.id}.`);
    }

    return response;
  },
};
