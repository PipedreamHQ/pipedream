import github from "../../github.app.mjs";

export default {
  key: "github-create-or-update-file-contents",
  name: "Create or Update File Contents",
  description: "Create a new file or overwrite an existing one in a repository with a single commit. Provide the repository as an `owner/repo` string, the file `path`, the raw text `content` (passed as-is — do not base64-encode it yourself), and a commit message. If the file already exists on the target branch it is overwritten; the required blob SHA is resolved for you automatically. Defaults to the repository's default branch unless `branch` is set. [See the documentation](https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents)",
  version: "1.0.0",
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
        "repoFullnameStatic",
      ],
    },
    path: {
      label: "Path",
      description: "The full path of the file, e.g. `docs/notes.md`. If the file already exists it will be overwritten.",
      type: "string",
    },
    content: {
      label: "Content",
      description: "The raw text contents of the file (plain text, not base64). If the file already exists, the entire file is overwritten with this content.",
      type: "string",
    },
    message: {
      label: "Commit Message",
      description: "The commit message for this change.",
      type: "string",
    },
    branch: {
      label: "Branch",
      description: "The branch to commit to, e.g. `main`. Defaults to the repository's default branch.",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const response = await this.github.createOrUpdateFileContent({
      repoFullname,
      path: this.path,
      fileContent: this.content,
      commitMessage: this.message,
      branch: this.branch,
    });

    $.export("$summary", `Successfully set contents of ${this.path}${this.branch
      ? ` on branch ${this.branch}`
      : ""}.`);

    return response;
  },
};
