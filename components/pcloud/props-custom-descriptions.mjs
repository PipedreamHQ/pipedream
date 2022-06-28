import pcloud from "./pcloud.app.mjs";

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

export {
  propFolderId,
};
