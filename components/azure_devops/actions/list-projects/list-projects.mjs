// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";
import { PROJECT_STATE_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "azure_devops-list-projects",
  name: "List Projects",
  description: "List the projects in an organization. Returns each project's id, name, state and visibility. Use this first in almost any Azure DevOps workflow - nearly every other action needs a project id or name. Example: organization `contoso` returns `Fabrikam-Fiber-Git` alongside its GUID. Returns at most **Limit** results per call - if that many come back there may be more, so raise **Skip** by **Limit** and call again to page through the rest. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/core/projects/list?view=azure-devops-rest-7.1)",
  version: "0.0.1",
  type: "action",
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
    stateFilter: {
      type: "string",
      label: "State Filter",
      description: "Only return projects in this state. Defaults to `wellFormed`.",
      options: PROJECT_STATE_OPTIONS,
      optional: true,
    },
    limit: {
      propDefinition: [
        azureDevops,
        "limit",
      ],
    },
    skip: {
      propDefinition: [
        azureDevops,
        "skip",
      ],
    },
  },
  async run({ $ }) {
    const { value: projects } = await this.azureDevops.listProjects({
      $,
      organization: this.organization,
      params: {
        stateFilter: this.stateFilter,
        $top: this.limit,
        $skip: this.skip,
      },
    });
    $.export("$summary", `Found ${projects.length} project${projects.length === 1
      ? ""
      : "s"} in ${this.organization}`);
    return projects;
  },
};
