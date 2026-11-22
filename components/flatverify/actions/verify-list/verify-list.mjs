import { ConfigurationError } from "@pipedream/platform";
import flatverify from "../../flatverify.app.mjs";
import { MAX_INLINE_PAGES } from "../../common/constants.mjs";
import {
  sleep, splitEmails,
} from "../../common/utils.mjs";

export default {
  key: "flatverify-verify-list",
  name: "Verify List",
  description: "Start one verification job for many addresses (up to 200,000) and optionally wait for the results."
    + " When the job finishes within **Wait Seconds**, the output holds the job counts plus up to 10,000 result rows, optionally filtered by status."
    + " Otherwise it returns the job with `status` still `queued`, `running` or `waiting`: call **Get Job** until `status` is `done`, then **Get Job Results**."
    + " Up to 5 lists can run at once."
    + " [See the documentation](https://flatverify.com/docs#bulk)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    flatverify,
    emails: {
      propDefinition: [
        flatverify,
        "emails",
      ],
    },
    listName: {
      propDefinition: [
        flatverify,
        "listName",
      ],
    },
    waitSeconds: {
      type: "integer",
      label: "Wait Seconds",
      description: "How long to wait for the job to finish before returning, e.g. `20`. Use `0` to only start the job. Keep it below your workflow step timeout. Defaults to `20`.",
      min: 0,
      max: 600,
      default: 20,
      optional: true,
    },
    statuses: {
      propDefinition: [
        flatverify,
        "statuses",
      ],
    },
  },
  async run({ $ }) {
    const emails = splitEmails(this.emails);
    if (!emails.length) {
      throw new ConfigurationError("Add at least one email address.");
    }
    const started = await this.flatverify.startBulkJob({
      $,
      data: {
        emails,
        name: this.listName?.trim() || undefined,
      },
    });
    const waitSeconds = Math.max(0, Math.min(600, this.waitSeconds ?? 20));
    const deadline = Date.now() + waitSeconds * 1000;
    let job = started;
    let pause = 2000;
    while (job.status !== "done" && Date.now() < deadline) {
      await sleep(Math.min(pause, Math.max(0, deadline - Date.now())));
      job = await this.flatverify.getJob({
        $,
        jobId: started.id,
      });
      pause = Math.min(pause * 2, 15000);
    }
    const output = {
      ...job,
      skipped: started.skipped,
      results: [],
      resultsCount: 0,
      hasMoreResults: false,
      nextAfter: null,
    };
    if (job.status !== "done") {
      $.export("$summary", `Started job ${started.id} with ${started.total} addresses, status ${job.status}`);
      return output;
    }
    const collected = await this.flatverify.collectResults({
      $,
      jobId: started.id,
      maxPages: MAX_INLINE_PAGES,
      statuses: this.statuses,
    });
    $.export("$summary", `Verified ${job.total} addresses in job ${started.id}: ${job.counts?.valid ?? 0} valid, ${job.counts?.invalid ?? 0} invalid, ${job.counts?.risky ?? 0} risky, ${job.counts?.unknown ?? 0} unknown`);
    return {
      ...output,
      results: collected.results,
      resultsCount: collected.count,
      hasMoreResults: collected.hasMore,
      nextAfter: collected.nextAfter,
    };
  },
};
