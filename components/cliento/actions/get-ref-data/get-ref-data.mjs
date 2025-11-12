import cliento from "../../cliento.app.mjs";

export default {
  key: "cliento-get-ref-data",
  name: "Get Reference Data",
  description: "Fetch services, resources and mappings for the booking widget. [See the documentation](https://developers.cliento.com/docs/rest-api#fetch-ref-data)",
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
    const response = await this.cliento.fetchRefData({
      $,
    });
    $.export("$summary", "Successfully fetched reference data");
    return response;
  },
};
