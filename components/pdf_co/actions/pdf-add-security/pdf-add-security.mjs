import app from "../../pdf_co.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Add PDF security",
  description: "Add PDF security. [See docs here](https://apidocs.pdf.co/32-pdf-password-and-security)",
  key: "pdf_co-pdf-add-security",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    async: {
      propDefinition: [
        app,
        "async",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    expiration: {
      propDefinition: [
        app,
        "expiration",
      ],
    },
    profiles: {
      propDefinition: [
        app,
        "profiles",
      ],
    },
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    ownerPassword: {
      type: "string",
      label: "Owner Password",
      description: "The main owner password that is used for documents encryption and for setting/removing restrictions.",
    },
    encryptionAlgorithm: {
      type: "string",
      label: "Encryption Algorithm",
      description: "Encryption algorithm. Valid values: RC4_40bit, RC4_128bit, AES_128bit, AES_256bit. AES_128bit or higher is recommended.",
      options: constants.ENCRYPTION_ALGORITHM_OPTS,
      default: "AES_128bit",
    },
    userPassword: {
      type: "string",
      label: "User Password",
      description: "The optional user password will be asked for viewing and printing document.",
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (!this.userPassword || this.userPassword.length === 0) {
      return {};
    }
    return {
      allowAccessibilitySupport: {
        type: "boolean",
        label: "Allow Accessibility Support",
        description: "Allow or prohibit content extraction for accessibility needs.\n\nthis restriction applies when `User Password` (if any) is entered.",
        optional: true,
      },
      allowAssemblyDocument: {
        type: "boolean",
        label: "Allow Assembly Document",
        description: "Allow or prohibit assembling the document.\n\nthis restriction applies when `User Password` (if any) is entered.",
        optional: true,
      },
      allowPrintDocument: {
        type: "boolean",
        label: "Allow Print Document",
        description: "Allow or prohibit printing PDF document.\n\nthis restriction applies when `User Password` (if any) is entered.",
        optional: true,
      },
      allowFillForms: {
        type: "boolean",
        label: "Allow Fill Forms",
        description: "Allow or prohibit filling of interactive form fields (including signature fields) in PDF document.\n\nthis restriction applies when `User Password` (if any) is entered.",
        optional: true,
      },
      allowModifyDocument: {
        type: "boolean",
        label: "Allow Modify Document",
        description: "Allow or prohibit modification of PDF document.\n\nthis restriction applies when `User Password` (if any) is entered.",
        optional: true,
      },
      allowContentExtraction: {
        type: "boolean",
        label: "Allow Content Extraction",
        description: "Allow or prohibit copying content from PDF document.\n\nthis restriction applies when `User Password` (if any) is entered.",
        optional: true,
      },
      allowModifyAnnotations: {
        type: "boolean",
        label: "Allow Modify Annotations",
        description: "Allow or prohibit interacting with text annotations and forms in PDF document.\n\nthis restriction applies when `User Password` (if any) is entered.",
        optional: true,
      },
      printQuality: {
        type: "string",
        label: "Print Quality",
        description: "Allowed printing quality. Valid values: `HighResolution`, `LowResolution`.\n\nthis restriction applies when `User Password` (if any) is entered.",
        optional: true,
        options: constants.PRINT_QUALITY_OPTS,
      },
    };
  },
  async run({ $ }) {
    const payload = {
      url: this.url,
      ownerPassword: this.ownerPassword,
      userPassword: this.userPassword,
      encryptionAlgorithm: this.encryptionAlgorithm,
      allowAccessibilitySupport: this.allowAccessibilitySupport,
      allowAssemblyDocument: this.allowAssemblyDocument,
      allowPrintDocument: this.allowPrintDocument,
      allowFillForms: this.allowFillForms,
      allowModifyDocument: this.allowModifyDocument,
      allowContentExtraction: this.allowContentExtraction,
      allowModifyAnnotations: this.allowModifyAnnotations,
      printQuality: this.printQuality,
      async: this.async,
      profiles: this.profiles,
      name: this.name,
      expiration: this.expiration,
    };
    const endpoint = "/pdf/security/add";
    const response = await this.app.genericRequest(
      $,
      payload,
      endpoint,
    );
    $.export("$summary", `Successfully added security, from: ${this.url}`);
    return response;
  },
};
