import github from "../../github.app.mjs";

export default {
  key: "github-create-pull-request",
  name: "Create Pull Request",
  description: "Open a pull request proposing to merge one branch into another within a repository. Provide the repository as an `owner/repo` string, the `head` branch (the source containing your changes) and the `base` branch (the target, e.g. `main`), plus a title. The head and base branches must already exist and differ. For a cross-fork PR, set `head` to `username:branch`. Use **Create or Update File Contents** to push changes to a branch before opening the PR. [See the documentation](https://docs.github.com/en/rest/pulls/pulls#create-a-pull-request)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
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
    head: {
      type: "string",
      label: "Head Branch",
      description: "The source branch containing the changes, e.g. `feature/new-paddock`. For a cross-fork PR, use `username:branch`.",
    },
    base: {
      type: "string",
      label: "Base Branch",
      description: "The target branch the changes will be merged into, e.g. `main`.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the pull request.",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The text description of the pull request. Supports GitHub-flavored Markdown.",
      optional: true,
    },
    draft: {
      type: "boolean",
      label: "Is Draft",
      description: "Whether to open the pull request as a [draft](https://docs.github.com/articles/about-pull-requests#draft-pull-requests).",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      title: this.title,
      head: this.head,
      base: this.base,
      body: this.body,
      draft: this.draft,
    };

    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const response = await this.github.createPullRequest({
      repoFullname,
      data,
    });

    $.export("$summary", `Successfully created pull request #${response.number}: ${response.title}`);

    return response;
  },
};
