import katto from "../../katto.app.mjs";

export default {
  key: "katto-list-jobs",
  name: "List Jobs",
  description:
    "List your clip jobs, newest first, following pagination. [See the documentation](https://katto.tech/docs/api)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    katto,
    status: {
      type: "string",
      label: "Status",
      description:
        "Optional. Only return jobs with this status (e.g. `completed`, `processing`, `failed`, `queued`).",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description:
        "Maximum number of jobs to return across pages. The action follows `next_cursor` until this many are collected (or there are no more).",
      optional: true,
      default: 100,
    },
  },
  async run({ $ }) {
    const max = this.maxResults && this.maxResults > 0
      ? this.maxResults
      : 100;
    const results = [];
    let cursor;

    while (results.length < max) {
      const resp = await this.katto.listJobs({
        $,
        params: {
          limit: Math.min(100, max - results.length),
          cursor,
          status: this.status,
        },
      });
      const jobs = Array.isArray(resp)
        ? resp
        : (resp.jobs ?? resp.data ?? []);
      results.push(...jobs);
      const next = Array.isArray(resp) ? null : resp.next_cursor;
      if (!next || jobs.length === 0) {
        break;
      }
      cursor = next;
    }

    const out = results.slice(0, max);
    $.export("$summary", `Retrieved ${out.length} job(s)`);
    return out;
  },
};
