import toggl from "../../toggl.app.mjs";

export default {
  name: "Get Current Time Entry",
  version: "0.0.3",
  key: "toggl-get-current-time-entry",
  description: "Get the time entry that is running now. [See docs here](https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#get-running-time-entry)",
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
