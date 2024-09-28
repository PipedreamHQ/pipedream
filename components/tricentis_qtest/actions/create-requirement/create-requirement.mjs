import { getRequirementFieldProps as additionalProps } from "../../common/utils.mjs";
import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-create-requirement",
  name: "Create Requirement",
  description: "Create a new requirement. [See the documentation](https://documentation.tricentis.com/qtest/od/en/content/apis/apis/requirement_apis.htm#CreateARequirement)",
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
    useFields: {
      propDefinition: [
        tricentisQtest,
        "useFields",
      ],
    },
  },
  additionalProps,
  async run({ $ }) {
    const { // eslint-disable-next-line no-unused-vars
      tricentisQtest, projectId, parentId, useFields, name, ...fields
    } = this;
    const response = await tricentisQtest.createRequirement({
      $,
      projectId,
      params: {
        parentId,
      },
      data: {
        name,
        properties: fields && Object.entries(fields).map(([
          id,
          value,
        ]) => ({
          field_id: id.split("_").pop(),
          field_value: value,
        })),
      },
    });
    $.export("$summary", `Successfully created requirement (ID: ${response.id})`);
    return response;
  },
};
