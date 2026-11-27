import flatverify from "../../flatverify.app.mjs";
import { MAX_INLINE_PAGES } from "../../common/constants.mjs";

export default {
  key: "flatverify-get-job-results",
  name: "Get Job Results",
  description: "Get the result rows of a verification job, one page of up to 1,000 rows, or up to 10,000 rows when **Read Several Pages** is on, optionally filtered by status."
    + " Each row has `email`, `status`, `sub_status`, `reason` and the flags `disposable`, `role`, `free` and `catch_all`. Rows not checked yet have status `pending`."
    + " To continue, pass `nextAfter` from the previous output as **Start After Row**. Use **Get Job** first to see whether the job is done."
    + " [See the documentation](https://flatverify.com/docs#results)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    flatverify,
    jobId: {
      propDefinition: [
        flatverify,
        "jobId",
      ],
    },
    readSeveralPages: {
      type: "boolean",
      label: "Read Several Pages",
      description: "Set to `true` to read pages until the end of the list, up to 10,000 rows in one step. Defaults to `false`, which returns one page of up to 1,000 rows.",
      default: false,
      optional: true,
    },
    after: {
      type: "integer",
      label: "Start After Row",
      description: "The row index to continue after, e.g. `1000`. Use the `nextAfter` value from a previous **Get Job Results** output. Leave empty for the first page.",
      min: 0,
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
    const response = await this.flatverify.collectResults({
      $,
      jobId: this.jobId,
      after: this.after,
      maxPages: this.readSeveralPages
        ? MAX_INLINE_PAGES
        : 1,
      statuses: this.statuses,
    });
    $.export("$summary", `Retrieved ${response.count} result${response.count === 1
      ? ""
      : "s"} from job ${this.jobId}${response.hasMore
      ? `, more after row ${response.nextAfter}`
      : ""}`);
    return response;
  },
};
