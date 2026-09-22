import visualping from "../../visualping.app.mjs";
import {
  DEFAULT_JOB_FIELDS, normalizeJob, pluckFields,
} from "../../common/utils.mjs";

export default {
  key: "visualping-find-jobs",
  name: "Find Jobs",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Searches and lists your Visualping monitoring jobs, with optional filters"
    + " for mode, active/paused state, change-detection frequency, and free text."
    + " Use this to discover job ids before calling **Get Job Details By Id**,"
    + " **Update Job**, or **Delete Job**, or to answer questions like \"which jobs"
    + " are still active\" or \"find the job monitoring example.com\"."
    + " Auto-paginates through the API's 100-jobs-per-page results, up to a cap of"
    + " 20 pages (2,000 jobs) — plenty for typical accounts."
    + " Example: to find active jobs mentioning \"pricing\", call with"
    + " `fullTextSearchFilter=\"pricing\"` and `activeFilter=true` → returns matching"
    + " job records with id, url, mode, interval, trigger, active, and more."
    + " Pass `fields` to shrink each result to just the fields you need."
    + " [See the docs here](https://develop.api.visualping.io/doc.html#tag/Jobs/paths/~1v2~1jobs/get)",
  type: "action",
  ai: "optimized",
  props: {
    visualping,
    organisationId: {
      propDefinition: [
        visualping,
        "organisationId",
      ],
      optional: true,
    },
    workspaceId: {
      propDefinition: [
        visualping,
        "workspaceId",
      ],
      optional: true,
    },
    activeFilter: {
      type: "boolean",
      label: "Active Filter",
      description: "Filters for active or inactive (paused) jobs.",
      optional: true,
    },
    inProgressFilter: {
      type: "boolean",
      label: "In Progress Filter",
      description: "Filters for jobs that are currently checking the web page.",
      optional: true,
    },
    modeFilter: {
      type: "string[]",
      label: "Mode Filter",
      description: "Filters jobs by mode. Multiple choices are allowed.",
      options: [
        {
          label: "Visual",
          value: "VISUAL",
        },
        {
          label: "Web",
          value: "WEB",
        },
        {
          label: "text",
          value: "TEXT",
        },
      ],
      optional: true,
    },
    frequencyFilter: {
      type: "string[]",
      label: "Frequency Filter",
      description: "Filters jobs by scheduling frequency. Multiple choices allowed.",
      options: [
        "below_1h_excl",
        "1h",
        "1h_excl_to_1d_excl",
        "1d",
        "1d_excl_to_500h_excl",
        "above_500h_incl",
      ],
      optional: true,
    },
    hasAdvancedScheduleFilter: {
      type: "boolean",
      label: "Has Advanced Schedule Filter",
      description: "Filters jobs by presence of an advanced schedule.",
      optional: true,
    },
    changedFilter: {
      type: "string",
      label: "Changed Filter",
      description: "Filters jobs by the presence of a detected change.",
      options: [
        {
          label: "Before Custom Date",
          value: "before_custom_date",
        },
        {
          label: "Between Custom Dates",
          value: "between_custom_dates",
        },
        {
          label: "Since Custom Date",
          value: "since_custom_date",
        },
        {
          label: "Since Last Login",
          value: "since_last_login",
        },
        {
          label: "Since Last Month",
          value: "since_last_month",
        },
        {
          label: "Since Last Week",
          value: "since_last_week",
        },
        {
          label: "Since Yesterday",
          value: "since_yesterday",
        },
      ],
      optional: true,
    },
    changedFilterDateMin: {
      type: "string",
      label: "Changed Filter Date Min",
      description: "Necessary if `changedFilter` expects a lower bound timestamp.",
      optional: true,
    },
    changedFilterDateMax: {
      type: "string",
      label: "Changed Filter Date Max",
      description: "Necessary if `changedFilter` expects an upper bound timestamp.",
      optional: true,
    },
    fullTextSearchFilter: {
      type: "string",
      label: "Full Text Search Filter",
      description: "Filters jobs by the presence of a given substring in their URLs or descriptions.",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "For internal use.",
      options: [
        {
          label: "Active First",
          value: "active_first",
        },
        {
          label: "Alphabetical Asc",
          value: "alphabetical_asc",
        },
        {
          label: "Alphabetical Desc",
          value: "alphabetical_desc",
        },
        {
          label: "Created Asc",
          value: "created_asc",
        },
        {
          label: "Created Desc",
          value: "created_desc",
        },
        {
          label: "Frequency Asc",
          value: "frequency_asc",
        },
        {
          label: "Frequency Desc",
          value: "frequency_desc",
        },
        {
          label: "Id Asc",
          value: "id_asc",
        },
        {
          label: "Id Desc",
          value: "id_desc",
        },
        {
          label: "Inactive First",
          value: "inactive_first",
        },
        {
          label: "Last Diff Detected Asc",
          value: "last_diff_detected_asc",
        },
        {
          label: "Last Diff Detected Desc",
          value: "last_diff_detected_desc",
        },
        {
          label: "Lastrun Asc",
          value: "lastrun_asc",
        },
        {
          label: "Lastrun Desc",
          value: "lastrun_desc",
        },
      ],
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      optional: true,
      description: "Field names to return for each job (`id` is always included)."
        + " Omit to get the full job object (today's default output)."
        + " A useful compact set: `" + DEFAULT_JOB_FIELDS.join("`, `") + "`."
        + " Pass only the fields you need — smaller responses keep the conversation fast.",
    },
  },
  async run({ $ }) {
    const {
      visualping,
      activeFilter,
      inProgressFilter,
      hasAdvancedScheduleFilter,
      modeFilter,
      frequencyFilter,
      fields,
      ...params
    } = this;

    const response = [];

    const items = visualping.paginate({
      fn: visualping.findJobs,
      params: {
        ...params,
        activeFilter: (activeFilter != undefined)
          ? +activeFilter
          : null,
        inProgressFilter: (inProgressFilter != undefined)
          ? +inProgressFilter
          : null,
        hasAdvancedScheduleFilter: (hasAdvancedScheduleFilter != undefined)
          ? +hasAdvancedScheduleFilter
          : null,
        // The API rejects axios's default array query-param encoding for these
        // ("unexpected flat parameter ... construct") — send a comma-joined
        // string instead, which it does accept.
        modeFilter: modeFilter?.length
          ? modeFilter.join(",")
          : undefined,
        frequencyFilter: frequencyFilter?.length
          ? frequencyFilter.join(",")
          : undefined,
      },
    });

    for await (const item of items) {
      response.push(normalizeJob(item));
    }

    const results = fields?.length
      ? response.map((job) => pluckFields(job, fields))
      : response;

    const length = results.length;

    $.export("$summary", `${length} job${length > 1
      ? "s were"
      : " was"} successfully fetched!`);
    return results;
  },
};
