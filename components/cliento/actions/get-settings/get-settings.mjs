import cliento from "../../cliento.app.mjs";

export default {
  key: "cliento-get-settings",
  name: "Fetch Settings",
  description: "Fetch settings and features for the booking widget. [See the documentation](https://developers.cliento.com/docs/rest-api#fetch-settings)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    cliento,
  },
  async run({ $ }) {
    const response = await this.cliento.fetchSettings({
      $,
    });
    $.export("$summary", "Successfully fetched settings");
    return response;
  },
};
