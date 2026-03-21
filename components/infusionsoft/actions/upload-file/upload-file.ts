import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { UploadFileParams } from "../../common/types/requestParams";

export default defineAction({
  name: "Upload File",
  description:
    "Upload a file to Keap CRM. [See the documentation](https://developer.infusionsoft.com/docs/rest/#tag/File/operation/createFile)",
  key: "infusionsoft-upload-file",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infusionsoft,
    fileData: {
      type: "string",
      label: "File Data",
      description:
        "Raw binary/text content (will be Base64 encoded), or a data URL (e.g., data:application/pdf;base64,...).",
      optional: false,
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "Name of the file with extension (e.g., document.pdf)",
      optional: false,
    },
    fileAssociation: {
      type: "string",
      label: "File Association",
      description: "Type of entity to associate the file with",
      optional: false,
      options: [
        {
          label: "Contact",
          value: "CONTACT",
        },
        {
          label: "User",
          value: "USER",
        },
        {
          label: "Company",
          value: "COMPANY",
        },
      ],
    },
    contactId: {
      propDefinition: [
        infusionsoft,
        "contactId",
      ],
      optional: true,
    },
    userId: {
      propDefinition: [
        infusionsoft,
        "userId",
      ],
      optional: true,
    },
    companyId: {
      propDefinition: [
        infusionsoft,
        "companyId",
      ],
      optional: true,
    },
    isPublic: {
      type: "boolean",
      label: "Is Public",
      description: "Whether the file is publicly accessible",
      optional: true,
      default: false,
    },
  },
  async run({ $ }): Promise<object> {
    if (!String(this.fileData ?? "").trim()) {
      throw new Error("File Data is required");
    }
    const fileName = String(this.fileName ?? "").trim();
    if (!fileName) {
      throw new Error("File Name is required");
    }

    const association = String(this.fileAssociation ?? "").trim()
      .toUpperCase();
    if (association === "CONTACT" && !String(this.contactId ?? "").trim()) {
      throw new Error("Contact ID is required when File Association is CONTACT");
    }
    if (association === "USER" && !String(this.userId ?? "").trim()) {
      throw new Error("User ID is required when File Association is USER");
    }
    if (association === "COMPANY" && !String(this.companyId ?? "").trim()) {
      throw new Error("Company ID is required when File Association is COMPANY");
    }

    const params: UploadFileParams = {
      $,
      fileData: String(this.fileData ?? "").trim(),
      fileName: this.fileName,
      fileAssociation: this.fileAssociation,
      contactId: this.contactId
        ? String(this.contactId)
        : undefined,
      userId: this.userId
        ? String(this.userId)
        : undefined,
      companyId: this.companyId
        ? String(this.companyId)
        : undefined,
      isPublic: this.isPublic,
    };

    const result = await this.infusionsoft.uploadFile(params);

    $.export("$summary", `Successfully uploaded file "${fileName}"`);

    return result;
  },
});
