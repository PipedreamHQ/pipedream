import googleDrive from "../../google_drive.app.mjs";
import Mustaches from "google-docs-mustaches";

const MODE_GOOGLE_DOC = "Google Doc";
const MODE_PDF = "Pdf";

export default {
  key: "google_drive-create-file-from-template",
  name: "Create New File From Template",
  description: "Create a new Google Docs file from a template. Optionally include placeholders in the template document that will get replaced from this action. [See documentation](https://www.npmjs.com/package/google-docs-mustaches)",
  version: "0.1.1",
  type: "action",
  props: {
    googleDrive,
    templateId: {
      propDefinition: [
        googleDrive,
        "fileId",
      ],
      description:
        "Select the template document you'd like to use as the template, or use a custom expression to reference a document ID from a previous step. Template documents should contain placeholders in the format {{xyz}}.",
    },
    folderId: {
      propDefinition: [
        googleDrive,
        "folderId",
      ],
      description:
        "Select the folder of the newly created Google Doc and/or PDF, or use a custom expression to reference a folder ID from a previous step.",
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
      description: "Specify if you want to create a Google Doc, PDF or both.",
      options: [
        MODE_GOOGLE_DOC,
        MODE_PDF,
      ],
    },
    replaceValues: {
      type: "object",
      label: "Replace text placeholders",
      description: "Replace text placeholders in the document. Use the format {{xyz}} in the document but exclude the curly braces in the key. (eg. `{{myPlaceholder}}` in the document will be replaced by the value of the key `myPlaceholder` in the action.",
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

    let googleDocId;
    try {
      googleDocId = await client.interpolate({
        source: this.templateId,
        destination: this.folderId,
        name: this.name,
        data: this.replaceValues,
      });
    } catch (e) {
      const {
        code, message,
      } = e.error.error;
      let errorMessage = `Status: ${code}, ${message} `;
      if (code == 404 || code == 400) {
        errorMessage += "Make sure that the template file selected contains placeholders in the format {{xyz}}.";
      }
      throw new Error(errorMessage);
    }
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
