import app from "../../pdfgate.app.mjs";
import {
  DOCS_URL, ENCRYPTION_ALGORITHM_OPTIONS, PROCESS_TIMEOUT_MS,
} from "../../common/constants.mjs";
import {
  buildCommonFields, omitBlank,
} from "../../common/utils.mjs";

export default {
  key: "pdfgate-protect-pdf",
  name: "Protect PDF",
  description: `Encrypt a PDF and optionally apply permission restrictions. [See the documentation](${DOCS_URL})`,
  version: "0.0.1",
  type: "action",
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
      description: "`AES256` is the strongest; `AES128` offers better compatibility with older readers.",
      optional: true,
      options: ENCRYPTION_ALGORITHM_OPTIONS,
    },
    userPassword: {
      type: "string",
      label: "User Password",
      description: "Password required to open the PDF. If empty, the document opens without a password.",
      optional: true,
      secret: true,
    },
    ownerPassword: {
      type: "string",
      label: "Owner Password",
      description: "Password that grants full control (modifying permissions, removing restrictions). Required when **Encryption Algorithm** is `AES256` and a **User Password** is set.",
      optional: true,
      secret: true,
    },
    disableEditing: {
      type: "boolean",
      label: "Disable Editing",
      description: "If true, prevents form edits and annotation changes.",
      optional: true,
    },
    disableCopy: {
      type: "boolean",
      label: "Disable Copy/Extract",
      description: "If true, blocks copying text or extracting images.",
      optional: true,
    },
    disablePrint: {
      type: "boolean",
      label: "Disable Printing",
      description: "If true, the PDF cannot be printed.",
      optional: true,
    },
    encryptMetadata: {
      type: "boolean",
      label: "Encrypt Metadata",
      description: "If true, the document title/author/keywords are encrypted along with the content.",
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
