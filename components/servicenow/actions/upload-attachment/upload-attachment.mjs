import { ConfigurationError } from "@pipedream/platform";
import servicenow from "../../servicenow.app.mjs";

const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;
const SYS_ID_PATTERN = /^[0-9a-f]{32}$/i;
const TABLE_NAME_PATTERN = /^[A-Za-z0-9_]+$/;
const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

export function decodeAttachment(contentBase64) {
  const encoded = contentBase64.trim();
  if (!encoded || !BASE64_PATTERN.test(encoded)) {
    throw new ConfigurationError("File Content Base64 must be a non-empty, valid base64 string.");
  }
  const content = Buffer.from(encoded, "base64");
  if (!content.length) {
    throw new ConfigurationError("The decoded attachment is empty.");
  }
  if (content.length > MAX_ATTACHMENT_BYTES) {
    throw new ConfigurationError(`The decoded attachment exceeds the ${MAX_ATTACHMENT_BYTES}-byte limit.`);
  }
  return content;
}

export default {
  key: "servicenow-upload-attachment",
  name: "Upload Attachment",
  description: "Uploads a file and associates it with an existing ServiceNow record. The caller must supply raw file content encoded as base64. [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_AttachmentAPI.html#attachment-POST-file)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    servicenow,
    tableName: {
      type: "string",
      label: "Table Name",
      description: "Name of the table containing the target record. Example: `sc_request`.",
    },
    tableSysId: {
      type: "string",
      label: "Table Record Sys ID",
      description: "The 32-character `sys_id` of the record that will own the attachment.",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "File name, including its extension. Example: `receipt.pdf`.",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "MIME type of the file. Example: `application/pdf`.",
    },
    contentBase64: {
      type: "string",
      label: "File Content Base64",
      description: "The complete file content encoded as base64. The decoded file may be at most 25 MiB.",
    },
  },
  async run({ $ }) {
    if (!TABLE_NAME_PATTERN.test(this.tableName)) {
      throw new ConfigurationError("Table Name may contain only letters, numbers, and underscores.");
    }
    if (!SYS_ID_PATTERN.test(this.tableSysId)) {
      throw new ConfigurationError("Table Record Sys ID must be a 32-character hexadecimal sys_id.");
    }
    if (!this.fileName.trim()) {
      throw new ConfigurationError("File Name must not be empty.");
    }
    if (!this.contentType.trim()) {
      throw new ConfigurationError("Content Type must not be empty.");
    }

    const content = decodeAttachment(this.contentBase64);
    const response = await this.servicenow.uploadAttachment({
      $,
      tableName: this.tableName,
      tableSysId: this.tableSysId,
      fileName: this.fileName,
      contentType: this.contentType,
      data: content,
    });

    if (!response?.sys_id) {
      throw new ConfigurationError("ServiceNow did not return attachment metadata.");
    }
    $.export("$summary", `Successfully uploaded attachment "${this.fileName}" with ID ${response.sys_id}`);

    return response;
  },
};
