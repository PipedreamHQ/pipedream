import constants from "../../common/constants.mjs";
import teamleaderFocus from "../../teamleader_focus.app.mjs";

export default {
  key: "teamleader_focus-list-messages",
  name: "List Messages",
  description: "List messages for a single ticket. [See the documentation](https://developer.focus.teamleader.eu/docs/api/tickets-list-messages)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    teamleaderFocus,
    ticketId: {
      propDefinition: [
        teamleaderFocus,
        "ticketId",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of messages to list",
      options: constants.MESSAGE_TYPE_OPTIONS,
      optional: true,
    },
    createdBefore: {
      type: "string",
      label: "Created Before",
      description: "Filter messages created before this date. E.g. `2024-01-01T18:00:00+00:00`",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Filter messages created after this date. E.g. `2024-01-01T18:00:00+00:00`",
      optional: true,
    },
    pageNumber: {
      type: "integer",
      label: "Page Number",
      description: "Page number to retrieve",
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Page size to retrieve",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      teamleaderFocus,
      ticketId,
      type,
      createdBefore,
      createdAfter,
      pageNumber,
      pageSize,
    } = this;

    const paginate = {};
    if (pageNumber) {
      paginate.number = pageNumber;
    }
    if (pageSize) {
      paginate.size = pageSize;
    }

    const { data: response } = await teamleaderFocus.listMessages({
      $,
      data: {
        id: ticketId,
        filter: {
          type,
          createdBefore,
          createdAfter,
        },
        ...(Object.keys(paginate).length > 0
          ? {
            paginate,
          }
          : {}),
      },
    });
    $.export("$summary", `Successfully listed ${response.length} message${response.length === 1
      ? ""
      : "s"} for ticket with ID ${ticketId}`);
    return response;
  },
};
