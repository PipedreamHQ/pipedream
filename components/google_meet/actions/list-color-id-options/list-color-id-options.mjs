import google_meet from "../../google_meet.app.mjs";

export default {
  key: "google_meet-list-color-id-options",
  name: "List Color ID Options",
  description: "List the available event color options (each Color ID with its background and foreground hex values). Run this to discover valid Color IDs before setting the Color ID prop in **Schedule Meeting** or **Update Meeting**. [See the documentation](https://developers.google.com/calendar/api/v3/reference/colors/get)",
  version: "0.0.3",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    google_meet,
  },
  async run({ $ }) {
    const options = await google_meet.propDefinitions.colorId.options.call(this.google_meet);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
