import onedrive from "../../microsoft_onedrive.app.mjs";
import httpRequest from "../../common/httpRequest.mjs";

export default {
  key: "microsoft_onedrive-list-files-in-folder",
  name: "List Files in Folder",
  description: "Retrieves a list of the files and/or folders directly within a folder. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_list_children)",
  version: "0.0.1",
  type: "action",
  props: {
    onedrive,
    folderId: {
      propDefinition: [
        onedrive,
        "folder",
      ],
      label: "Folder ID",
      description: "The ID of the folder. Use the \"Load More\" button to load subfolders.",
    },
    excludeFolders: {
      propDefinition: [
        onedrive,
        "excludeFolders",
      ],
    },
  },
  methods: {
    httpRequest,
  },
  async run({ $ }) {
    const response = await this.httpRequest({
      url: `/items/${this.folderId}/children`,
    });
    const values = this.excludeFolders
      ? response.value.filter(({ folder }) => !folder)
      : response.value;

    const plural = values.length === 1
      ? ""
      : "s";
    const type = this.excludeFolders
      ? `file${plural}`
      : `file${plural} and/or folder${plural}`;
    $.export("$summary", `Found ${values.length} ${type}`);
    return values;
  },
};
