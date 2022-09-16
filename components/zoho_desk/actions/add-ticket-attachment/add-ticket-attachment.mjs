import zohoDesk from "../../zoho_desk.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "zoho_desk-add-ticket-attachment",
  name: "Add Ticket Attachment",
  description: "Attaches a file to a ticket. [See the docs here](https://desk.zoho.com/DeskAPIDocument#TicketAttachments#TicketAttachments_CreateTicketattachment)",
  type: "action",
  version: "0.0.1",
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
      label: "File",
      description: "File path of a file previously downloaded in Pipedream E.g. (`/tmp/my-file.txt`). [Download a file to the `/tmp` directory](https://pipedream.com/docs/code/nodejs/http-requests/#download-a-file-to-the-tmp-directory)",
    },
  },
  async run({ $ }) {
    const {
      orgId,
      ticketId,
      isPublic,
      file,
    } = this;

    const response = await this.zohoDesk.createTicketAttachment({
      ticketId,
      headers: {
        orgId,
        ...constants.MULTIPART_FORM_DATA_HEADERS,
      },
      data: {
        file,
        isPublic,
      },
    });

    $.export("$summary", `Successfully created a new ticket attachment with ID ${response.id}`);

    return response;
  },
};
