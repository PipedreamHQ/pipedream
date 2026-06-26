import github from "../../github.app.mjs";

export default {
  key: "github-create-pull-request-review",
  name: "Create Pull Request Review",
  description: "Submit a review on a pull request: approve it, request changes, or leave a general comment. Set `event` to `APPROVE`, `REQUEST_CHANGES`, or `COMMENT` — a `body` is required for `REQUEST_CHANGES` and `COMMENT`. Optionally attach inline `comments` tied to specific lines of the diff. GitHub forbids approving your own pull request, so use `COMMENT` to leave feedback on PRs you authored. Provide the repository as an `owner/repo` string and the PR number. Use **Get Pull Request Files** to find the file paths and lines to comment on, and **Search Issues and Pull Requests** with `is:pr` to resolve the PR number from a title. [See the documentation](https://docs.github.com/en/rest/pulls/reviews#create-a-review-for-a-pull-request)",
  version: "0.0.1",
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
    pullNumber: {
      propDefinition: [
        github,
        "pullNumberStatic",
      ],
    },
    event: {
      type: "string",
      label: "Event",
      description: "The review action to perform. `APPROVE` and `REQUEST_CHANGES` formally affect the PR's review state; `COMMENT` leaves general feedback without approving or blocking.",
      options: [
        "APPROVE",
        "REQUEST_CHANGES",
        "COMMENT",
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "The body text of the review. Required when `event` is `REQUEST_CHANGES` or `COMMENT`. Supports GitHub-flavored Markdown.",
      optional: true,
    },
    comments: {
      type: "string",
      label: "Inline Comments",
      description: "Optional JSON array of inline review comments tied to lines in the diff. Each entry is `{\"path\": \"...\", \"line\": N, \"body\": \"...\"}`, e.g. `[{\"path\": \"paddocks/trex.md\", \"line\": 3, \"body\": \"Check the voltage here\"}]`. Use **Get Pull Request Files** to find valid paths and line numbers.",
      optional: true,
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const comments = typeof this.comments === "string"
      ? JSON.parse(this.comments)
      : this.comments;

    const data = {
      event: this.event,
      body: this.body,
      ...(comments?.length && {
        comments,
      }),
    };

    const response = await this.github.createPullRequestReview({
      repoFullname,
      pullNumber: this.pullNumber,
      data,
    });

    $.export("$summary", `Submitted ${this.event} review on pull request #${this.pullNumber}`);

    return response;
  },
};
