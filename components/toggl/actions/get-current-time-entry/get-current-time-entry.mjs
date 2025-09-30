import toggl from "../../toggl.app.mjs";

export default {
  name: "Get Current Time Entry",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "toggl-get-current-time-entry",
  description: "Get the time entry that is running now. [See docs here]https://developers.track.toggl.com/docs/api/time_entries#get-get-current-time-entry)",
  type: "action",
  props: {
    toggl,
  },
  async run({ $ }) {
    const response = await this.toggl.getCurrentTimeEntry({
      $,
    });

    response && $.export("$summary", "Successfully retrieved current time entry");

    return response;
  },
};
