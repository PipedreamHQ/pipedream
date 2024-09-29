import {
  getRequirementFieldProps as additionalProps, getProperties,
} from "../../common/utils.mjs";
import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-update-requirement",
  name: "Update Requirement",
  description: "Update a requirement. [See the documentation](https://documentation.tricentis.com/qtest/od/en/content/apis/apis/requirement_apis.htm#UpdateARequirement)",
  version: "0.0.{{ts}}",
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
    name: {
      type: "string",
      label: "Name",
      description: "Requirement name",
    },
    useFields: {
      propDefinition: [
        tricentisQtest,
        "useFields",
      ],
    },
  },
  additionalProps,
  methods: {
    getProperties,
  },
  async run({ $ }) {
    const { // eslint-disable-next-line no-unused-vars
      tricentisQtest, projectId, requirementId, useFields, name, getProperties, ...fields
    } = this;
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
