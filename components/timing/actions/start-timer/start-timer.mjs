import timing from "../../timing.app.mjs";

export default {
  key: "timing-start-timer",
  name: "Start Timer",
  description: "Starts a new ongoing timer as per the current timestamp or specified start date. [See the documentation](https://web.timingapp.com/docs/#time-entries-POSTapi-v1-time-entries-start)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    timing,
    project: {
      propDefinition: [
        timing,
        "project",
      ],
    },
    startDate: {
      propDefinition: [
        timing,
        "startDate",
      ],
      description: "The date this timer should have started at. Defaults to \"now\". Example: `2019-01-01T00:00:00+00:00`",
      optional: true,
    },
    title: {
      propDefinition: [
        timing,
        "title",
      ],
    },
    notes: {
      propDefinition: [
        timing,
        "notes",
      ],
    },
    replaceExisting: {
      propDefinition: [
        timing,
        "replaceExisting",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.timing.startNewTimer({
      $,
      data: {
        project: this.project,
        start_date: this.startDate,
        title: this.title,
        notes: this.notes,
        replace_existing: this.replaceExisting,
      },
    });
    $.export("$summary", "Successfully started new timer");
    return response;
  },
};
