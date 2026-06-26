import github from "../../github.app.mjs";

export default {
  key: "github-get-pull-request",
  name: "Get Pull Request",
  description: "Get the full details of a single pull request along with its reviews. Returns PR metadata (title, body, state, head/base branches, merge status, draft flag, timestamps) plus the list of reviews and a deduplicated list of reviewers with their review states (e.g. `APPROVED`, `CHANGES_REQUESTED`). Provide the repository as an `owner/repo` string and the PR number. If you only know the PR by title, call **Search Issues and Pull Requests** with `is:pr` first to resolve its number. [See the documentation](https://docs.github.com/en/rest/pulls/pulls#get-a-pull-request)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    pullNumber: {
      type: "integer",
      label: "Pull Request Number",
      description: "The pull request number — the `#N` shown in the GitHub UI.",
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const [
      pullRequest,
      reviews,
    ] = await Promise.all([
      this.github.getPullRequest({
        repoFullname,
        pullNumber: this.pullNumber,
      }),
      this.github.getReviewsForPullRequest({
        repoFullname,
        pullNumber: this.pullNumber,
      }),
    ]);

    const reviewers = [
      ...new Map(
        reviews.map((review) => [
          review.user?.login,
          {
            login: review.user?.login,
            state: review.state,
          },
        ]),
      ).values(),
    ];

    $.export("$summary", `Retrieved pull request #${this.pullNumber}: ${pullRequest.title}`);

    return {
      pullRequest,
      reviews,
      reviewers,
    };
  },
};
