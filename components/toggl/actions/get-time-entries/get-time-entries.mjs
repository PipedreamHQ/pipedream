import toggl from "../../toggl.app.mjs";

export default {
  name: "Get Time Entries",
  version: "0.0.6",
  key: "toggl-get-time-entries",
  description: "Get the last thousand time entries. [See docs here](https://developers.track.toggl.com/docs/api/time_entries#get-timeentries)",
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
