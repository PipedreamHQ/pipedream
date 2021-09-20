const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-submit-review",
  name: "Submit Review",
  description: "Submit review on a pull request.",
  version: "0.0.1",
  type: "action",
  props: {
    github,
    repoFullName: {
      propDefinition: [
        github,
        "repoFullName",
      ],
    },
    pullRequest: {
      propDefinition: [
        github,
        "pullRequest",
        (c) => ({
          repoFullName: c.repoFullName,
        }),
      ],
    },
    review: {
      propDefinition: [
        github,
        "review",
        (c) => ({
          repoFullName: c.repoFullName,
          pullNumber: c.pullRequest,
        }),
      ],
    },
    body: {
      propDefinition: [
        github,
        "issueBody",
      ],
      description: "The body text of the pull request review.",
    },
    event: {
      type: "string",
      label: "Event",
      description: "The review action you want to perform. The review actions include: APPROVE, REQUEST_CHANGES, or COMMENT. When you leave this blank, the Github API returns HTTP 422 (Unrecognizable entity) and sets the review action state to PENDING, which means you will need to re-submit the pull request review using a review action.",
      options: [
        "APPROVE",
        "REQUEST_CHANGES",
        "COMMENT",
      ],
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const result = await this.github._withRetries(
      () => octokit.pulls.submitReview({
        owner: this.repoFullName.split("/")[0],
        repo: this.repoFullName.split("/")[1],
        pull_number: this.pullRequest,
        review_id: this.review,
        body: this.body,
        event: this.event,
      }),
    );
    return result.data;
  },
};
