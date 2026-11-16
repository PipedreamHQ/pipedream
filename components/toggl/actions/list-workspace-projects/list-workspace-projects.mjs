import toggl from "../../toggl.app.mjs";

const ALL_FIELDS = "all_fields";
const DEFAULT_FIELDS = [
  "name",
  "client_id",
  "active",
  "billable",
  "color",
  "start_date",
  "end_date",
  "created_at",
];
const PAGE_SIZE = 200;
const MAX_PAGES = 5;

export default {
  key: "toggl-list-workspace-projects",
  name: "List Workspace Projects",
  description: "List the projects in a Toggl Track workspace, optionally filtered by active status or a name fragment. Use it to find a project ID before calling **List Project Tasks** or **Get Project Activity**, or to answer \"what projects do we have\". To find a workspace ID, use **List Workspace ID Options**; this action does not return time entries or tracked hours (use **Get Project Activity** for those). Returns at most 1000 projects, each with `id` plus the selected fields (default: name, client_id, active, billable, color, start_date, end_date, created_at). Example: workspaceId=1234567, name=\"Website\", active=\"true\" → matching projects with id, name, client_id, active, billable. [See the documentation](https://engineering.toggl.com/docs/api/projects/#get-workspaceprojects)",
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
    active: {
      type: "string",
      label: "Active",
      description: "Which projects to list: `true` for active projects only, `false` for archived projects only, `both` for all, e.g. `true`.",
      options: [
        "true",
        "false",
        "both",
      ],
      default: "true",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Optional case-insensitive name fragment to filter projects by, e.g. `Website`.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Project fields to return besides `id`, e.g. `[\"name\", \"client_id\"]`. Defaults to name, client_id, active, billable, color, start_date, end_date and created_at. Select All Fields for the complete rows.",
      options: [
        {
          label: "Name",
          value: "name",
        },
        {
          label: "Client ID",
          value: "client_id",
        },
        {
          label: "Active",
          value: "active",
        },
        {
          label: "Billable",
          value: "billable",
        },
        {
          label: "Color",
          value: "color",
        },
        {
          label: "Start Date",
          value: "start_date",
        },
        {
          label: "End Date",
          value: "end_date",
        },
        {
          label: "Created At",
          value: "created_at",
        },
        {
          label: "Estimated Hours",
          value: "estimated_hours",
        },
        {
          label: "Private",
          value: "is_private",
        },
        {
          label: "Rate",
          value: "rate",
        },
        {
          label: "All Fields",
          value: ALL_FIELDS,
        },
      ],
      default: DEFAULT_FIELDS,
    },
  },
  async run({ $ }) {
    const fields = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    const projects = [];
    let hasMore = false;

    for (let page = 1; page <= MAX_PAGES; page++) {
      const response = await this.toggl.listWorkspaceProjects({
        workspaceId: this.workspaceId,
        params: {
          active: this.active,
          name: this.name || undefined,
          page,
          per_page: PAGE_SIZE,
        },
        $,
      });

      if (response !== null && !Array.isArray(response)) {
        throw new Error("Toggl returned an invalid projects response.");
      }

      const rows = response || [];
      projects.push(...rows);

      if (rows.length < PAGE_SIZE) break;
      if (page === MAX_PAGES) hasMore = true;
    }

    const results = fields.includes(ALL_FIELDS)
      ? projects
      : projects.map((project) => Object.fromEntries([
        "id",
        ...fields,
      ]
        .filter((field) => Object.hasOwn(project, field))
        .map((field) => [
          field,
          project[field],
        ])));

    $.export("$summary", `Found ${results.length} ${results.length === 1
      ? "project"
      : "projects"}`);

    return {
      projects: results,
      returned: results.length,
      hasMore,
    };
  },
};
