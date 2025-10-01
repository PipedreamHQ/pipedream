import issueBadge from "../../issue_badge.app.mjs";

export default {
  key: "issue_badge-get-all-badges",
  name: "Get All Badges",
  description: "Retrieve all badges [See the documentation](https://documenter.getpostman.com/view/19911979/2sA2r9X4Aj#5d30c8a9-f16a-4dfb-a3e0-c241e60935c4)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    issueBadge,
  },
  async run({ $ }) {
    const response = await this.issueBadge.listAllBadges({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.data.length} badges`);
    return response.data;
  },
};
