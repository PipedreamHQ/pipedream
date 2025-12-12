import fs from "fs";
import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-download-ticket-attachment",
  name: "Download Ticket Attachment",
  description: "Download a specific attachment associated with a ticket. [See the documentation](https://desk.zoho.com/DeskAPIDocument#TicketAttachments#TicketAttachments_Listticketattachments)",
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
    attachmentId: {
      propDefinition: [
        zohoDesk,
        "attachmentId",
        ({
          orgId, ticketId,
        }) => ({
          orgId,
          ticketId,
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
      attachmentId,
    } = this;

    const response = await this.zohoDesk.downloadTicketAttachment({
      $,
      ticketId,
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
