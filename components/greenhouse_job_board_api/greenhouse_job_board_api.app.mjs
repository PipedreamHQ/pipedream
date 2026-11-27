import { axios } from "@pipedream/platform";
import {
  BASE_URL, RENDER_AS_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "greenhouse_job_board_api",
  propDefinitions: {
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The job post ID (not `internal_job_id`). Use the **List Jobs** action to find valid IDs. Example: `123456`.",
    },
    renderAs: {
      type: "string",
      label: "Render As",
      description: "How to render the hierarchy. `list` (default) returns a flat list with `child_ids`; `tree` returns nested `children`. One of: `list`, `tree`.",
      options: RENDER_AS_OPTIONS,
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Which top-level fields to return for each record, to keep responses small — large job boards return hundreds of records and the full objects can exceed the response size limit. Omit to get a compact default set (see the action's description for its defaults). Pass a list of field names to customize, or the single value `[\"all\"]` to return the complete raw objects (may be too large on big boards). Example: `[\"id\", \"title\", \"absolute_url\"]`.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of records to return. Defaults to 25. Large boards can hold hundreds or thousands of records, which would exceed the response size limit if returned all at once — the response always reports the `total_count` so you know how many exist. Raise this to see more (e.g. `100`), but very large values may again overflow the limit.",
      optional: true,
      min: 1,
    },
  },
  methods: {
    getBoardToken() {
      return this.$auth.board_token;
    },
    // Project each record down to a subset of its top-level fields. Callers pass
    // a compact `defaultFields` set; the user's `fields` prop overrides it, and
    // the sentinel ["all"] returns the untouched records.
    projectFields(items, defaultFields, fields) {
      const selected = Array.isArray(fields) && fields.length
        ? fields
        : defaultFields;
      if (selected.length === 1 && selected[0] === "all") {
        return items;
      }
      return items.map((item) => Object.fromEntries(
        selected
          .filter((f) => Object.prototype.hasOwnProperty.call(item, f))
          .map((f) => [
            f,
            item[f],
          ]),
      ));
    },
    // Cap a large list to `limit` records (default 25), project each to a compact
    // field set, and wrap it in a self-describing envelope. The `total_count` +
    // `note` make the truncation explicit to the caller — a bare page-1 array
    // would leave the agent unaware that more records exist.
    buildListResponse({
      items, key, defaultFields, fields, limit,
    }) {
      const total = items.length;
      const cap = limit ?? 25;
      const projected = this.projectFields(items.slice(0, cap), defaultFields, fields);
      const returned = projected.length;
      return {
        total_count: total,
        returned_count: returned,
        ...(returned < total && {
          note: `Showing the first ${returned} of ${total} ${key}. Pass a higher \`limit\` to see more.`,
        }),
        [key]: projected,
      };
    },
    _makeRequest({
      $ = this, path, useAuth = false, headers = {}, ...opts
    }) {
      return axios($, {
        url: `${BASE_URL}/${this.getBoardToken()}${path}`,
        ...(useAuth && {
          auth: {
            username: this.$auth.api_key,
            password: "",
          },
        }),
        headers,
        ...opts,
      });
    },
    listJobs(opts = {}) {
      return this._makeRequest({
        path: "/jobs",
        ...opts,
      });
    },
    getJob({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/jobs/${jobId}`,
        ...opts,
      });
    },
    listDepartments(opts = {}) {
      return this._makeRequest({
        path: "/departments",
        ...opts,
      });
    },
    listOffices(opts = {}) {
      return this._makeRequest({
        path: "/offices",
        ...opts,
      });
    },
    submitApplication({
      jobId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/jobs/${jobId}`,
        useAuth: true,
        ...opts,
      });
    },
  },
};
