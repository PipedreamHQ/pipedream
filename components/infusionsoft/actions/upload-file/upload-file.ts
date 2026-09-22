import type { Readable } from "stream";
import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import {
  ConfigurationError,
  getFileStream,
} from "@pipedream/platform";
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
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide a file URL or a path to a file in the `/tmp` directory.",
      format: "file-ref",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "Name of the file with extension (e.g., document.pdf). Optional; defaults to the file name from the path.",
      optional: true,
    },
    fileAssociation: {
      type: "string",
      label: "File Association",
      description: "Type of entity to associate the file with",
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
    isPublic: {
      type: "boolean",
      label: "Is Public",
      description: "Whether the file is publicly accessible",
      optional: true,
      default: false,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    streamToBase64(stream: Readable): Promise<string> {
      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on("data", (chunk: Buffer) => chunks.push(chunk));
        stream.on("end", () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer.toString("base64"));
        });
        stream.on("error", reject);
      });
    },
  },
  async run({ $ }): Promise<object> {
    if (!this.file) {
      throw new ConfigurationError("The **File Path or URL** prop is required.");
    }

    const stream = await getFileStream(this.file);
    const fileData = await this.streamToBase64(stream);

    const fileName = String(this.fileName ?? "").trim()
      || this.file.split("/").pop()
      || "file";
    if (!fileName) {
      throw new ConfigurationError("File name could not be determined. Please provide a **File Name**.");
    }

    const association = String(this.fileAssociation ?? "").trim()
      .toUpperCase();
    if (association === "CONTACT" && !String(this.contactId ?? "").trim()) {
      throw new ConfigurationError("Contact ID is required when File Association is CONTACT");
    }

    const params: UploadFileParams = {
      $,
      fileData,
      fileName,
      fileAssociation: this.fileAssociation,
      contactId: this.contactId
        ? String(this.contactId)
        : undefined,
      isPublic: this.isPublic,
    };

    const result = await this.infusionsoft.uploadFile(params);

    $.export("$summary", `Successfully uploaded file "${fileName}"`);

    return result;
  },
});
