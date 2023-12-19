import toggl from "../../toggl.app.mjs";

export default {
  name: "Get Time Entry",
  version: "0.0.3",
  key: "toggl-get-time-entry",
  description: "Get details about a specific time entry. [See docs here](https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#get-time-entry-details)",
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

    response && $.export("$summary", "Successfully retrieved time entry");

    return response;
  },
};
