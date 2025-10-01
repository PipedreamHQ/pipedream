import app from "../../hackerone.app.mjs";

export default {
  key: "hackerone-get-members",
  name: "Get Members",
  description: "List all members of an organization. [See the documentation](https://api.hackerone.com/customer-resources/#organizations-get-all-members)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getMembers({
      $,
      organizationId: this.organizationId,
    });

    $.export("$summary", `Successfully retrieved ${response.data.length} members`);

    return response;
  },
};
