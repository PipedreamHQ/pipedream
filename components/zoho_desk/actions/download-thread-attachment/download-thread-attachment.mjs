import fs from "fs";
import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-download-thread-attachment",
  name: "Download Thread Attachment",
  description: "Download a specific attachment belonging to a thread of a ticket.",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      orgId,
      ticketId,
      threadId,
      attachmentId,
    } = this;

    const response = await this.zohoDesk.downloadThreadAttachment({
      $,
      ticketId,
      threadId,
      attachmentId,
      headers: {
        orgId,
      },
      responseType: "arraybuffer",
    });

    const rawcontent = response.toString("base64");
    const buffer = Buffer.from(rawcontent, "base64");
    const filePath = (process.env.STASH_DIR || "/tmp") + "/" + attachmentId;
    fs.writeFileSync(filePath, buffer);

    $.export("$summary", `Successfully downloaded attachment ${attachmentId}`);
    $.export("file_path", filePath);

    return {
      attachmentId,
      filePath,
    };
  },
};
