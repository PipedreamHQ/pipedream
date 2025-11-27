import Mustaches from "google-docs-mustaches";
import googleDrive from "../../google_drive.app.mjs";
import { parseObjectEntries } from "../../common/utils.mjs";

const MODE_GOOGLE_DOC = "Google Doc";
const MODE_PDF = "Pdf";

export default {
  key: "google_drive-create-file-from-template",
  name: "Create New File From Template",
  description: "Create a new Google Docs file from a template. Optionally include placeholders in the template document that will get replaced from this action. [See documentation](https://www.npmjs.com/package/google-docs-mustaches)",
  version: "0.1.18",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      label: "Drive Containing Template",
      optional: true,
    },
    templateId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description:
        "Select the template document you'd like to use as the template, or use a custom expression to reference a document ID from a previous step. Template documents should contain placeholders in the format `{{xyz}}`.",
    },
    destinationDrive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      label: "Destination Drive",
      optional: true,
    },
    folderId: {
      propDefinition: [
        googleDrive,
        "folderId",
        (c) => ({
          drive: c.destinationDrive,
        }),
      ],
      description:
        "Select the folder of the newly created Google Doc and/or PDF, or use a custom expression to reference a folder ID from a previous step.",
      optional: true,
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
      description: "Replace text placeholders in the document. Use the format `{{xyz}}` in the document but exclude the curly braces in the key. (eg. `{{myPlaceholder}}` in the document will be replaced by the value of the key `myPlaceholder` in the action.",
    },
  },
  async run({ $ }) {
    const result = {
      folderId: this.folderId,
      name: this.name,
      mode: this.mode,
    };

    const isSharedDrive = this.destinationDrive && this.destinationDrive !== "My Drive";

    const client = new Mustaches.default({
      token: () => this.googleDrive.$auth.oauth_access_token,
    });

    // COPY THE TEMPLATE

    const drive = this.googleDrive.drive();
    const copiedTemplate = await drive.files.copy({
      fileId: this.templateId,
      requestBody: {
        name: "template-copy",
        parents: [
          "root",
        ],
      },
      supportsAllDrives: true,
    });
    const templateId = copiedTemplate.data.id;

    /* CREATE THE GOOGLE DOC */

    let googleDocId;
    try {
      googleDocId = await client.interpolate({
        source: templateId,
        destination: !isSharedDrive
          ? this.folderId
          : undefined,
        name: this.name,
        data: parseObjectEntries(this.replaceValues),
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

    let pdfId;
    if (this.mode.includes(MODE_PDF)) {
      pdfId = await client.export({
        file: googleDocId,
        mimeType: "application/pdf",
        name: this.name,
        destination: !isSharedDrive
          ? this.folderId
          : undefined,
      });
      result["pdfId"] = pdfId;
    }

    // MOVE FILE(S) TO SHARED DRIVE

    if (isSharedDrive) {
      if (this.mode.includes(MODE_GOOGLE_DOC)) {
        const file = await this.googleDrive.getFile(googleDocId);
        await this.googleDrive.updateFile(googleDocId, {
          fields: "*",
          removeParents: file.parents.join(","),
          addParents: this.folderId || this.destinationDrive,
          supportsAllDrives: true,
        });
      }

      if (pdfId) {
        const pdf = await this.googleDrive.getFile(pdfId);
        await this.googleDrive.updateFile(pdfId, {
          fields: "*",
          removeParents: pdf.parents.join(","),
          addParents: this.folderId || this.destinationDrive,
          supportsAllDrives: true,
        });
      }
    }

    /* REMOVE THE GOOGLE DOC */

    if (!this.mode.includes(MODE_GOOGLE_DOC)) {
      await this.googleDrive.deleteFile(googleDocId);
    }

    // REMOVE THE COPIED TEMPLATE

    await drive.files.delete({
      fileId: templateId,
      supportsAllDrives: true,
    });

    $.export("$summary", "New file successfully created");
    return result;
  },
};
