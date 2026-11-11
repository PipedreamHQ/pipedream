import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-list-requirements",
  name: "List Requirements",
  description: "List requirements in a qTest project. Use this to find requirement IDs to use when getting or updating a specific requirement. If the response contains a full page of results, increment the Page parameter and call again to retrieve the next page. Example: `projectId: 1, page: 1` → returns `[{id: 101, name: \"User can log in\"}, {id: 102, name: \"Password reset via email\"}]`. [See the documentation](https://docs.tricentis.com/qtest-saas/content/apis/apis/requirement_apis.htm#get-all-requirements)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tricentisQtest,
    projectId: {
      propDefinition: [
        tricentisQtest,
        "projectId",
      ],
    },
    page: {
      propDefinition: [
        tricentisQtest,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tricentisQtest.getRequirements({
      $,
      projectId: this.projectId,
      params: {
        page: this.page,
      },
    });
    const requirements = (response ?? []).map(({
      id, name,
    }) => ({
      id,
      name,
    }));
    $.export("$summary", `Successfully fetched ${requirements.length} requirement${
      requirements.length === 1
        ? ""
        : "s"
    }`);
    return requirements;
  },
};
