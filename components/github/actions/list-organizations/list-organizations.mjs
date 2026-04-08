import github from "../../github.app.mjs";

export default {
  key: "github-list-organizations",
  name: "List Organizations",
  description: "List all organizations in the authenticated user's account. [See the documentation](https://docs.github.com/en/rest/orgs/orgs?apiVersion=2026-03-10#list-organizations-for-the-authenticated-user)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    github,
  },
  async run({ $ }) {
    let page = 1;
    const perPage = 100;
    let allOrganizations = [];

    while (true) {
      const organizations = await this.github.getOrganizations({
        page,
        per_page: perPage,
      });

      if (organizations.length === 0) {
        break;
      }

      allOrganizations = allOrganizations.concat(organizations);
      page += 1;
    }

    $.export("$summary", `Successfully listed ${allOrganizations.length} organization${allOrganizations.length === 1
      ? ""
      : "s"}`);

    return allOrganizations;
  },
};
