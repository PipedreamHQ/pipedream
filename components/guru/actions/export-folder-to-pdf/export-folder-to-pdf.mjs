import guru from "../../guru.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "guru-export-folder-to-pdf",
  name: "Export Folder to PDF",
  description: "Export a specific folder identified by its ID to a PDF file. [See the documentation](https://developer.getguru.com/reference/getv1foldersgetfolderaspdf)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    guru,
    folderId: {
      propDefinition: [
        guru,
        "folderId",
      ],
    },
  },
  async run({ $ }) {
    const filePath = await this.guru.exportFolderToPdf({
      folderId: this.folderId,
    });

    $.export("$summary", `Successfully exported folder ID ${this.folderId} to PDF.`);
    return {
      filePath,
    };
  },
};
