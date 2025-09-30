import visualping from "../../app/visualping.app.mjs";

export default {
  key: "visualping-find-jobs",
  name: "Find Jobs",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Find existing jobs using filters. [See the docs here](https://develop.api.visualping.io/doc.html#tag/Jobs/paths/~1v2~1jobs/get)",
  type: "action",
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
    mode: {
      type: "string",
      label: "Mode",
      description: "API output mode",
      options: [
        {
          label: "Counts Only",
          value: "counts_only",
        },
        {
          label: "Id And WsIds",
          value: "id_and_wsIds",
        },
        {
          label: "Ids Only",
          value: "ids_only",
        },
        {
          label: "Normal",
          value: "normal",
        },
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
        "1hr",
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
  },
  async run({ $ }) {
    const {
      visualping,
      activeFilter,
      inProgressFilter,
      hasAdvancedScheduleFilter,
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
      },
    });

    for await (const item of items) {
      response.push(item);
    }

    const length = response.length;

    $.export("$summary", `${length} job${length > 1
      ? "s were"
      : " was"} successfully fetched!`);
    return response;
  },
};
