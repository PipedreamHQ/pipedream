import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-get-defect",
  name: "Get Defect",
  description: "Get details of a defect. [See the documentation](https://documentation.tricentis.com/qtest/od/en/content/apis/apis/defect_apis.htm#GetRecentlyUpdatedDefects)",
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
    defectId: {
      propDefinition: [
        tricentisQtest,
        "defectId",
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
    const response = await tricentisQtest.getDefect({
      $,
      ...args,
    });
    $.export("$summary", `Successfully fetched defect (ID: ${args.defectId})`);
    return response;
  },
};
