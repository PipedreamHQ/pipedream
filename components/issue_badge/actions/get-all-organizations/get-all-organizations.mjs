import issueBadge from "../../issue_badge.app.mjs";

export default {
  key: "issue_badge-get-all-organizations",
  name: "Get All Organizations",
  description: "Retrieve all organizations [See the documentation](https://documenter.getpostman.com/view/19911979/2sA2r9X4Aj#64e5ee48-8e20-463b-addd-e697452e8e5a)",
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
    const response = await this.issueBadge.listAllOrganizations({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.data.length} organizations`);
    return response.data;
  },
};
