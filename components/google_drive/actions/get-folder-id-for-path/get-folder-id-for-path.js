const googleDrive = require("../../google_drive.app");

/**
 * Uses Google Drive API to get the folder ID for a Google Drive folder from
 * the `path` to the folder (e.g., `folder1/subFolderA/subFolderB`).
 *
 * For each part of the path, uses the Google Drive API to find a folder with
 * `name` of the part and with `id` of the found folder of the previous part in
 * its `parents`.
 */
module.exports = {
  key: "google_drive-get-folder-id-for-path",
  name: "Get Folder ID for a Path",
  description: "Retrieve a folderId for a path",
  version: "0.0.1",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description:
        "The drive to use. If not specified, your personal Google Drive will be used. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
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
  async run() {
    // Convert path to array (e.g., `"folder1/subFolderA/subFolderB" ->
    // ["folder1","subFolderA","subFolderB"]`)
    const parts = this.path.split("");

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
        return undefined;
      }
      // Set parentId of next folder in path to find
      parentId = folders[0] && folders[0].id;
    }

    // Return id of last folder that is found
    return parentId;
  },
};
