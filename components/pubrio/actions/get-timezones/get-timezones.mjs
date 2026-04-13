import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-timezones",
  name: "Get Timezones",
  description: "Get available timezone codes for filtering. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/timezones/timezones)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
  },
  async run({ $ }) {
    const response = await this.pubrio.getTimezones({
      $,
    });
    $.export("$summary", "Successfully retrieved timezones");
    return response;
  },
};
