import github from "../../github.app.mjs";

export default {
  key: "github-get-pull-request",
  name: "Get Pull Request",
  description: "Get the full details of a single pull request along with its reviews and a CI/merge readiness summary. Returns PR metadata (title, body, state, head/base branches, draft flag, timestamps), the `mergeable`/`mergeable_state` flags, a `checksSummary` rollup of CI status for the head commit (combined commit status + check runs, summarized to an overall state and pass/fail counts), the list of reviews, and a deduplicated list of reviewers with their review states (e.g. `APPROVED`, `CHANGES_REQUESTED`). Use this to answer \"can I merge this?\" and \"is CI green?\" before calling **Merge Pull Request**. Provide the repository as an `owner/repo` string and the PR number. If you only know the PR by title, call **Search Issues and Pull Requests** with `is:pr` first to resolve its number. [See the documentation](https://docs.github.com/en/rest/pulls/pulls#get-a-pull-request)",
  version: "0.1.0",
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
      propDefinition: [
        github,
        "pullNumberStatic",
      ],
    },
  },
  methods: {
    summarizeChecks(combinedStatus, checkRuns) {
      // Combined commit status (legacy statuses API)
      const statuses = combinedStatus?.statuses ?? [];
      // Check runs (GitHub Actions / Checks API)
      const runs = checkRuns?.check_runs ?? [];

      const counts = {
        success: 0,
        failure: 0,
        pending: 0,
      };

      for (const status of statuses) {
        if (status.state === "success") counts.success += 1;
        else if (status.state === "failure" || status.state === "error") counts.failure += 1;
        else counts.pending += 1;
      }

      for (const run of runs) {
        if (run.status !== "completed") {
          counts.pending += 1;
        } else if ([
          "success",
          "neutral",
          "skipped",
        ].includes(run.conclusion)) {
          counts.success += 1;
        } else if ([
          "failure",
          "timed_out",
          "cancelled",
          "action_required",
          "stale",
        ].includes(run.conclusion)) {
          counts.failure += 1;
        } else {
          counts.pending += 1;
        }
      }

      let state = "no_checks";
      if (counts.failure > 0) state = "failure";
      else if (counts.pending > 0) state = "pending";
      else if (counts.success > 0) state = "success";

      return {
        state,
        total: counts.success + counts.failure + counts.pending,
        ...counts,
      };
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const pullRequest = await this.github.getPullRequest({
      repoFullname,
      pullNumber: this.pullNumber,
    });

    const headSha = pullRequest.head?.sha;
    const [
      reviews,
      combinedStatus,
      checkRuns,
    ] = await Promise.all([
      this.github.getReviewsForPullRequest({
        repoFullname,
        pullNumber: this.pullNumber,
      }),
      headSha
        ? this.github.getCommitStatus({
          repoFullname,
          ref: headSha,
        })
        : null,
      headSha
        ? this.github.getCheckRunsForRef({
          repoFullname,
          ref: headSha,
        })
        : null,
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

    const checksSummary = this.summarizeChecks(combinedStatus, checkRuns);

    $.export("$summary", `Retrieved pull request #${this.pullNumber}: ${pullRequest.title} (mergeable: ${pullRequest.mergeable ?? "unknown"}, checks: ${checksSummary.state})`);

    return {
      pullRequest,
      mergeable: pullRequest.mergeable,
      mergeable_state: pullRequest.mergeable_state,
      checksSummary,
      reviews,
      reviewers,
    };
  },
};
