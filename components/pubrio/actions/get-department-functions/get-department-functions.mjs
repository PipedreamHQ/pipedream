import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-department-functions",
  name: "Get Department Functions",
  description: "Get available department function codes for filtering. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
  },
  async run({ $ }) {
    const response = await this.pubrio.makeRequest({
      $,
      method: "GET",
      url: "/departments/function",
    });
    $.export("$summary", "Successfully retrieved department functions");
    return response;
  },
};
