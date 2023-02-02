import googleDrive from "../../google_drive.app.mjs";
import Mustaches from "google-docs-mustaches";

const MODE_GOOGLE_DOC = "Google Doc";
const MODE_PDF = "Pdf";

export default {
  key: "google_drive-create-file-from-template",
  name: "Create New File From Template",
  description: "Create a new Google Docs file from template, optionally include placeholders in the template document for replacement within this action. [See documentation](https://www.npmjs.com/package/google-docs-mustaches)",
  version: "0.0.3",
  type: "action",
  props: {
    googleDrive,
    templateId: {
      propDefinition: [
        googleDrive,
        "fileId",
      ],
      description:
        "ID of the document you want to use as a template.",
    },
    folderId: {
      propDefinition: [
        googleDrive,
        "folderId",
      ],
      description:
        "Folder ID of the newly created Google Doc and PDF.",
    },
    name: {
      propDefinition: [
        googleDrive,
        "fileName",
      ],
      description:
        "Name of the file you want to create (eg. `myFile` will create a Google Doc called `myFile` and a pdf called `myFile.pdf`)",
      optional: false,
    },
    mode: {
      type: "string[]",
      label: "Mode",
      description: "Select if you want to create a Google Doc, PDF or both.",
      options: [
        MODE_GOOGLE_DOC,
        MODE_PDF,
      ],
    },
    replaceValues: {
      type: "object",
      label: "Replace text placeholders",
      description: "Replace text placeholders in the document. Use format {{xyz}} in the document but exclude the curly braces in the key. (eg. `{{myPlaceholder}}` in the document, will be replace by the value of the key `myPlaceholder` in the action.",
      optional: true,
    },
  },
  async run({ $ }) {
    const result = {
      folderId: this.folderId,
      name: this.name,
      mode: this.mode,
    };

    const client = new Mustaches.default({
      token: () => this.googleDrive.$auth.oauth_access_token,
    });

    /* CREATE THE GOOGLE DOC */

    const googleDocId = await client.interpolate({
      source: this.templateId,
      destination: this.folderId,
      name: this.name,
      data: this.replaceValues,
    });
    result["googleDocId"] = googleDocId;

    /* CREATE THE PDF */

    if (this.mode.includes(MODE_PDF)) {
      const pdfId = await client.export({
        file: googleDocId,
        mimeType: "application/pdf",
        name: this.name,
        destination: this.folderId,
      });
      result["pdfId"] = pdfId;
    }

    /* REMOVE THE GOOGLE DOC */

    if (!this.mode.includes(MODE_GOOGLE_DOC)) {
      await this.googleDrive.deleteFile(googleDocId);
    }

    $.export("$summary", "New file successfully created");
    return result;
  },
};
