import freshdesk from "../../freshdesk.app.mjs";
import { axios } from "@pipedream/platform";
import fs from "fs";

export default {
  key: "freshdesk-download-attachment",
  name: "Download Attachment",
  description: "Download an attachment from a ticket. [See the documentation](https://developers.freshdesk.com/api/#view_a_ticket)",
  version: "0.0.4",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    freshdesk,
    ticketId: {
      propDefinition: [
        freshdesk,
        "ticketId",
      ],
    },
    attachmentId: {
      type: "integer",
      label: "Attachment ID",
      description: "The ID of the attachment to download",
      async options() {
        const attachments = await this.listTicketAttachments();
        return attachments.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  methods: {
    async listTicketAttachments(opts = {}) {
      const { attachments } = await this.freshdesk.getTicket({
        ticketId: this.ticketId,
        ...opts,
      });
      return attachments;
    },
  },
  async run({ $ }) {
    const attachments = await this.listTicketAttachments({
      $,
    });
    const attachment = attachments.find(({ id }) => id === this.attachmentId);

    const response = await axios($, {
      url: attachment.attachment_url,
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response);
    const downloadedFilepath = `/tmp/${attachment.name}`;
    fs.writeFileSync(downloadedFilepath, buffer);

    const filedata = [
      attachment.name,
      downloadedFilepath,
    ];

    return {
      filedata,
      attachment,
    };
  },
};
