import zohoDesk from "../../zoho_desk.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "zoho_desk-add-ticket-attachment",
  name: "Add Ticket Attachment",
  description: "Attaches a file to a ticket. [See the docs here](https://desk.zoho.com/DeskAPIDocument#TicketAttachments#TicketAttachments_CreateTicketattachment)",
  type: "action",
  version: "0.1.5",
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
    isPublic: {
      type: "boolean",
      label: "Is Public",
      description: "Field that determines whether the attachment is public or private",
      optional: true,
    },
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The file to attach. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      orgId,
      ticketId,
      isPublic,
      file,
    } = this;

    const data = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(file);
    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await this.zohoDesk.createTicketAttachment({
      $,
      ticketId,
      params: {
        isPublic,
      },
      headers: {
        orgId,
        ...data.getHeaders(),
      },
      data,
    });

    $.export("$summary", `Successfully created a new ticket attachment with ID ${response?.id}`);

    return response;
  },
};
