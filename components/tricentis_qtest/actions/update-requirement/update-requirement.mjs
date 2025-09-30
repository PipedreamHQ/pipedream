import {
  getFieldProps as additionalProps, getProperties,
} from "../../common/utils.mjs";
import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-update-requirement",
  name: "Update Requirement",
  description: "Update a requirement. [See the documentation](https://documentation.tricentis.com/qtest/od/en/content/apis/apis/requirement_apis.htm#UpdateARequirement)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    requirementId: {
      propDefinition: [
        tricentisQtest,
        "requirementId",
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
    const { /* eslint-disable no-unused-vars */
      tricentisQtest,
      projectId,
      requirementId,
      name,
      getProperties,
      getDataFields,
      ...fields
    } = this; /* eslint-enable no-unused-vars */
    const response = await tricentisQtest.updateRequirement({
      $,
      projectId,
      requirementId,
      data: {
        name,
        properties: getProperties(fields),
      },
    });
    $.export("$summary", `Successfully updated requirement (ID: ${requirementId})`);
    return response;
  },
};
