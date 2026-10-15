import azureDevops from "../../azure_devops.app.mjs";
import { RECURSION_LEVEL_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "azure_devops-list-repository-items",
  name: "List Repository Items",
  description: "List the files and folders under a path in a Git repository. Returns each entry's path, object id and whether it is a folder. Use this to explore a repository's layout, then read a specific file with the **Get File Content** action. Azure DevOps rejects a recursion level other than `none` when a single file path is given, so listing and reading are separate calls. Example: scope path `/src` with recursion `oneLevel`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/items/list?view=azure-devops-rest-7.1)",
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
    repositoryId: {
      propDefinition: [
        azureDevops,
        "repositoryId",
      ],
    },
    scopePath: {
      propDefinition: [
        azureDevops,
        "filePath",
      ],
      label: "Scope Path",
      description: "Repository-relative folder to list, e.g. `/src`. Defaults to the repository root.",
      optional: true,
    },
    recursionLevel: {
      type: "string",
      label: "Recursion Level",
      description: "How deep to walk the tree. Defaults to `oneLevel`.",
      options: RECURSION_LEVEL_OPTIONS,
      default: "oneLevel",
      optional: true,
    },
    version: {
      propDefinition: [
        azureDevops,
        "gitVersion",
      ],
      optional: true,
    },
    versionType: {
      propDefinition: [
        azureDevops,
        "gitVersionType",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const { value: items } = await this.azureDevops.listItems({
      $,
      organization: this.organization,
      project: this.project,
      repositoryId: this.repositoryId,
      params: {
        "scopePath": this.scopePath,
        "recursionLevel": this.recursionLevel,
        "versionDescriptor.version": this.version,
        "versionDescriptor.versionType": this.versionType,
      },
    });
    $.export("$summary", `Found ${items.length} item${items.length === 1
      ? ""
      : "s"} in repository ${this.repositoryId}`);
    return items;
  },
};
