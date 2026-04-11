import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-management-levels",
  name: "Get Management Levels",
  description: "Get available management level codes for filtering. [See the documentation](https://docs.pubrio.com)",
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
    const response = await this.pubrio.getManagementLevels({
      $,
    });
    $.export("$summary", "Successfully retrieved management levels");
    return response;
  },
};
