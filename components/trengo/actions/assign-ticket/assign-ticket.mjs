import app from "../../trengo.app.mjs";

export default {
  type: "action",
  key: "trengo-assign-ticket",
  version: "0.0.1",
  name: "Assign Ticket",
  description:
    "Assign a Trengo ticket to a user or a team. [See the documentation](https://developers.trengo.com/reference/assign-a-ticket)",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    ticketId: {
      propDefinition: [
        app,
        "ticketId",
      ],
    },
    type: {
      type: "string",
      label: "Assignment Type",
      description: "Assign the ticket to a user or a team",
      options: [
        {
          label: "User",
          value: "user",
        },
        {
          label: "Team",
          value: "team",
        },
      ],
    },
    userId: {
      type: "integer",
      label: "User ID",
      description: "Required if assignment type is user",
      optional: true,
    },
    teamId: {
      type: "integer",
      label: "Team ID",
      description: "Required if assignment type is team",
      optional: true,
    },
    note: {
      propDefinition: [
        app,
        "note",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.type === "user" && !this.userId) {
      throw new Error("User ID is required when assignment type is 'user'");
    }

    if (this.type === "team" && !this.teamId) {
      throw new Error("Team ID is required when assignment type is 'team'");
    }

    const data = {
      type: this.type,
      ...(this.userId && {
        user_id: this.userId,
      }),
      ...(this.teamId && {
        team_id: this.teamId,
      }),
      ...(this.note && {
        note: this.note,
      }),
    };

    const response = await this.app.assignTicket({
      $,
      ticketId: this.ticketId,
      data,
    });

    $.export(
      "$summary",
      `Ticket ${this.ticketId} assigned to ${this.type} successfully`,
    );

    return response;
  },
};
