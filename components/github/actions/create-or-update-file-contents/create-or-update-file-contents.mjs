import github from "../../github.app.mjs";

export default {
  key: "github-create-or-update-file-contents",
  name: "Create or update file contents",
  description: "Create or update a file in a repository. This will replace an existing file. [See docs here](https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents)",
  version: "0.0.13",
  type: "action",
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullname",
      ],
    },
    path: {
      label: "Path",
      description:
        "The full path of the file to create. *If the file already exists, it will be updated.* Example: `path/to/file.txt`",
      type: "string",
    },
    fileContent: {
      label: "File content",
      description: "The raw contents of the file. *If the file already exists, the entire file will be overwritten.*",
      type: "string",
    },
    commitMessage: {
      label: "Commit message",
      description: "The commit message for this change.",
      type: "string",
      default: "Pipedream - {{steps.trigger.context.workflow_name}} ({{steps.trigger.context.workflow_id}})",
    },
    branch: {
      label: "Branch",
      description:
        "The branch name. Defaults to the repository’s default branch (usually `master`)",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {

    const response = await this.github.createOrUpdateFileContent({
      repoFullname: this.repoFullname,
      path: this.path,
      commitMessage: this.commitMessage,
      fileContent: this.fileContent,
      branch: this.branch,
    });

    $.export("$summary", `Successfully set contents of ${this.path}${this.branch
      ? ` on branch ${this.branch}`
      : ""}.`);

    return response;
  },
};
