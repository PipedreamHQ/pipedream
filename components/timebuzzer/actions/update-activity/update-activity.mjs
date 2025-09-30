import timebuzzer from "../../timebuzzer.app.mjs";

export default {
  key: "timebuzzer-update-activity",
  name: "Update Activity",
  description: "Modifies an existing activity in Timebuzzer. [See the documentation](https://my.timebuzzer.com/doc/#api-Activities-EditActivity)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    timebuzzer,
    activityId: {
      propDefinition: [
        timebuzzer,
        "activityId",
      ],
    },
    tileIds: {
      propDefinition: [
        timebuzzer,
        "tileIds",
      ],
      optional: true,
    },
    startDate: {
      propDefinition: [
        timebuzzer,
        "startDate",
      ],
      optional: true,
    },
    endDate: {
      propDefinition: [
        timebuzzer,
        "endDate",
      ],
      optional: true,
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
    note: {
      propDefinition: [
        timebuzzer,
        "note",
      ],
      optional: true,
    },
    userId: {
      propDefinition: [
        timebuzzer,
        "userId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const activity = await this.timebuzzer.getActivity({
      $,
      activityId: this.activityId,
    });
    const response = await this.timebuzzer.updateActivity({
      $,
      activityId: this.activityId,
      data: {
        tiles: this.tileIds || activity.tiles,
        startDate: this.startDate || activity.startDate,
        endDate: this.endDate || activity.endDate,
        startUtcOffset: this.startUtcOffset || activity.startUtcOffset,
        endUtcOffset: this.endUtcOffset || activity.endUtcOffset,
        userId: this.userId || activity.userId,
        note: this.note || activity.note,
      },
    });
    $.export("$summary", `Successfully updated activity ${this.activityId}`);
    return response;
  },
};
