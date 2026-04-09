import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-locations",
  name: "Get Locations",
  description: "Get available location codes for filtering. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  },
  props: {
    pubrio,
  },
  async run({ $ }) {
    const response = await this.pubrio.makeRequest({
      $,
      method: "GET",
      url: "/locations",
    });
    $.export("$summary", "Successfully retrieved locations");
    return response;
  },
};
