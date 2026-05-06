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
        "fileOrFolderId",
      ],
      description: "The ID of the file or folder to check",
    },
    ancestorFolderId: {
      propDefinition: [
        googleDrive,
        "folderId",
      ],
      label: "Ancestor Folder ID",
      description: "The folder ID to check for in the parent hierarchy",
    },
  },
  async run({ $ }) {
    const {
      fileId, ancestorFolderId,
    } = this;

    // Get the initial file's parents to start traversal from parent (not the file itself)
    let file;
    try {
      file = await this.googleDrive.getFile(fileId, {
        fields: "id,name,parents",
      });
    } catch (err) {
      throw new Error(`Failed to retrieve file "${fileId}": ${err.message}`);
    }

    const initialParents = file.parents || [];
    if (initialParents.length === 0) {
      $.export("$summary", `Folder "${ancestorFolderId}" is NOT an ancestor of file "${fileId}"`);
      return {
        isAncestor: false,
        fileId,
        ancestorFolderId,
        reason: "not_in_hierarchy",
      };
    }

    // BFS traversal to check all parent paths (files can have multiple parents in Drive)
    const queue = [
      ...initialParents,
    ];
    const visitedIds = new Set([
      fileId,
    ]);

    while (queue.length > 0) {
      const currentId = queue.shift();

      // Skip if already visited (prevents cycles)
      if (visitedIds.has(currentId)) {
        continue;
      }
      visitedIds.add(currentId);

      // Check if current parent matches the ancestor folder ID
      if (currentId === ancestorFolderId) {
        let ancestorFile;
        try {
          ancestorFile = await this.googleDrive.getFile(currentId, {
            fields: "id,name",
          });
        } catch (err) {
          throw new Error(`Failed to retrieve ancestor folder "${currentId}": ${err.message}`);
        }
        $.export("$summary", `Folder "${ancestorFolderId}" is an ancestor of file "${fileId}"`);
        return {
          isAncestor: true,
          fileId,
          ancestorFolderId,
          ancestorName: ancestorFile.name,
        };
      }

      // Get file metadata including parents to continue traversal
      let parentFile;
      try {
        parentFile = await this.googleDrive.getFile(currentId, {
          fields: "id,name,parents",
        });
      } catch (err) {
        throw new Error(`Failed to retrieve file "${currentId}": ${err.message}`);
      }

      // Enqueue all parents for traversal
      const parents = parentFile.parents || [];
      for (const parentId of parents) {
        if (!visitedIds.has(parentId)) {
          queue.push(parentId);
        }
      }
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
