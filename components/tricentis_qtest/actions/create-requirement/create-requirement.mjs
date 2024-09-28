import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-create-requirement",
  name: "Create Requirement",
  description: "Create a new requirement. [See the documentation](https://documentation.tricentis.com/qtest/od/en/content/apis/apis/requirement_apis.htm#CreateARequirement)",
  version: "0.0.1",
  type: "action",
  props: {
    tricentisQtest,
    projectId: {
      propDefinition: [
        tricentisQtest,
        "projectId",
      ],
    },
    parentId: {
      propDefinition: [
        tricentisQtest,
        "parentId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Requirement name",
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "Requirement properties, with each key being the field id and its value being the field value. Example: `{ \"870001\": \"913\" }` sets the value of field 870001 to 913.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      tricentisQtest, projectId, parentId, ...data
    } = this;
    const response = await tricentisQtest.createRequirement({
      $,
      projectId,
      params: {
        parentId,
      },
      data,
    });
    $.export("$summary", `Successfully created requirement (ID: ${response.id})`);
    return response;
  },
};
