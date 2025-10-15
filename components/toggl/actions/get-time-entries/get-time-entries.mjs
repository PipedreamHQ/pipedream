import toggl from "../../toggl.app.mjs";

export default {
  name: "Get Time Entries",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "toggl-get-time-entries",
  description: "Get the last thousand time entries. [See docs here](https://developers.track.toggl.com/docs/api/time_entries#get-timeentries)",
  type: "action",
  props: {
    toggl,
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Get entries with start time, from start_date YYYY-MM-DD or with time in RFC3339 format. To be used with end_date.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "Get entries with start time, until end_date YYYY-MM-DD or with time in RFC3339 format. To be used with start_date.",
      optional: true,
    },
    since: {
      type: "string",
      label: "Since (UNIX timestamp)",
      description: "Get entries modified since this date using UNIX timestamp, including deleted ones.",
      optional: true,
    },
    before: {
      type: "string",
      label: "Before",
      description: "Get entries with start time, before given date (YYYY-MM-DD) or with time in RFC3339 format.",
      optional: true,
    },
    meta: {
      type: "boolean",
      label: "Meta",
      description: "Should the response contain data for meta entities.",
      optional: true,
    },
    includeSharing: {
      type: "boolean",
      label: "Include Sharing",
      description: "Include sharing details in the response.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.startDate) params.start_date = this.startDate;
    if (this.endDate) params.end_date = this.endDate;
    if (this.since) params.since = this.since;
    if (this.before) params.before = this.before;
    if (typeof this.meta === "boolean") params.meta = this.meta;
    if (typeof this.includeSharing === "boolean") params.include_sharing = this.includeSharing;
    const response = await this.toggl.getTimeEntries({
      params,
      $,
    });

    response && $.export("$summary", "Successfully retrieved time entries");

    return response;
  },
};
