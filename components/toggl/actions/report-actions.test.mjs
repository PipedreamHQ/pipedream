import assert from "node:assert/strict";
import test from "node:test";
import activityAction from "./get-project-activity/get-project-activity.mjs";
import summaryAction from "./get-time-entry-summary/get-time-entry-summary.mjs";
import tasksAction from "./list-project-tasks/list-project-tasks.mjs";
import projectsAction from "./list-workspace-projects/list-workspace-projects.mjs";
import usersAction from "./list-workspace-users/list-workspace-users.mjs";
import searchAction from "./search-detailed-time-entries/search-detailed-time-entries.mjs";

const executionContext = () => ({
  export() {},
});

const reportRow = ({
  rowNumber,
  id,
  seconds,
  billable,
}) => ({
  row_number: rowNumber,
  user_id: 1,
  billable,
  time_entries: [
    {
      id,
      seconds,
    },
  ],
});

test("detailed search continues with first_row_number only", async (context) => {
  context.mock.method(globalThis, "setTimeout", (callback) => callback());

  const requests = [];
  const pages = [
    {
      data: [
        reportRow({
          rowNumber: 1,
          id: 101,
          seconds: 60,
          billable: true,
        }),
        reportRow({
          rowNumber: 2,
          id: 102,
          seconds: 60,
          billable: false,
        }),
      ],
      headers: {
        "x-next-id": "999",
        "x-next-row-number": "3",
      },
    },
    {
      data: [
        reportRow({
          rowNumber: 3,
          id: 103,
          seconds: 60,
          billable: false,
        }),
      ],
      headers: {},
    },
  ];
  const toggl = {
    async searchDetailedTimeEntries({ data }) {
      requests.push({
        ...data,
      });
      return pages.shift();
    },
    async getDetailedTimeEntryTotals() {
      return {
        data: {
          seconds: 180,
          rates: [
            {
              billable_seconds: 60,
            },
          ],
        },
      };
    },
  };
  const action = {
    ...searchAction,
    toggl,
    workspaceId: 1,
    startDate: "2026-10-05",
    endDate: "2026-10-05",
    userIds: [
      1,
    ],
    pageSize: 2,
    maxResults: 10,
    fields: [
      "user_id",
      "seconds",
    ],
    orderBy: "date",
    orderDirection: "ASC",
  };
  const result = await searchAction.run.call(action, {
    $: executionContext(),
  });

  assert.equal(requests.length, 2);
  assert.equal(requests[1].first_row_number, 3);
  assert.equal(Object.hasOwn(requests[1], "first_id"), false);
  assert.equal(result.returnedCount, 3);
  assert.equal(result.complete, true);
  assert.equal(result.paginationValidated, true);
  assert.deepEqual(result.totals, {
    trackedSeconds: 180,
    billableSeconds: 60,
    entryCount: 3,
    entryCountExact: true,
    scope: "full_filter",
  });
});

test("summary action returns compact reconciled groups", async (context) => {
  context.mock.method(globalThis, "setTimeout", (callback) => callback());

  const toggl = {
    async searchSummaryTimeEntries() {
      return {
        data: {
          groups: [
            {
              id: 1,
              seconds: 180,
              rates: [
                {
                  billable_seconds: 60,
                },
              ],
              sub_groups: [
                {
                  ids: [
                    101,
                    102,
                    103,
                  ],
                  seconds: 180,
                },
              ],
            },
          ],
        },
      };
    },
    async getDetailedTimeEntryTotals() {
      return {
        data: {
          seconds: 180,
          rates: [
            {
              billable_seconds: 60,
            },
          ],
        },
      };
    },
    async getWorkspaceUsers() {
      return [
        {
          id: 1,
          fullname: "First User",
          email: "first@example.com",
        },
      ];
    },
  };
  const action = {
    ...summaryAction,
    toggl,
    workspaceId: 1,
    grouping: "users",
    startDate: "2026-10-05",
    endDate: "2026-10-05",
  };
  const result = await summaryAction.run.call(action, {
    $: executionContext(),
  });

  assert.equal(result.complete, true);
  assert.equal(result.groupCount, 1);
  assert.equal(result.groups[0].entryCount, 3);
  assert.equal(result.groups[0].name, "First User");
  assert.equal(Object.hasOwn(result, "report"), false);
  assert.equal(Object.hasOwn(result, "providerTotals"), false);
  assert.deepEqual(result.totals, {
    trackedSeconds: 180,
    billableSeconds: 60,
    entryCount: 3,
    entryCountExact: true,
  });
});

test("project activity resolves a project and returns exact descriptions", async () => {
  const toggl = {
    async getProjects() {
      return [
        {
          id: 10,
          name: "Lexamica",
          client_id: 20,
          client_name: "Lexamica",
          active: true,
        },
      ];
    },
    async searchDetailedTimeEntries() {
      return {
        data: [
          {
            row_number: 1,
            user_id: 1,
            username: "First User",
            project_id: 10,
            project_name: "Lexamica",
            task_id: 30,
            task_name: "Client update",
            description: "Drafted discovery responses",
            billable: true,
            time_entries: [
              {
                id: 101,
                start: "2026-10-05T09:00:00-05:00",
                stop: "2026-10-05T10:00:00-05:00",
                seconds: 3600,
              },
            ],
          },
        ],
        headers: {},
      };
    },
    async getDetailedTimeEntryTotals() {
      return {
        data: {
          seconds: 3600,
          rates: [
            {
              billable_seconds: 3600,
            },
          ],
        },
      };
    },
  };
  const action = {
    ...activityAction,
    toggl,
    workspaceId: 1,
    projectNames: [
      " ",
      "Lexamica",
    ],
    userNames: [
      "",
    ],
    taskNames: [
      " ",
    ],
    startDate: "2026-10-05",
    endDate: "2026-10-05",
    descriptionMatch: "contains",
    responseMode: "activity_digest",
    bucketBy: "none",
    includeEntryIds: false,
    maxApiRequests: 4,
  };
  const result = await activityAction.run.call(action, {
    $: executionContext(),
  });

  assert.equal(result.complete, true);
  assert.equal(result.returnedCount, 1);
  assert.equal(result.activities[0].description, "Drafted discovery responses");
  assert.equal(result.activities[0].projectName, "Lexamica");
  assert.equal(result.verification.totalsMatchProvider, true);
  assert.equal(result.totals.trackedSeconds, 3600);
});

test("project activity continuation preserves progress and filters descriptions locally", async () => {
  const requests = [];
  const toggl = {
    async getProjects() {
      return [
        {
          id: 10,
          name: "Internal Finance",
          active: true,
        },
      ];
    },
    async searchDetailedTimeEntries({ data }) {
      requests.push({
        ...data,
      });
      if (!data.first_row_number) {
        return {
          data: [
            {
              row_number: 1,
              user_id: 1,
              username: "First User",
              project_id: 10,
              project_name: "Internal Finance",
              description: "Prepared monthly finance report",
              billable: false,
              time_entries: [
                {
                  id: 101,
                  start: "2026-01-05T09:00:00Z",
                  stop: "2026-01-05T09:01:00Z",
                  seconds: 60,
                },
              ],
            },
          ],
          headers: {
            "x-next-id": "102",
            "x-next-row-number": "2",
          },
        };
      }

      return {
        data: [
          {
            row_number: 2,
            user_id: 1,
            username: "First User",
            project_id: 10,
            project_name: "Internal Finance",
            description: "Team planning",
            billable: false,
            time_entries: [
              {
                id: 102,
                start: "2026-01-06T09:00:00Z",
                stop: "2026-01-06T09:02:00Z",
                seconds: 120,
              },
            ],
          },
        ],
        headers: {},
      };
    },
    async getDetailedTimeEntryTotals() {
      return {
        data: {
          seconds: 180,
          rates: [],
        },
      };
    },
  };
  const baseAction = {
    ...activityAction,
    toggl,
    workspaceId: 1,
    projectNames: [
      "Internal Finance",
    ],
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    descriptionQuery: "finance",
    descriptionMatch: "contains",
    responseMode: "activity_digest",
    bucketBy: "month",
    includeEntryIds: false,
    maxApiRequests: 1,
  };
  const first = await activityAction.run.call(baseAction, {
    $: executionContext(),
  });
  const second = await activityAction.run.call({
    ...baseAction,
    continuation: first.continuation,
  }, {
    $: executionContext(),
  });

  assert.equal(first.complete, false);
  assert.equal(first.returnedCount, 1);
  assert.equal(second.complete, true);
  assert.equal(second.returnedCount, 0);
  assert.equal(second.progress.sourceEntryCount, 2);
  assert.equal(second.totals.entryCount, 1);
  assert.equal(second.totals.trackedSeconds, 60);
  assert.equal(second.verification.sourceTotalsMatchProvider, true);
  assert.equal(second.verification.totalsMatchProvider, null);
  assert.equal(second.verification.returnedTotalsExact, true);
  assert.equal(requests[1].first_row_number, 2);
  assert.equal(Object.hasOwn(requests[1], "first_id"), false);
  assert.equal(Object.hasOwn(requests[0], "description"), false);
  await assert.rejects(activityAction.run.call({
    ...baseAction,
    continuation: {
      ...first.continuation,
      progress: {
        ...first.continuation.progress,
        matchedEntryCount: 999,
      },
    },
  }, {
    $: executionContext(),
  }), /integrity check/);
});

test("workspace projects and project tasks return compact validated resources", async () => {
  const projects = await projectsAction.run.call({
    ...projectsAction,
    toggl: {
      async getProjects() {
        return [
          {
            id: 10,
            name: "Lexamica",
            client_id: 20,
            client_name: "Lexamica",
            active: true,
          },
        ];
      },
    },
    workspaceId: 1,
    query: "lex",
    status: "both",
  }, {
    $: executionContext(),
  });
  const tasks = await tasksAction.run.call({
    ...tasksAction,
    toggl: {
      async getProjects() {
        return [
          {
            id: 10,
            name: "Lexamica",
            active: true,
          },
        ];
      },
      async getProjectTasks() {
        return {
          items: [
            {
              id: 30,
              name: "Client update",
              project_id: 10,
              active: true,
            },
          ],
        };
      },
    },
    workspaceId: 1,
    projectName: "Lexamica",
    activeOnly: false,
  }, {
    $: executionContext(),
  });

  assert.equal(projects.complete, true);
  assert.equal(projects.projects[0].projectId, 10);
  assert.equal(tasks.complete, true);
  assert.equal(tasks.tasks[0].taskName, "Client update");
});

test("project tasks reject ambiguous project names and accept an exact project ID", async () => {
  const projects = [
    {
      id: 10,
      name: "CFO Services",
      client_name: "First Client",
      active: true,
    },
    {
      id: 20,
      name: "CFO Services",
      client_name: "Second Client",
      active: true,
    },
  ];
  const toggl = {
    async getProjects() {
      return projects;
    },
    async getProjectTasks({ projectId }) {
      assert.equal(projectId, 20);
      return [
        {
          id: 30,
          name: "Financial Process Improvement",
          project_id: 20,
          active: true,
        },
      ];
    },
  };

  await assert.rejects(tasksAction.run.call({
    ...tasksAction,
    toggl,
    workspaceId: 1,
    projectName: "CFO Services",
    activeOnly: false,
  }, {
    $: executionContext(),
  }), /Project Name is ambiguous/);

  const result = await tasksAction.run.call({
    ...tasksAction,
    toggl,
    workspaceId: 1,
    projectId: 20,
    query: "Financial Process",
    activeOnly: false,
  }, {
    $: executionContext(),
  });

  assert.equal(result.complete, true);
  assert.equal(result.returnedCount, 1);
  assert.equal(result.tasks[0].projectId, 20);
});

test("workspace users action returns authoritative counts and role metadata", async () => {
  const action = {
    ...usersAction,
    toggl: {
      async getWorkspaceUsers() {
        return [
          {
            id: 1,
            fullname: "First User",
            email: "first@example.com",
            role: "admin",
            is_active: true,
            inactive: false,
            is_admin: true,
          },
          {
            id: 2,
            fullname: "Second User",
            email: "second@example.com",
            role: "member",
            is_active: true,
            inactive: false,
            is_admin: false,
          },
        ];
      },
    },
    workspaceId: 1,
  };
  const result = await usersAction.run.call(action, {
    $: executionContext(),
  });

  assert.equal(result.returnedCount, 2);
  assert.equal(result.uniqueUserCount, 2);
  assert.equal(result.complete, true);
  assert.deepEqual(result.users[0], {
    userId: 1,
    name: "First User",
    email: "first@example.com",
    role: "admin",
    isActive: true,
    inactive: false,
    isAdmin: true,
  });
});
