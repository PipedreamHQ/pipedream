import { randomBytes } from "node:crypto";
import { getFileStream } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";
import { buildAttachableUpload } from "../../common/build-attachable-upload.mjs";

const MAX_FILE_BYTES = 20 * 1024 * 1024;

async function readBoundedFile(filePath) {
  const stream = await getFileStream(filePath);
  const chunks = [];
  let size = 0;
  for await (const chunk of stream) {
    const buffer = Buffer.isBuffer(chunk)
      ? chunk
      : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_FILE_BYTES) {
      throw new RangeError("Attachment exceeds the 20 MB upload limit.");
    }
    chunks.push(buffer);
  }
  if (!size) {
    throw new RangeError("Attachment cannot be empty.");
  }
  return Buffer.concat(chunks);
}

function extractAttachable(response) {
  const entries = Array.isArray(response)
    ? response
    : response?.AttachableResponse;
  return entries?.[0]?.Attachable;
}

export default {
  key: "quickbooks-upload-customer-attachment",
  name: "Upload Customer Attachment",
  description: "Uploads a file to a QuickBooks Online customer and verifies that the attachment persisted. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/attachable#upload-an-attachment)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quickbooks,
    customerId: {
      propDefinition: [
        quickbooks,
        "customer",
      ],
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "Provide a file URL or a path to a file in the /tmp directory.",
      format: "file-ref",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The attachment name, including its extension.",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "The file MIME type, for example `image/jpeg` or `application/pdf`.",
    },
  },
  async run({ $ }) {
    const { Customer: customer } = await this.quickbooks.getCustomer({
      $,
      customerId: this.customerId,
    });
    if (!customer || String(customer.Id) !== String(this.customerId)) {
      throw new Error("QuickBooks did not return the requested customer.");
    }

    const file = await readBoundedFile(this.filePath);
    const boundary = `pipedream-qbo-${randomBytes(16).toString("hex")}`;
    const upload = buildAttachableUpload({
      boundary,
      contentType: this.contentType,
      entityId: this.customerId,
      entityType: "Customer",
      file,
      fileName: this.fileName,
    });
    const response = await this.quickbooks.uploadAttachable({
      $,
      body: upload.body,
      contentType: upload.contentType,
    });
    const created = extractAttachable(response);
    if (!created?.Id) {
      throw new Error("QuickBooks did not return an attachment ID.");
    }

    const { Attachable: persisted } = await this.quickbooks.getAttachable({
      $,
      attachableId: created.Id,
    });
    const linked = persisted?.AttachableRef?.some(({ EntityRef }) => EntityRef?.type === "Customer"
      && String(EntityRef?.value) === String(this.customerId));
    const readBackMatches = persisted
      && persisted.FileName === this.fileName
      && persisted.ContentType === this.contentType
      && linked;
    if (!readBackMatches) {
      throw new Error("QuickBooks attachment read-back did not match the requested customer and file.");
    }

    $.export("$summary", `Successfully uploaded and verified attachment ${persisted.Id}`);
    return {
      attachableId: String(persisted.Id),
      contentType: persisted.ContentType,
      customerId: String(this.customerId),
      fileName: persisted.FileName,
      persisted: true,
    };
  },
};
