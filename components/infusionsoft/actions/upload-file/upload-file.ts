import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { UploadFileParams } from "../../types/requestParams";

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
        "Binary data as Base64 encoded string, or a data URL (e.g., data:application/pdf;base64,...).",
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
      type: "string",
      label: "Contact ID",
      description: "Required when File Association is CONTACT",
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
    if (this.fileAssociation === "CONTACT" && !this.contactId?.trim()) {
      throw new Error("Contact ID is required when File Association is CONTACT");
    }

    const params: UploadFileParams = {
      $,
      fileData: this.fileData,
      fileName: this.fileName,
      fileAssociation: this.fileAssociation,
      contactId: this.contactId,
      isPublic: this.isPublic,
    };

    const result = await this.infusionsoft.uploadFile(params);

    $.export("$summary", `Successfully uploaded file "${this.fileName}"`);

    return result;
  },
});
