import mctime from "../../mctime.app.mjs";

export default {
  key: "mctime-stop-clocking",
  name: "Stop Clocking",
  description: "Stop an existing clocking time entry. [See the documentation](https://mctime.readme.io/reference/manipulating-clocking-times)",
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
      label: "Stop Datetime",
      description: "The dateTime when the clock is stopped. Provide in ISO-8601 format containing a timezone, eg. `2022-04-25T08:00:00+03:00`.",
    },
  },
  async run({ $ }) {
    const response = await this.mctime.manipulateClockingTime({
      $,
      data: {
        dateTime: this.dateTime,
        action: "stop",
        userId: this.userId,
      },
    });
    if (!response.items[0].message.includes("could not be saved")) {
      $.export("$summary", "Successfully stopped clocking.");
    } else {
      throw new Error(response.items[0].message);
    }
    return response;
  },
};
