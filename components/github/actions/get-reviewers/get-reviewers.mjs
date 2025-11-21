import github from "../../github.app.mjs";
import asyncProps from "../common/asyncProps.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "github-get-reviewers",
  name: "Get Reviewers",
  description: "Get reviewers for a PR ([see documentation](https://docs.github.com/en/rest/pulls/reviews#list-reviews-for-a-pull-request)) or Commit SHA ([see documentation](https://docs.github.com/en/rest/commits/commits#list-pull-requests-associated-with-a-commit)).",
  version: "0.1.6",
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
        "repoFullname",
      ],
    },
    prOrCommit: {
      type: "string",
      label: "PR or Commit",
      description: "Whether to get reviewers for a [pull request](https://docs.github.com/en/rest/pulls/reviews#list-reviews-for-a-pull-request) or a [commit SHA](https://docs.github.com/en/rest/commits/commits#list-pull-requests-associated-with-a-commit).",
      options: [
        "Pull Request",
        "Commit SHA",
      ],
      reloadProps: true,
    },
    reviewStates: {
      type: "string[]",
      label: "Review States",
      description: "Filter by these review states",
      options: constants.PULL_REQUEST_STATES,
      optional: true,
    },
  },
  async additionalProps() {
    return this.prOrCommit === "Pull Request"
      ? {
        pullNumber: asyncProps.pullNumber,
      }
      : {
        commitSha: {
          type: "string",
          label: "Commit SHA",
          description: "A commit SHA to get reviewers for",
        },
      };
  },
  methods: {
    getReviewers(reviews) {
      const reviewers = reviews
        .filter((review) => {
          if (this.reviewStates?.length) {
            return this.reviewStates.includes(review.state); // user-defined states
          }
          return true; // default states: all
        })
        .map((review) => review.user.login);
      return this.uniqueReviewers(reviewers);
    },
    uniqueReviewers(reviewers) {
      return [
        ...new Set(reviewers),
      ];
    },
  },
  async run({ $ }) {
    let pullNumber = this.pullNumber;

    if (this.commitSha) {
      const pr = await this.github.getPullRequestForCommit({
        repoFullname: this.repoFullname,
        sha: this.commitSha,
      });

      if (!pr?.number) {
        $.export("$summary", "No PR associated with this commit");
        return;
      }

      pullNumber = pr.number;
    }

    const reviews = await this.github.getReviewsForPullRequest({
      repoFullname: this.repoFullname,
      pullNumber,
    });

    const reviewers = this.getReviewers(reviews);

    $.export("$summary", "Successfully retrieved reviewers");

    return reviewers;
  },
};
