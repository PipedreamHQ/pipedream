import app from "../../calendarhero.app.mjs";

export default {
  key: "calendarhero-list-meetings",
  name: "List Meetings",
  description: "Get the user's meetings within a timeframe. [See the documentation](https://api.calendarhero.com/documentation#/meeting/getMeeting).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    start: {
      type: "string",
      label: "Start Date/Time",
      description: "Initial date/time of the period to list events, in ISO 8601 format, e.g. `2025-03-10T09:00:00Z`",
    },
    end: {
      type: "string",
      label: "End Date/Time",
      description: "End date/time of the period to list events, in ISO 8601 format, e.g. `2025-03-14T18:00:00Z`",
    },
  },
  async run({ $ }) {
    const {
      app, ...params
    } = this;
    const response = await app.listMeetings({
      $,
      params,
    });
    const { length } = response;
    $.export("$summary", `Successfully listed ${length} meeting${length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
