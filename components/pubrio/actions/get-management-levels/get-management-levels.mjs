import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-management-levels",
  name: "Get Management Levels",
  description: "Get available management level codes for filtering. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/management-levels/management-levels)",
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
    const response = await this.pubrio.getManagementLevels({
      $,
    });
    $.export("$summary", "Successfully retrieved management levels");
    return response;
  },
};
