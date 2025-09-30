import {
  getFieldProps as additionalProps, getProperties,
} from "../../common/utils.mjs";
import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-create-requirement",
  name: "Create Requirement",
  description: "Create a new requirement. [See the documentation](https://documentation.tricentis.com/qtest/od/en/content/apis/apis/requirement_apis.htm#CreateARequirement)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    parentId: {
      propDefinition: [
        tricentisQtest,
        "parentId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      reloadProps: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Requirement name",
    },
  },
  additionalProps,
  methods: {
    getDataFields() {
      return this.tricentisQtest.getRequirementFields(this.projectId);
    },
    getProperties,
  },
  async run({ $ }) {
    const { // eslint-disable-next-line no-unused-vars
      tricentisQtest, projectId, parentId, name, getProperties, getDataFields, ...fields
    } = this;
    const response = await tricentisQtest.createRequirement({
      $,
      projectId,
      params: {
        parentId,
      },
      data: {
        name,
        properties: getProperties(fields),
      },
    });
    $.export("$summary", `Successfully created requirement (ID: ${response.id})`);
    return response;
  },
};
