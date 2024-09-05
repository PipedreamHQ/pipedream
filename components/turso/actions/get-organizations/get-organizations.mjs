import app from "../../turso.app.mjs";

export default {
  key: "turso-get-organizations",
  name: "Get Organizations",
  description: "Returns a list of organizations the authenticated user owns or is a member of. [See the documentation](https://docs.turso.tech/api-reference/organizations/list)",
  version: "0.0.3",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getOrganizations({
      $,
    });

    $.export("$summary", `Successfully retrieved '${response.length}' organization(s)`);

    return response;
  },
};
