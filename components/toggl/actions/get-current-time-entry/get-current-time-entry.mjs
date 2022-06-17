import toggl from "../../toggl.app.mjs";

export default {
  name: "Get Current Time Entry",
  version: "0.0.1655410821",
  key: "tally-current-time-entry",
  description: "Get the time entry that is running now. [See docs here](https://7eggs.github.io/node-toggl-api/TogglClient.html#getCurrentTimeEntry)",
  type: "action",
  props: {
    toggl,
  },
  async run({ $ }) {
    const response = await this.toggl.getCurrentTimeEntry({
      $,
    });

    response && $.export("summary", "Successfully retrieved current time entry");

    return response;
  },
};
