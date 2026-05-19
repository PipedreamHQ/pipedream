import { ConfigurationError } from "@pipedream/platform";
import app from "../../strava.app.mjs";
import { SPORT_TYPES } from "../../common/constants.mjs";

export default {
  key: "strava-create-activity",
  name: "Create Activity",
  description: "Create a manual activity on Strava (logging a workout you did without a tracking device)."
    + " For uploading activity files (GPX / TCX / FIT), use Strava's upload endpoint — not exposed by this connector."
    + " Pass `sportType` from Strava's documented `sport_type` enum (modern field, replaces legacy `type`). Common values: Run, Ride, Hike, Swim, Walk, Workout, Yoga."
    + " `startDateLocal` must be ISO 8601 in the athlete's local time with timezone offset or `Z` for UTC. Example: `2026-05-15T07:00:00Z`."
    + " [See the documentation](https://developers.strava.com/docs/reference/#api-Activities-createActivity)",
  version: "1.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Activity Name",
      description: "The name of the activity (e.g., \"Morning Run\").",
    },
    sportType: {
      type: "string",
      label: "Sport Type",
      description: "Strava sport type. Uses the modern `sport_type` enum (not the legacy `type` field).",
      options: SPORT_TYPES,
    },
    startDateLocal: {
      type: "string",
      label: "Start Date (local)",
      description: "ISO 8601 datetime in the athlete's local time. Format: `YYYY-MM-DDTHH:MM:SS` with timezone offset or `Z`. Example: `2026-05-15T07:00:00Z`.",
    },
    elapsedTime: {
      type: "integer",
      label: "Elapsed Time (seconds)",
      description: "Total elapsed time in seconds. Example: `3600` for one hour.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional description of the activity.",
      optional: true,
    },
    distance: {
      type: "string",
      label: "Distance (meters)",
      description: "Optional. Distance in meters as a numeric string. Example: `5000` for 5 km.",
      optional: true,
    },
    trainer: {
      type: "boolean",
      label: "Trainer",
      description: "Mark as a trainer activity (indoor / stationary).",
      optional: true,
      default: false,
    },
    commute: {
      type: "boolean",
      label: "Commute",
      description: "Mark as a commute.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|[+-]\d{2}:\d{2})$/;
    if (!isoDatePattern.test(this.startDateLocal)) {
      throw new ConfigurationError("`Start Date (local)` must be ISO 8601 with timezone (e.g., `2026-05-15T07:00:00Z`).");
    }
    // Use Number() not parseFloat() for strict validation: parseFloat("5000m")
    // silently returns 5000, which would mask a unit-suffix mistake.
    const distanceMeters = this.distance != null
      ? Number(this.distance)
      : null;
    if (this.distance != null && !Number.isFinite(distanceMeters)) {
      throw new ConfigurationError("`Distance` must be a pure number in meters with no units (e.g., `5000`, not `5000m`).");
    }

    const data = {
      name: this.name,
      sport_type: this.sportType,
      start_date_local: this.startDateLocal,
      elapsed_time: this.elapsedTime,
    };
    if (this.description) data.description = this.description;
    if (distanceMeters != null) data.distance = distanceMeters;
    if (this.trainer) data.trainer = 1;
    if (this.commute) data.commute = 1;

    const resp = await this.app.createNewActivity({
      $,
      data,
    });
    $.export("$summary", `Created activity "${this.name}"${resp?.id
      ? ` (id ${resp.id})`
      : ""}`);
    return resp;
  },
};
