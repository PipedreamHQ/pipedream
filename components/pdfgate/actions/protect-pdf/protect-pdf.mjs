import app from "../../pdfgate.app.mjs";
import {
  DOCS_URLS, ENCRYPTION_ALGORITHM_OPTIONS, PROCESS_TIMEOUT_MS,
} from "../../common/constants.mjs";
import {
  buildCommonFields, omitBlank,
} from "../../common/utils.mjs";

export default {
  key: "pdfgate-protect-pdf",
  name: "Protect PDF",
  description: `Encrypt a stored PDF with user and owner passwords and optional permission restrictions, saving the result as a new PDFGate document. Use it before distributing sensitive files; the original document is left unchanged. With \`AES256\` a **User Password** also requires an **Owner Password**. [See the documentation](${DOCS_URLS.protectPdf})`,
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    documentId: {
      propDefinition: [
        app,
        "documentId",
      ],
    },
    algorithm: {
      type: "string",
      label: "Encryption Algorithm",
      description: "Encryption algorithm, e.g. `AES256` (strongest) or `AES128` (better compatibility with older readers).",
      optional: true,
      options: ENCRYPTION_ALGORITHM_OPTIONS,
    },
    userPassword: {
      type: "string",
      label: "User Password",
      description: "Password required to open the PDF, e.g. `s3cret-Passw0rd`. Empty lets anyone open the document.",
      optional: true,
      secret: true,
    },
    ownerPassword: {
      type: "string",
      label: "Owner Password",
      description: "Password that grants full control (changing permissions, removing restrictions), e.g. `0wner-Passw0rd`. Required when **Encryption Algorithm** is `AES256` and a **User Password** is set.",
      optional: true,
      secret: true,
    },
    disableEditing: {
      type: "boolean",
      label: "Disable Editing",
      description: "If `true`, prevents form edits and annotation changes. Example: `true`.",
      optional: true,
    },
    disableCopy: {
      type: "boolean",
      label: "Disable Copy/Extract",
      description: "If `true`, blocks copying text and extracting images. Example: `true`.",
      optional: true,
    },
    disablePrint: {
      type: "boolean",
      label: "Disable Printing",
      description: "If `true`, the PDF cannot be printed. Example: `true`.",
      optional: true,
    },
    encryptMetadata: {
      type: "boolean",
      label: "Encrypt Metadata",
      description: "If `true`, the document title, author and keywords are encrypted along with the content. Example: `false`.",
      optional: true,
    },
    preSignedUrlExpiresIn: {
      propDefinition: [
        app,
        "preSignedUrlExpiresIn",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.protectPdf({
      $,
      data: {
        documentId: this.documentId,
        jsonResponse: true,
        ...omitBlank({
          algorithm: this.algorithm,
          userPassword: this.userPassword,
          ownerPassword: this.ownerPassword,
          disableEditing: this.disableEditing,
          disableCopy: this.disableCopy,
          disablePrint: this.disablePrint,
          encryptMetadata: this.encryptMetadata,
        }),
        ...buildCommonFields(this),
      },
      timeout: PROCESS_TIMEOUT_MS,
    });
    $.export("$summary", `Successfully protected document ${this.documentId} into document ${response.id}`);
    return response;
  },
};
