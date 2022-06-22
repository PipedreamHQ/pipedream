import pcloud from "./pcloud.app.mjs";

function propFileId(description = "") {
  return {
    propDefinition: [
      pcloud,
      "fileId",
    ],
    description: `Select a **File**${description}.
      \\
      Alternatively, you can provide a custom *File ID*.`,
  };
}
function propFolderId(description = "") {
  return {
    propDefinition: [
      pcloud,
      "folderId",
    ],
    description: `Select a **Folder**${description}.
      \\
      Alternatively, you can provide a custom *Folder ID*.`,
  };
}
function propToFolderId(description = "") {
  return {
    propDefinition: [
      pcloud,
      "folderId",
    ],
    label: "Destination Folder ID",
    description: `Select a **Destination Folder**${description}.
      \\
      Alternatively, you can provide a custom *Folder ID*.`,
  };
}

export {
  propFileId, propFolderId, propToFolderId,
};
