import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-is-folder-ancestor",
  name: "Is Folder Ancestor",
  description: "Check if a specific folder is anywhere in the parent hierarchy of a file or folder. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/files/get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    googleDrive,
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
      ],
      description: "The ID of the file or folder to check",
    },
    ancestorFolderId: {
      type: "string",
      label: "Ancestor Folder ID",
      description: "The folder ID to check for in the parent hierarchy",
    },
  },
  async run({ $ }) {
    const { fileId, ancestorFolderId } = this;
    
    // Start with the given file and walk up the parent hierarchy
    let currentFileId = fileId;
    const visitedIds = new Set(); // Prevent infinite loops
    
    while (currentFileId) {
      // Prevent circular references
      if (visitedIds.has(currentFileId)) {
        $.export("$summary", `Circular reference detected in folder hierarchy`);
        return { isAncestor: false, reason: "circular_reference" };
      }
      visitedIds.add(currentFileId);
      
      // Get file metadata including parents
      const file = await this.googleDrive.getFile({
        $,
        fileId: currentFileId,
        fields: "id,name,parents",
      });
      
      // Check if ancestor folder ID matches current file
      if (currentFileId === ancestorFolderId) {
        $.export("$summary", `Folder "${ancestorFolderId}" is an ancestor of file "${fileId}"`);
        return {
          isAncestor: true,
          fileId,
          ancestorFolderId,
          ancestorName: file.name,
        };
      }
      
      // Move to parent (if exists)
      const parents = file.parents || [];
      if (parents.length === 0) {
        // Reached root, ancestor not found
        break;
      }
      
      // Use first parent (files can have multiple parents in Drive)
      currentFileId = parents[0];
    }
    
    $.export("$summary", `Folder "${ancestorFolderId}" is NOT an ancestor of file "${fileId}"`);
    return {
      isAncestor: false,
      fileId,
      ancestorFolderId,
      reason: "not_in_hierarchy",
    };
  },
};
