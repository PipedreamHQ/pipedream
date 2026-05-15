import app from "../../huntress.app.mjs";

export default {
  key: "huntress-list-organizations",
  name: "List Organizations",
  description: "List organizations belonging to your Huntress account. [See the documentation](https://api.huntress.io/docs#tag/organizations/get/v1/organizations)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const organizations = await this.app.paginate({
      fn: this.app.listOrganizations.bind(this.app),
      fnArgs: {
        $,
      },
      keyField: "organizations",
    });

    $.export("$summary", `Successfully retrieved \`${organizations.length}\` organization(s)`);

    return organizations;
  },
};
