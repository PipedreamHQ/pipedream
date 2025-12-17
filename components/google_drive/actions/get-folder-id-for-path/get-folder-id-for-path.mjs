import googleDrive from "../../google_drive.app.mjs";

/**
 * Uses Google Drive API to get the folder ID for a Google Drive folder from
 * the `path` to the folder (e.g., `folder1/subFolderA/subFolderB`).
 *
 * For each part of the path, uses the Google Drive API to find a folder with
 * `name` of the part and with `id` of the found folder of the previous part in
 * its `parents`.
 */
export default {
  key: "google_drive-get-folder-id-for-path",
  name: "Get Folder ID for a Path",
  description: "Retrieve a folderId for a path. [See the documentation](https://developers.google.com/drive/api/v3/search-files) for more information",
  version: "0.1.17",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      optional: true,
    },
    path: {
      type: "string",
      label: "Path",
      description:
        "The path to the folder (e.g., `myFolder/mySubFolder1/mySubFolder2`)",
      optional: false,
    },
  },
  async run({ $ }) {
    // Convert path to array (e.g., `"folder1/subFolderA/subFolderB" ->
    // ["folder1","subFolderA","subFolderB"]`)
    const parts = this.path.split("/");

    let part;
    let parentId;
    // Iterate over parts
    // `parentId` of initial folder is `undefined` or root ("My Drive")
    while ((part = parts.shift())) {
      const folders = await this.googleDrive.findFolder({
        drive: this.drive,
        name: part,
        parentId,
      });
      if (!folders[0]) {
        // Folder at path is not found
        $.export("$summary", `Couldn't find a folderId for the path, "${this.path}"`);
        return undefined;
      }
      // Set parentId of next folder in path to find
      parentId = folders[0] && folders[0].id;
    }

    $.export("$summary", `Successfully retrieved the folderId for the path, "${this.path}"`);
    // Return id of last folder that is found
    return parentId;
  },
};
