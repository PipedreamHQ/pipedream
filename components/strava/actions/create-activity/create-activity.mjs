import strava from "../../strava.app.js";

export default {
  name: "Create Activity",
  description: "Creates a manual activity for an athlete, requires activity:write scope. See `https://developers.strava.com/docs/reference/`",
  key: "strava_create-activity",
  version: "0.0.1",
  type: "action",
  props: {
    strava,
    name: {
      type: "string",
      label: "The name of the activity",
      description: "The name of the activity",
    },
    type: {
      type: "string",
      label: "Type of activity",
      description: "Type of activity. For example - Run, Ride etc.",
    },
    start_date_local: {
      type: "string",
      label: "Start date of activity",
      description: "ISO 8601 formatted date time without miliseconds e.g. `2013-10-20T19:20:30+01:00`",
    },
    elapsed_time: {
      type: "integer",
      label: "Elapsed time",
      description: "Elapsed time in seconds",
    },
    description: {
      type: "string",
      label: "Description of the activity",
      description: "Description of the activity",
      optional: true,
    },
    distance: {
      type: "string",
      label: "Distance",
      description: "Must be a float",
      optional: true,
    },
    trainer: {
      type: "integer",
      label: "Trainer",
      description: "Set to 1 to mark as a trainer activity",
      optional: true,
    },
    commute: {
      type: "integer",
      label: "Commute",
      description: "Set to 1 to mark as commute",
      optional: true,
    },
    hide_from_home: {
      type: "boolean",
      label: "Hide from home",
      description: "Set to true to mute activity",
      optional: true,
    },
  },
  async run({ $ }) {
    const isoDateRegexp = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(([+-](\d{2}):(\d{2})|Z))$/;
    const data = {
      name: this.name,
      type: this.type,
      start_date_local: this.start_date_local,
      elapsed_time: this.elapsed_time,
    };
    if (this.description)
      data.description = this.description;
    if (this.distance)
      data.distance = this.distance;
    if (this.trainer)
      data.trainer = this.trainer;
    if (this.commute)
      data.commute = this.commute;
    if (this.hide_from_home)
      data.hide_from_home = this.hide_from_home;
    if (this.distance && isNaN(parseFloat(this.distance)))
      throw new Error("Please provide a float for `Distance`");
    if (!isoDateRegexp.test(this.start_date_local))
      throw new Error("Please provide `Start date of activity` in required format");
    const resp = await this.strava.createNewActivity($, data);
    $.export("$summary", "Successfully added activity");
    return resp;
  },
};
