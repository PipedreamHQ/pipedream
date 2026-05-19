import { ConfigurationError } from "@pipedream/platform";
import app from "../../strava.app.mjs";
import { SPORT_TYPES } from "../../common/constants.mjs";

export default {
  key: "strava-update-activity",
  name: "Update Activity",
  description: "Update fields on an existing Strava activity owned by the authenticated athlete."
    + " Use **Search Activities** first to resolve a name to an `activityId`."
    + " Only fields you provide are updated; omitted fields are left unchanged."
    + " `sportType` uses Strava's modern `sport_type` enum (not the legacy `type` field)."
    + " [See the documentation](https://developers.strava.com/docs/reference/#api-Activities-updateActivityById)",
  version: "1.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    activityId: {
      type: "string",
      label: "Activity ID",
      description: "The numeric ID of the activity to update (e.g., `18522207115`). Resolve via **Search Activities** if you only know the name.",
    },
    name: {
      type: "string",
      label: "Activity Name",
      description: "New name for the activity.",
      optional: true,
    },
    sportType: {
      type: "string",
      label: "Sport Type",
      description: "New sport type from Strava's `sport_type` enum (e.g., `Run`, `Ride`, `Hike`, `Swim`).",
      options: SPORT_TYPES,
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "New description for the activity.",
      optional: true,
    },
    trainer: {
      type: "boolean",
      label: "Trainer",
      description: "Mark as a trainer activity (indoor / stationary).",
      optional: true,
    },
    commute: {
      type: "boolean",
      label: "Commute",
      description: "Mark as a commute.",
      optional: true,
    },
    gearId: {
      type: "string",
      label: "Gear ID",
      description: "Strava gear ID to associate with this activity (e.g., a bike or pair of shoes).",
      optional: true,
    },
    hideFromHome: {
      type: "boolean",
      label: "Hide from Home Feed",
      description: "Set true to hide this activity from the athlete's home feed (muting).",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.name !== undefined) data.name = this.name;
    if (this.sportType !== undefined) data.sport_type = this.sportType;
    if (this.description !== undefined) data.description = this.description;
    if (this.trainer !== undefined) data.trainer = this.trainer;
    if (this.commute !== undefined) data.commute = this.commute;
    if (this.gearId !== undefined) data.gear_id = this.gearId;
    if (this.hideFromHome !== undefined) data.hide_from_home = this.hideFromHome;

    if (Object.keys(data).length === 0) {
      throw new ConfigurationError("Provide at least one field to update.");
    }

    const resp = await this.app.updateActivity({
      $,
      activityId: this.activityId,
      data,
    });
    $.export("$summary", `Updated activity ${this.activityId}`);
    return resp;
  },
};
