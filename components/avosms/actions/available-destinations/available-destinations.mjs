import app from "../../avosms.app.mjs";

export default {
  name: "Find Available Destinations",
  description: "Find available destination countries for SMS. [See the documentation](https://www.avosms.com/en/api/documentation/country/available)",
  key: "avosms-available-destinations",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listCountries({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.list_country?.length ?? 0} available destinations`);

    return response;
  },
};
