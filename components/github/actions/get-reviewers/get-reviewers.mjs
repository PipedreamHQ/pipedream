import github from "../../github.app.mjs";
import constants from "../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "github-get-reviewers",
  name: "Get Reviewers",
  description: "Get reviewers for a PR ([see docs](https://docs.github.com/en/rest/pulls/reviews#list-reviews-for-a-pull-request)) or Commit SHA ([see docs](https://docs.github.com/en/rest/commits/commits#list-pull-requests-associated-with-a-commit)).",
  version: "0.0.17",
  type: "action",
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullname",
      ],
    },
    pullNumber: {
      propDefinition: [
        github,
        "pullNumber",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
      optional: true,
    },
    commitSha: {
      type: "string",
      label: "Commit SHA",
      description: "A commit SHA. This field will have precendence over **PR Number**",
      optional: true,
    },
    reviewStates: {
      type: "string[]",
      label: "Review States",
      description: "Filter by these review states. Default includes `APPROVED` and `CHANGES_REQUESTED` only",
      options: constants.PULL_REQUEST_STATES,
      optional: true,
    },
  },
  methods: {
    getReviewers(reviews) {
      const reviewers = reviews
        .filter((review) => {
          if (this.reviewStates?.length) {
            return this.reviewStates.includes(review.state); // user-defined states
          }
          return [
            "APPROVED",
            "CHANGES_REQUESTED",
          ].includes(review.state); // default states
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
    if (!(this.pullNumber || this.commitSha)) {
      throw new ConfigurationError("Please provide a **PR Number** or a **Commit SHA**");
    }

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

    $.export("$summary", "Successfully retrieved reviewers.");

    return reviewers;
  },
};
