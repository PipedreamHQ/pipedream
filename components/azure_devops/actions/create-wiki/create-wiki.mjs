// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import azureDevops from "../../azure_devops.app.mjs";
import { WIKI_TYPE_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "azure_devops-create-wiki",
  name: "Create Wiki",
  description: "Create a project wiki, or publish a folder of an existing Git repository as a code wiki. Returns the new wiki's id, name and backing repository. A project wiki provisions its own repository; a code wiki needs an existing repository, branch and folder. Use this when standing up documentation for a new project. Example: name `payments.wiki`, type `projectWiki`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wiki/wikis/create?view=azure-devops-rest-7.1)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    wikiType: {
      type: "string",
      label: "Wiki Type",
      description: "Kind of wiki to create. Defaults to `projectWiki`.",
      options: WIKI_TYPE_OPTIONS,
      default: "projectWiki",
    },
    wikiName: {
      type: "string",
      label: "Wiki Name",
      description: "Name of the new wiki",
    },
    repositoryId: {
      propDefinition: [
        azureDevops,
        "repositoryId",
      ],
      description: "ID of the Git repository backing the wiki. Required for a code wiki. Run the **List Repositories** action first to obtain valid values.",
      optional: true,
    },
    mappedPath: {
      propDefinition: [
        azureDevops,
        "filePath",
      ],
      label: "Mapped Path",
      description: "Repository folder published as the wiki, e.g. `/docs`. Required for a code wiki.",
      optional: true,
    },
    version: {
      propDefinition: [
        azureDevops,
        "gitVersion",
      ],
      label: "Branch",
      description: "Repository branch the code wiki is published from, e.g. `main`. Required for a code wiki.",
      optional: true,
    },
  },
  async run({ $ }) {
    const isCodeWiki = this.wikiType === "codeWiki";
    if (isCodeWiki && !(this.repositoryId && this.mappedPath && this.version)) {
      throw new ConfigurationError("**Repository**, **Mapped Path** and **Branch** are all required when **Wiki Type** is `codeWiki`.");
    }
    const project = await this.azureDevops.getProject({
      $,
      organization: this.organization,
      projectId: this.project,
    });

    const response = await this.azureDevops.createWiki({
      $,
      organization: this.organization,
      project: this.project,
      data: {
        type: this.wikiType,
        name: this.wikiName,
        projectId: project.id,
        repositoryId: isCodeWiki
          ? this.repositoryId
          : undefined,
        mappedPath: isCodeWiki
          ? this.mappedPath
          : undefined,
        version: isCodeWiki
          ? {
            version: this.version,
          }
          : undefined,
      },
    });
    $.export("$summary", `Created wiki ${response.id}: ${response.name}`);
    return response;
  },
};
