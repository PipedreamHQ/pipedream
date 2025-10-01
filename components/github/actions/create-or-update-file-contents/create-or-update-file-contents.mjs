import github from "../../github.app.mjs";

export default {
  key: "github-create-or-update-file-contents",
  name: "Create or Update File Contents",
  description: "Create or update a file in a repository. [See the documentation](https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents)",
  version: "0.1.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      propDefinition: [
        github,
        "branch",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
      description:
        "The branch to use. Defaults to the repository's default branch (usually `main` or `master`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      github, branch, ...data
    } = this;
    const response = await github.createOrUpdateFileContent({
      ...data,
      branch: branch && branch.split("/")[1],
    });

    $.export("$summary", `Successfully set contents of ${this.path}${this.branch
      ? ` on branch ${this.branch}`
      : ""}.`);

    return response;
  },
};
