import { ConfigurationError } from "@pipedream/platform";
import app from "../../supabird.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "supabird-add-posting-slot",
  name: "Add Posting Slot",
  description: "Add a weekly posting slot. Posts created with **Create Post** and **When** set to `Next free slot` fill the next free slot. Times are in the timezone of your SupaBird account. [See the documentation](https://api.supabird.io/v1/docs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    weekday: {
      type: "string",
      label: "Weekday",
      description: "The day of the week for the slot, e.g. `monday`. One of `monday` to `sunday`, `today` or `tomorrow`.",
      options: constants.WEEKDAYS,
    },
    localTime: {
      type: "string",
      label: "Local Time",
      description: "The time of day in 24-hour `HH:MM` format, e.g. `09:30`.",
    },
    tagName: {
      type: "string",
      label: "Tag Name",
      description: "An optional label for the slot, e.g. `launch`.",
      optional: true,
    },
    socialSet: {
      propDefinition: [
        app,
        "socialSet",
      ],
      description: "The social set the slot belongs to, e.g. `6af6f28f3d61850002518bfe`. Use **List Social Sets** to find it (the `id` field). Required when your account has several social sets.",
    },
  },
  async run({ $ }) {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(this.localTime)) {
      throw new ConfigurationError("**Local Time** must be in 24-hour `HH:MM` format, e.g. `09:30`.");
    }
    const response = await this.app.createPostingSlot({
      $,
      data: {
        weekday: this.weekday,
        local_time: this.localTime,
        tag_name: this.tagName,
        social_set: this.socialSet,
      },
    });
    $.export("$summary", `Added posting slot on ${this.weekday} at ${this.localTime}`);
    return response;
  },
};
