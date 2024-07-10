import toggl from "../../toggl.app.mjs";

export default {
  name: "Get Time Entry",
  version: "0.0.5",
  key: "toggl-get-time-entry",
  description: "Get details about a specific time entry. [See docs here](https://developers.track.toggl.com/docs/api/time_entries)",
  type: "action",
  props: {
    toggl,
    timeEntryId: {
      propDefinition: [
        toggl,
        "timeEntryId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.toggl.getTimeEntry({
      $,
      timeEntryId: this.timeEntryId,
    });

    $.export("$summary", "Successfully retrieved time entry");
    return response;
  },
};
