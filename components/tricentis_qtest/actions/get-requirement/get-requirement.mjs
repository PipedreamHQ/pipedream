import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-get-requirement",
  name: "Get Requirement",
  description: "Get details of a requirement. [See the documentation](https://documentation.tricentis.com/qtest/od/en/content/apis/apis/requirement_apis.htm#GetARequirementByItsID)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    tricentisQtest,
    projectId: {
      propDefinition: [
        tricentisQtest,
        "projectId",
      ],
    },
    requirementId: {
      propDefinition: [
        tricentisQtest,
        "requirementId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      tricentisQtest, ...args
    } = this;
    const response = await tricentisQtest.getRequirement({
      $,
      ...args,
    });
    $.export("$summary", `Successfully fetched requirement (ID: ${args.requirementId})`);
    return response;
  },
};
