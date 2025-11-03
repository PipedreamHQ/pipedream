import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-add-ticket-comment",
  name: "Add Ticket Comment",
  description: "Adds a comment to a ticket. [See the docs here](https://desk.zoho.com/DeskAPIDocument#TicketsComments#TicketsComments_Createticketcomment)",
  type: "action",
  version: "0.0.6",
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
    content: {
      type: "string",
      label: "Content",
      description: "Content of the comment. To retrieve or set user mentions, use this code format: `zsu[@user:{zuid}zsu.`",
      optional: true,
    },
    isPublic: {
      type: "boolean",
      label: "Is Public",
      description: "Key that returns if a comment is public or not. The value of this key can be set only at the time of making a comment.",
      optional: true,
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "Used to denote the content-type which maybe `html` or `plainText`. The default type is `html`.",
      options: [
        "html",
        "plainText",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      orgId,
      ticketId,
      content,
      isPublic,
      contentType,
    } = this;

    const response = await this.zohoDesk.createTicketComment({
      ticketId,
      headers: {
        orgId,
      },
      data: {
        content,
        isPublic,
        contentType,
      },
    });

    $.export("$summary", `Successfully created a new ticket comment with ID ${response.id}`);

    return response;
  },
};
