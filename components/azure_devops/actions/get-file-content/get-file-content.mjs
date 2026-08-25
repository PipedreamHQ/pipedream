// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-get-file-content",
  name: "Get File Content",
  description: "Read one file from a Git repository, at the default branch or at a specific branch, tag or commit. Returns the file's content along with its object id and path. Use this to read config or documentation without cloning. This is the single-item mode of the items endpoint: it returns one file object. To list a folder's contents instead, use the **List Repository Items** action, which Azure DevOps requires to be a separate call. Example: path `/README.md` on branch `main`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/items/get?view=azure-devops-rest-7.1)",
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
    path: {
      propDefinition: [
        azureDevops,
        "filePath",
      ],
      description: "Repository-relative path of the file to read, e.g. `/README.md`",
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
    resolveLfs: {
      type: "boolean",
      label: "Resolve LFS",
      description: "Resolve Git LFS pointer files and return the actual content stored in LFS",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.listItems({
      $,
      organization: this.organization,
      project: this.project,
      repositoryId: this.repositoryId,
      params: {
        "path": this.path,
        "includeContent": true,
        "$format": "json",
        "versionDescriptor.version": this.version,
        "versionDescriptor.versionType": this.versionType,
        "resolveLfs": this.resolveLfs,
      },
    });
    $.export("$summary", `Retrieved ${this.path} from repository ${this.repositoryId}`);
    return response;
  },
};
