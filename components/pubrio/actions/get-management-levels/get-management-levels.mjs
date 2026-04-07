import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-management-levels",
  name: "Get Management Levels",
  description: "Get available management level codes for filtering. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
  },
  async run({ $ }) {
    const response = await this.pubrio.makeRequest({
      $,
      method: "GET",
      url: "/management_levels",
    });
    $.export("$summary", "Successfully retrieved management levels");
    return response;
  },
};
