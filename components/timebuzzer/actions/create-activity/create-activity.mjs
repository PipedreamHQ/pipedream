import timebuzzer from "../../timebuzzer.app.mjs";

export default {
  key: "timebuzzer-create-activity",
  name: "Create Activity",
  description: "Generates a new activity in Timebuzzer. [See the documentation](https://my.timebuzzer.com/doc/#api-Activities-CreateActivity)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    timebuzzer,
    userId: {
      propDefinition: [
        timebuzzer,
        "userId",
      ],
    },
    tileIds: {
      propDefinition: [
        timebuzzer,
        "tileIds",
      ],
    },
    note: {
      propDefinition: [
        timebuzzer,
        "note",
      ],
    },
    startDate: {
      propDefinition: [
        timebuzzer,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        timebuzzer,
        "endDate",
      ],
    },
    startUtcOffset: {
      propDefinition: [
        timebuzzer,
        "startUtcOffset",
      ],
    },
    endUtcOffset: {
      propDefinition: [
        timebuzzer,
        "endUtcOffset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.timebuzzer.createActivity({
      $,
      data: {
        tiles: this.tileIds,
        startDate: this.startDate,
        endDate: this.endDate,
        startUtcOffset: this.startUtcOffset,
        endUtcOffset: this.endUtcOffset,
        userId: this.userId,
        note: this.note,
      },
    });
    $.export("$summary", `Successfully created activity with ID ${response.id}`);
    return response;
  },
};
