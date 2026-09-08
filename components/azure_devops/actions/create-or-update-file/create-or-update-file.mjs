import { ConfigurationError } from "@pipedream/platform";
import azureDevops from "../../azure_devops.app.mjs";
import {
  CONTENT_TYPE_OPTIONS, FILE_CHANGE_TYPE_OPTIONS,
} from "../../common/constants.mjs";

export default {
  key: "azure_devops-create-or-update-file",
  name: "Create Or Update File",
  description: "Push a single file add, edit or delete to an existing branch, as one commit. Returns the push result including the new commit SHA. The branch must already exist. Use this to commit generated config or docs back to a repository. Example: edit `/docs/README.md` on `main` with commit message `Update setup steps`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pushes/create?view=azure-devops-rest-7.1)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
    repositoryId: {
      propDefinition: [
        azureDevops,
        "repositoryId",
      ],
    },
    branchName: {
      propDefinition: [
        azureDevops,
        "branchName",
      ],
      description: "Branch to push to, without the `refs/heads/` prefix, e.g. `main`. The branch must already exist. Run the **List Branches And Tags** action first to obtain valid values.",
    },
    changeType: {
      type: "string",
      label: "Change Type",
      description: "What to do with the file",
      options: FILE_CHANGE_TYPE_OPTIONS,
      default: "edit",
    },
    path: {
      propDefinition: [
        azureDevops,
        "filePath",
      ],
      description: "Repository-relative path of the file, e.g. `/docs/README.md`",
    },
    content: {
      propDefinition: [
        azureDevops,
        "content",
      ],
      description: "New content of the file. Required unless **Change Type** is `delete`.",
      optional: true,
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "How **Content** is encoded. Defaults to `rawtext`.",
      options: CONTENT_TYPE_OPTIONS,
      default: "rawtext",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Commit Message",
      description: "Message for the commit this push creates",
    },
  },
  async run({ $ }) {
    if (this.changeType !== "delete" && !this.content) {
      throw new ConfigurationError("**Content** is required unless **Change Type** is `delete`.");
    }
    const refName = this.branchName.startsWith("refs/")
      ? this.branchName
      : `refs/heads/${this.branchName}`;
    const { value: refs } = await this.azureDevops.listRefs({
      $,
      organization: this.organization,
      project: this.project,
      repositoryId: this.repositoryId,
      params: {
        filter: refName.replace("refs/", ""),
      },
    });
    const ref = refs?.find(({ name }) => name === refName);
    if (!ref) {
      throw new ConfigurationError(`Branch ${refName} was not found in repository ${this.repositoryId}.`);
    }

    const response = await this.azureDevops.createPush({
      $,
      organization: this.organization,
      project: this.project,
      repositoryId: this.repositoryId,
      data: {
        refUpdates: [
          {
            name: refName,
            oldObjectId: ref.objectId,
          },
        ],
        commits: [
          {
            comment: this.comment,
            changes: [
              {
                changeType: this.changeType,
                item: {
                  path: this.path,
                },
                newContent: this.changeType === "delete"
                  ? undefined
                  : {
                    content: this.content,
                    contentType: this.contentType,
                  },
              },
            ],
          },
        ],
      },
    });
    $.export("$summary", `Pushed ${this.changeType} of ${this.path} to ${refName} (commit ${response.commits?.[0]?.commitId})`);
    return response;
  },
};
