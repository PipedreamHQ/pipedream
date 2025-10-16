import timing from "../../timing.app.mjs";

export default {
  key: "timing-stop-timer",
  name: "Stop Timer",
  description: "Stop the currently running timer. [See the documentation](https://web.timingapp.com/docs/#time-entries-PUTapi-v1-time-entries-stop)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    timing,
  },
  async run({ $ }) {
    const response = await this.timing.stopActiveTimer({
      $,
    });
    $.export("$summary", "Successfully stopped timer");
    return response;
  },
};
