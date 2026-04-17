import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-locations",
  name: "Get Locations",
  description: "Get available location codes for filtering. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/locations/locations)",
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
    const response = await this.pubrio.getLocations({
      $,
    });
    $.export("$summary", "Successfully retrieved locations");
    return response;
  },
};
