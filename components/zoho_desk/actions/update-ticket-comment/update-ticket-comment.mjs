import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-update-ticket-comment",
  name: "Update Ticket Comment",
  description: "Updates an existing comment on a ticket. [See the documentation](https://desk.zoho.com/DeskAPIDocument#TicketsComments_Updateticketcomment)",
  type: "action",
  version: "0.0.2",
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
    commentId: {
      propDefinition: [
        zohoDesk,
        "commentId",
        ({
          orgId, ticketId,
        }) => ({
          orgId,
          ticketId,
        }),
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "Updated content of the comment. To retrieve or set user mentions, use this code format: `zsu[@user:{zuid}zsu.`",
      optional: true,
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "Used to denote the content-type which may be `html` or `plainText`. The default type is `html`.",
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
      commentId,
      content,
      contentType,
    } = this;

    const response = await this.zohoDesk.updateTicketComment({
      $,
      ticketId,
      commentId,
      headers: {
        orgId,
      },
      data: {
        content,
        contentType,
      },
    });

    $.export("$summary", `Successfully updated comment with ID ${commentId}`);

    return response;
  },
};
