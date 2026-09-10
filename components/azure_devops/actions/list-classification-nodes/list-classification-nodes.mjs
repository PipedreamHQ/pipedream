import azureDevops from "../../azure_devops.app.mjs";
import { CLASSIFICATION_STRUCTURE_GROUP_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "azure_devops-list-classification-nodes",
  name: "List Classification Nodes",
  description: "List a project's area or iteration path tree. Returns the node tree with each node's name and full path. Use this to discover the values the **Area Path** and **Iteration Path** inputs of the work item actions expect - those inputs want the backslash-delimited path, not the node name. Example: structure group `Iterations` returns `Fabrikam-Fiber-Git\\\\Sprint 1`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/classification-nodes/get?view=azure-devops-rest-7.1)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    azureDevops,
    organization: {
      propDefinition: [
        azureDevops,
        "organizationName",
      ],
    },
    project: {
      propDefinition: [
        azureDevops,
        "project",
      ],
    },
    structureGroup: {
      type: "string",
      label: "Structure Group",
      description: "Which tree to return",
      options: CLASSIFICATION_STRUCTURE_GROUP_OPTIONS,
    },
    depth: {
      type: "integer",
      label: "Depth",
      description: "How many levels of children to fetch (max 10). Defaults to `2`.",
      min: 1,
      max: 10,
      default: 2,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.listClassificationNodes({
      $,
      organization: this.organization,
      project: this.project,
      structureGroup: this.structureGroup,
      params: {
        $depth: this.depth,
      },
    });
    $.export("$summary", `Retrieved the ${this.structureGroup} tree for project ${this.project}`);
    return response;
  },
};
