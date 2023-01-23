import toggl from "../../toggl.app.mjs";

export default {
  name: "Get Time Entries",
  version: "0.0.3",
  key: "toggl-get-time-entries",
  description: "Get the last thousand time entries. [See docs here](https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#get-time-entries-started-in-a-specific-time-range)",
  type: "action",
  props: {
    toggl,
  },
  async run({ $ }) {
    const response = await this.toggl.getTimeEntries({
      $,
    });

    response && $.export("$summary", "Successfully retrieved time entries");

    return response;
  },
};
