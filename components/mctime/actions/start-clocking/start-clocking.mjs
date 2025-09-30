import mctime from "../../mctime.app.mjs";

export default {
  key: "mctime-start-clocking",
  name: "Start Clocking",
  description: "Start a new clocking time entry. [See the documentation](https://mctime.readme.io/reference/manipulating-clocking-times)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mctime,
    userId: {
      propDefinition: [
        mctime,
        "userId",
      ],
    },
    dateTime: {
      type: "string",
      label: "Start Datetime",
      description: "The dateTime when the clock has started. Provide in ISO-8601 format containing a timezone, eg. `2022-04-25T08:00:00+03:00`.",
    },
    timeType: {
      propDefinition: [
        mctime,
        "timeType",
      ],
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "A comment for the clocking time entry",
      optional: true,
    },
    organizationId: {
      propDefinition: [
        mctime,
        "organizationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mctime.manipulateClockingTime({
      $,
      data: {
        dateTime: this.dateTime,
        action: "start",
        timeType: this.timeType,
        userId: this.userId,
        comment: this.comment,
        organizationId: this.organizationId,
      },
    });
    if (response.items[0].data) {
      $.export("$summary", `Successfully started clocking with ID ${response.items[0].data.id}`);
    } else {
      throw new Error(response.items[0].message);
    }
    return response;
  },
};
