import zohoDesk from "../../zoho_desk.app.mjs";
import { Readable } from "stream";
import fs from "fs";
import { promisify } from "util";
import stream from "stream";
import {
  ConfigurationError, getFileStreamAndMetadata,
} from "@pipedream/platform";

const pipeline = promisify(stream.pipeline);

export default {
  key: "zoho_desk-download-thread-attachment",
  name: "Download Thread Attachment",
  description: "Download a specific attachment belonging to a thread of a ticket. [See the documentation](https://desk.zoho.com/DeskAPIDocument#TicketAttachments_Listticketattachments)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zohoDesk,
    orgId: {
      propDefinition: [
        zohoDesk,
        "orgId",
      ],
    },
    ticketId: {
      propDefinition: [
        zohoDesk,
        "ticketId",
        ({ orgId }) => ({
          orgId,
        }),
      ],
    },
    threadId: {
      propDefinition: [
        zohoDesk,
        "threadId",
        ({
          orgId, ticketId,
        }) => ({
          orgId,
          ticketId,
        }),
      ],
    },
    attachmentId: {
      propDefinition: [
        zohoDesk,
        "attachmentId",
        ({
          orgId, ticketId, threadId,
        }) => ({
          orgId,
          ticketId,
          threadId,
        }),
      ],
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The filename to save the attachment as in the /tmp directory",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const {
      orgId,
      ticketId,
      threadId,
      attachmentId,
      filename,
    } = this;

    // First, get thread details to get attachment info
    const threadResponse = await this.zohoDesk.getThreadDetails({
      $,
      ticketId,
      threadId,
      headers: {
        orgId,
      },
    });

    // Handle response structure - getThreadDetails returns { data: {...} }
    const thread = threadResponse?.data || threadResponse;
    const attachments = thread?.attachments || [];
    const attachment = attachments.find((att) => att.id === attachmentId);

    if (!attachment) {
      throw new ConfigurationError(`Attachment with ID ${attachmentId} not found in thread ${threadId}`);
    }

    // Download the attachment using the content endpoint
    const response = await this.zohoDesk.downloadThreadAttachment({
      $,
      ticketId,
      threadId,
      attachmentId,
      headers: {
        orgId,
      },
    });

    // Handle response - axios returns data in response.data when responseType is set
    const responseData = response?.data || response;
    const buffer = Buffer.from(responseData);
    const attachmentName = attachment.name || `attachment_${attachmentId}`;
    const fileName = filename || attachmentName;
    const filePath = `/tmp/${fileName}`;

    // Write file using stream pipeline (avoids fs.writeFileSync)
    const fileStream = Readable.from(buffer);
    await pipeline(fileStream, fs.createWriteStream(filePath));

    // Use getFileStreamAndMetadata to read the file and get metadata
    const { metadata } = await getFileStreamAndMetadata(filePath);

    $.export("$summary", `Successfully downloaded attachment "${attachment.name}"`);

    return {
      attachmentId,
      fileName: attachment.name,
      filePath,
      size: attachment.size,
      metadata,
    };
  },
};
