import { ConfigurationError } from "@pipedream/platform";
import toggl from "../../toggl.app.mjs";
import {
  getNextCursor,
  mapProjectTasks,
  mapWorkspaceProjects,
  parseCursorInput,
  parseProviderTotals,
  resolveDateRange,
  resolveWorkspaceProject,
  resolveWorkspaceUser,
  unwrapItems,
} from "../../common/utils.mjs";
import {
  buildProjectActivityOutput,
  flattenDetailedRows,
  getQuerySignature,
  matchesDescription,
} from "../../common/activity-utils.mjs";
import { validateDetailedPage } from "../../common/report-utils.mjs";

const PAGE_SIZE = 50;

const parseContinuation = (value) => {
  if (!value) return null;

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      throw new ConfigurationError("Continuation must be the object returned by a previous project activity call.");
    }
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    throw new ConfigurationError("Continuation must be the object returned by a previous project activity call.");
  }

  return value;
};

const emptyProgress = () => ({
  sourceEntryCount: 0,
  sourceTrackedSeconds: 0,
  sourceBillableSeconds: 0,
  matchedEntryCount: 0,
  matchedTrackedSeconds: 0,
  matchedBillableSeconds: 0,
  reportRowCount: 0,
  blankDescriptionCount: 0,
});

const validateProgress = (value) => {
  const progress = {
    ...emptyProgress(),
    ...value,
  };

  for (const [
    key,
    number,
  ] of Object.entries(progress)) {
    if (!Number.isSafeInteger(number) || number < 0) {
      throw new ConfigurationError(`Continuation contains an invalid ${key} value.`);
    }
  }

  return progress;
};

const sortNumbers = (values, label) => {
  const numbers = (values || []).map(Number);

  if (numbers.some((value) => !Number.isSafeInteger(value) || value < 1)) {
    throw new ConfigurationError(`${label} must contain only positive integer IDs.`);
  }

  return [
    ...new Set(numbers),
  ].sort((a, b) => a - b);
};

const nonBlankStrings = (values) => (values || [])
  .map((value) => String(value).trim())
  .filter(Boolean);

const resolveTaskNames = (tasks, names) => {
  const resolved = [];

  for (const name of names || []) {
    const normalizedName = name.trim().toLowerCase();
    const candidates = tasks.filter((task) => task.name
      .trim()
      .toLowerCase()
      .includes(normalizedName));
    const exactMatches = candidates.filter((task) => (
      task.name.trim().toLowerCase() === normalizedName
    ));
    const matches = exactMatches.length
      ? exactMatches
      : candidates;

    if (!matches.length) {
      throw new ConfigurationError(`No task in the selected projects matched "${name}".`);
    }

    if (!exactMatches.length && matches.length > 1) {
      const choices = matches
        .slice(0, 10)
        .map((task) => `${task.name} (${task.id})`)
        .join(", ");
      throw new ConfigurationError(`Task Name is ambiguous. Use an exact name or Task ID. Matches: ${choices}`);
    }

    resolved.push(...matches);
  }

  return [
    ...new Map(resolved.map((task) => [
      task.id,
      task,
    ])).values(),
  ];
};

export default {
  key: "toggl-get-project-activity",
  name: "Get Project Activity",
  description: "Retrieve complete, description-rich Toggl Track activity for one or more projects. Resolve project, person, and task names safely; validate pagination against Toggl totals; and return either compact exact-description activity groups or normalized individual entries. Use this for weekly client updates and historical project analysis. Continue calling with the returned Continuation until `complete` is true before presenting a final answer. Results follow the connected user's Toggl permissions. [See the documentation](https://engineering.toggl.com/docs/track/reports/detailed_reports/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    toggl,
    workspaceId: {
      propDefinition: [
        toggl,
        "workspaceId",
      ],
    },
    projectIds: {
      type: "integer[]",
      label: "Project IDs",
      description: "Project IDs to include. Project Names can be used instead or combined with these IDs.",
      optional: true,
    },
    projectNames: {
      type: "string[]",
      label: "Project Names",
      description: "Exact or uniquely matching project names, e.g. `[\"Lexamica\", \"HelloPrenup\"]`. Names are resolved internally and never guessed when ambiguous.",
      optional: true,
    },
    datePreset: {
      propDefinition: [
        toggl,
        "reportDatePreset",
      ],
    },
    startDate: {
      propDefinition: [
        toggl,
        "reportStartDate",
      ],
    },
    endDate: {
      propDefinition: [
        toggl,
        "reportEndDate",
      ],
    },
    timezone: {
      propDefinition: [
        toggl,
        "reportTimezone",
      ],
    },
    userIds: {
      propDefinition: [
        toggl,
        "reportUserIds",
      ],
    },
    userNames: {
      type: "string[]",
      label: "User Names or Emails",
      description: "Optional user names or emails. Every value must resolve to exactly one accessible workspace user.",
      optional: true,
    },
    taskIds: {
      propDefinition: [
        toggl,
        "reportTaskIds",
      ],
    },
    taskNames: {
      type: "string[]",
      label: "Task Names",
      description: "Optional task names resolved within the selected projects. Exact matches with the same name across selected projects are all included.",
      optional: true,
    },
    descriptionQuery: {
      type: "string",
      label: "Description Query",
      description: "Optional deterministic filter applied to the exact time-entry descriptions after all project entries are retrieved.",
      optional: true,
    },
    descriptionMatch: {
      type: "string",
      label: "Description Match",
      description: "How Description Query is matched. Matching is case-insensitive and whitespace-normalized.",
      options: [
        "contains",
        "exact",
        "all_terms",
      ],
      default: "contains",
    },
    billable: {
      propDefinition: [
        toggl,
        "reportBillable",
      ],
    },
    responseMode: {
      type: "string",
      label: "Response Mode",
      description: "Activity Digest mechanically groups identical descriptions for a compact Claude-ready response. Individual Entries returns one normalized record per source entry.",
      options: [
        {
          label: "Activity Digest",
          value: "activity_digest",
        },
        {
          label: "Individual Entries",
          value: "individual_entries",
        },
      ],
      default: "activity_digest",
    },
    bucketBy: {
      type: "string",
      label: "Historical Bucket",
      description: "Optionally keep otherwise identical activity groups separate by calendar week or month.",
      options: [
        "none",
        "week",
        "month",
      ],
      default: "none",
    },
    includeEntryIds: {
      type: "boolean",
      label: "Include Evidence Entry IDs",
      description: "Include source time-entry IDs in activity digest groups for auditing. Leave disabled for the smallest response.",
      default: false,
    },
    maxApiRequests: {
      type: "integer",
      label: "Maximum API Pages Per Call",
      description: "Limits each tool response to control execution time and Claude context size. Each page contains up to 50 report rows. If more data remains, call again with Continuation.",
      min: 1,
      max: 10,
      default: 2,
    },
    continuation: {
      type: "object",
      label: "Continuation",
      description: "The exact Continuation object returned by a previous Get Project Activity call. Keep every other filter unchanged.",
      optional: true,
    },
  },
  async run({ $ }) {
    let profile;

    if (this.datePreset) {
      profile = await this.toggl.getMe({
        $,
      });

      if (!profile || typeof profile !== "object") {
        throw new Error("Toggl returned an invalid user profile response.");
      }
    }

    const dateRange = resolveDateRange({
      startDate: this.startDate,
      endDate: this.endDate,
      datePreset: this.datePreset,
      timezone: this.timezone || profile?.timezone || "UTC",
      weekStart: profile?.beginning_of_week ?? 1,
    });
    const projectsResponse = await this.toggl.getProjects({
      workspaceId: this.workspaceId,
      params: {
        active: "both",
      },
      $,
    });
    const rawProjects = unwrapItems(projectsResponse, "workspace projects");
    const allProjects = mapWorkspaceProjects(rawProjects);
    const projectsById = new Map(allProjects.map((project) => [
      project.id,
      project,
    ]));
    const selectedProjects = new Map();

    for (const id of sortNumbers(this.projectIds, "Project IDs")) {
      const project = projectsById.get(id);
      if (!project) {
        throw new ConfigurationError(`Project ID ${id} is not accessible in workspace ${this.workspaceId}.`);
      }
      selectedProjects.set(id, project);
    }

    for (const name of nonBlankStrings(this.projectNames)) {
      const project = resolveWorkspaceProject(rawProjects, name);
      selectedProjects.set(project.id, project);
    }

    if (!selectedProjects.size) {
      throw new ConfigurationError("At least one Project ID or Project Name is required.");
    }

    const users = [];
    const selectedUserIds = new Set(sortNumbers(this.userIds, "User IDs"));

    const requestedUserNames = nonBlankStrings(this.userNames);

    if (requestedUserNames.length) {
      const workspaceUsers = await this.toggl.getWorkspaceUsers({
        workspaceId: this.workspaceId,
        $,
      });

      if (!Array.isArray(workspaceUsers)) {
        throw new Error("Toggl returned an invalid workspace users response.");
      }

      for (const name of requestedUserNames) {
        const user = resolveWorkspaceUser(workspaceUsers, name);
        users.push(user);
        selectedUserIds.add(user.userId);
      }
    }

    const requestedTaskIds = sortNumbers(this.taskIds, "Task IDs");
    const selectedTasks = new Map();

    const requestedTaskNames = nonBlankStrings(this.taskNames);

    if (requestedTaskIds.length || requestedTaskNames.length) {
      const taskResponses = [];

      for (const project of selectedProjects.values()) {
        const response = await this.toggl.getProjectTasks({
          workspaceId: this.workspaceId,
          projectId: project.id,
          $,
        });

        taskResponses.push(unwrapItems(response, "project tasks").map((task) => ({
          ...task,
          project_id: task.project_id ?? project.id,
        })));
      }
      const allTasks = mapProjectTasks(taskResponses.flat());
      const tasksById = new Map(allTasks.map((task) => [
        task.id,
        task,
      ]));

      for (const id of requestedTaskIds) {
        const task = tasksById.get(id);

        if (!task) {
          throw new ConfigurationError(`Task ID ${id} does not belong to an accessible selected project.`);
        }

        selectedTasks.set(id, task);
      }

      for (const task of resolveTaskNames(allTasks, requestedTaskNames)) {
        selectedTasks.set(task.id, task);
      }
    }

    const resolvedProjects = [
      ...selectedProjects.values(),
    ].sort((a, b) => a.id - b.id);
    const resolvedTasks = [
      ...selectedTasks.values(),
    ].sort((a, b) => a.id - b.id);
    const baseFilters = {
      start_date: dateRange.startDate,
      end_date: dateRange.endDate,
      project_ids: resolvedProjects.map((project) => project.id),
      user_ids: selectedUserIds.size
        ? [
          ...selectedUserIds,
        ].sort((a, b) => a - b)
        : undefined,
      task_ids: selectedTasks.size
        ? resolvedTasks.map((task) => task.id)
        : undefined,
      billable: this.billable,
      rounding: 0,
      rounding_minutes: 0,
    };
    const queryIdentity = {
      workspaceId: Number(this.workspaceId),
      dateRange,
      projectIds: baseFilters.project_ids,
      userIds: baseFilters.user_ids || [],
      taskIds: baseFilters.task_ids || [],
      billable: this.billable ?? null,
      descriptionQuery: this.descriptionQuery?.trim() || null,
      descriptionMatch: this.descriptionMatch,
      responseMode: this.responseMode,
      bucketBy: this.bucketBy,
      includeEntryIds: this.includeEntryIds,
    };
    const querySignature = getQuerySignature(queryIdentity);
    const continuation = parseContinuation(this.continuation);

    if (continuation) {
      const {
        integrity,
        ...continuationPayload
      } = continuation;

      if (!integrity || integrity !== getQuerySignature(continuationPayload)) {
        throw new ConfigurationError("Continuation failed its integrity check. Use the exact object returned by the previous call.");
      }
    }

    if (continuation && !continuation.querySignature) {
      throw new ConfigurationError("Continuation is missing its query signature. Use the exact object returned by the previous call.");
    }

    if (
      continuation?.querySignature !== undefined
      && continuation.querySignature !== querySignature
    ) {
      throw new ConfigurationError("Continuation does not match the current project activity filters. Keep all filters unchanged or start without Continuation.");
    }

    if (continuation && !continuation.cursor) {
      throw new ConfigurationError("Continuation is missing its report cursor. Use the exact object returned by the previous call.");
    }

    const initialCursor = parseCursorInput(continuation?.cursor);
    const progress = validateProgress(continuation?.progress);
    const segmentIndex = Number(continuation?.segmentIndex ?? 0);

    if (!Number.isSafeInteger(segmentIndex) || segmentIndex < 0) {
      throw new ConfigurationError("Continuation contains an invalid segment index.");
    }

    const seenEntryIds = new Set((continuation?.lastEntryIds || []).map(String));
    const data = {
      ...baseFilters,
      page_size: PAGE_SIZE,
      order_by: "date",
      order_dir: "ASC",
      enrich_response: true,
      grouped: false,
      first_row_number: initialCursor?.firstRowNumber,
    };
    const segmentEntries = [];
    let sourceSegmentEntryCount = 0;
    let sourceSegmentTrackedSeconds = 0;
    let sourceSegmentBillableSeconds = 0;
    let expectedFirstRowNumber = initialCursor?.firstRowNumber ?? 1;
    let nextCursor = null;
    let lastPageEntryIds = [];
    let requestCount = 0;

    do {
      const response = await this.toggl.searchDetailedTimeEntries({
        workspaceId: this.workspaceId,
        data,
        $,
      });
      const page = response?.data;
      const pageStats = validateDetailedPage({
        page,
        expectedFirstRowNumber,
        seenEntryIds,
      });
      const normalizedEntries = flattenDetailedRows(page, {
        projects: resolvedProjects,
        users,
        userIds: [
          ...selectedUserIds,
        ],
        tasks: resolvedTasks,
      });
      const matchedEntries = normalizedEntries.filter((entry) => matchesDescription(
        entry.description,
        this.descriptionQuery,
        this.descriptionMatch,
      ));

      segmentEntries.push(...matchedEntries);
      sourceSegmentEntryCount += pageStats.entryCount;
      sourceSegmentTrackedSeconds += pageStats.trackedSeconds;
      sourceSegmentBillableSeconds += pageStats.billableSeconds;
      progress.reportRowCount += pageStats.reportRowCount;
      progress.sourceEntryCount += pageStats.entryCount;
      progress.sourceTrackedSeconds += pageStats.trackedSeconds;
      progress.sourceBillableSeconds += pageStats.billableSeconds;
      progress.matchedEntryCount += matchedEntries.length;
      progress.matchedTrackedSeconds += matchedEntries.reduce(
        (sum, entry) => sum + entry.seconds,
        0,
      );
      progress.matchedBillableSeconds += matchedEntries.reduce(
        (sum, entry) => sum + (entry.billable
          ? entry.seconds
          : 0),
        0,
      );
      progress.blankDescriptionCount += matchedEntries.filter(
        (entry) => !entry.description?.trim(),
      ).length;
      expectedFirstRowNumber = pageStats.nextExpectedRowNumber;
      nextCursor = getNextCursor(response.headers);
      lastPageEntryIds = normalizedEntries.map((entry) => entry.entryId);
      requestCount++;

      if (!page.length && nextCursor) {
        throw new Error("Toggl returned an empty project activity page with a continuation cursor.");
      }

      if (nextCursor && Number(nextCursor.firstRowNumber) !== expectedFirstRowNumber) {
        throw new Error(`Toggl returned a non-contiguous project activity cursor. Expected row ${expectedFirstRowNumber}, received ${nextCursor.firstRowNumber}.`);
      }

      if (nextCursor && requestCount < this.maxApiRequests) {
        data.first_row_number = parseCursorInput(nextCursor).firstRowNumber;
      }
    } while (nextCursor && requestCount < this.maxApiRequests);

    const totalsResponse = await this.toggl.getDetailedTimeEntryTotals({
      workspaceId: this.workspaceId,
      data: baseFilters,
      $,
    });
    const providerTotals = parseProviderTotals(totalsResponse?.data);
    const complete = !nextCursor;

    if (complete && (
      progress.sourceTrackedSeconds !== providerTotals.trackedSeconds
      || progress.sourceBillableSeconds !== providerTotals.billableSeconds
    )) {
      throw new Error(`Project activity did not reconcile with Toggl totals. Retrieved: ${progress.sourceTrackedSeconds} tracked / ${progress.sourceBillableSeconds} billable seconds; Toggl totals: ${providerTotals.trackedSeconds} tracked / ${providerTotals.billableSeconds} billable seconds.`);
    }

    const {
      blankDescriptionCount: segmentBlankDescriptionCount,
      ...activityOutput
    } = buildProjectActivityOutput({
      entries: segmentEntries,
      responseMode: this.responseMode,
      bucketBy: this.bucketBy,
      includeEntryIds: this.includeEntryIds,
    });
    const continuationPayload = nextCursor
      ? {
        querySignature,
        cursor: nextCursor,
        segmentIndex: segmentIndex + 1,
        progress,
        lastEntryIds: lastPageEntryIds,
      }
      : null;
    const result = {
      query: {
        workspaceId: Number(this.workspaceId),
        projects: resolvedProjects.map((project) => ({
          projectId: project.id,
          projectName: project.name,
          clientId: project.clientId,
          clientName: project.clientName,
        })),
        users,
        tasks: resolvedTasks.map((task) => ({
          taskId: task.id,
          taskName: task.name,
          projectId: task.projectId,
        })),
        dateRange,
        descriptionQuery: this.descriptionQuery ?? null,
        descriptionMatch: this.descriptionQuery
          ? this.descriptionMatch
          : null,
        billable: this.billable ?? null,
        responseMode: this.responseMode,
        bucketBy: this.bucketBy,
      },
      segmentIndex,
      complete,
      incompleteReasons: complete
        ? []
        : [
          "context_budget",
        ],
      returnedCount: segmentEntries.length,
      sourceReturnedCount: sourceSegmentEntryCount,
      sourceSegmentTotals: {
        trackedSeconds: sourceSegmentTrackedSeconds,
        billableSeconds: sourceSegmentBillableSeconds,
      },
      progress,
      totals: {
        trackedSeconds: progress.matchedTrackedSeconds,
        billableSeconds: progress.matchedBillableSeconds,
        entryCount: progress.matchedEntryCount,
        entryCountExact: complete,
        scope: complete
          ? "full_filter"
          : "processed_prefix",
      },
      verification: {
        paginationValidated: true,
        duplicateEntryCount: 0,
        providerTrackedSeconds: providerTotals.trackedSeconds,
        providerBillableSeconds: providerTotals.billableSeconds,
        sourceTotalsMatchProvider: complete
          ? true
          : null,
        totalsMatchProvider: complete && !this.descriptionQuery
          ? true
          : null,
        returnedTotalsExact: complete,
      },
      dataQuality: {
        blankDescriptionCount: progress.blankDescriptionCount,
        segmentBlankDescriptionCount,
      },
      ...activityOutput,
      ...continuationPayload && {
        continuation: {
          ...continuationPayload,
          integrity: getQuerySignature(continuationPayload),
        },
      },
    };

    $.export("$summary", complete
      ? `Retrieved and verified ${progress.matchedEntryCount} matching project time ${progress.matchedEntryCount === 1
        ? "entry"
        : "entries"}`
      : `Retrieved project activity segment ${segmentIndex + 1}; continue before presenting a final answer`);

    return result;
  },
};
