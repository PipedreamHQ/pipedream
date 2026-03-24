import constants from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import teamleaderFocus from "../../teamleader_focus.app.mjs";

export default {
  key: "teamleader_focus-import-message",
  name: "Import Message",
  description: "Import a message into a ticket. [See the documentation](https://developer.focus.teamleader.eu/docs/api/tickets-import-message)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    teamleaderFocus,
    ticketId: {
      propDefinition: [
        teamleaderFocus,
        "ticketId",
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "Uses HTML formatting",
    },
    sentByType: {
      type: "string",
      label: "Sent By Type",
      description: "The type of the sender",
      options: constants.SENT_BY_TYPE_OPTIONS,
    },
    sentById: {
      type: "string",
      label: "Sent By ID",
      description: "The ID of the sender",
    },
    sentAt: {
      type: "string",
      label: "Sent At",
      description: "The date and time the message was sent, E.g. `2024-02-29T11:11:11+00:00`",
    },
    fileIds: {
      type: "string[]",
      label: "File IDs",
      description: "Identifiers of files",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      teamleaderFocus,
      ticketId,
      body,
      sentByType,
      sentById,
      sentAt,
      fileIds,
    } = this;

    const { data: response } = await teamleaderFocus.importMessage({
      $,
      data: {
        id: ticketId,
        body,
        sent_by: {
          type: sentByType,
          id: sentById,
        },
        sent_at: sentAt,
        attachments: parseObject(fileIds),
      },
    });
    $.export("$summary", `Successfully imported message for ticket with ID ${ticketId}`);
    return response;
  },
};
