import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-company-sizes",
  name: "Get Company Sizes",
  description: "Get available company size codes for filtering. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
  },
  async run({ $ }) {
    const response = await this.pubrio.makeRequest({
      $,
      method: "GET",
      url: "/company_sizes",
    });
    $.export("$summary", "Successfully retrieved company sizes");
    return response;
  },
};
