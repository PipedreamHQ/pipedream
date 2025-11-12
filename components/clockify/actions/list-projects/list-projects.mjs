import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-list-projects",
  name: "List Projects",
  description: "List all projects in a Clockify workspace. [See the documentation](https://docs.clockify.me/#tag/Project/operation/getProjects)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    clockify,
    workspaceId: {
      propDefinition: [
        clockify,
        "workspaceId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "If provided, you'll get a filtered list of projects that contains the provided string in the project name",
      optional: true,
    },
    strictNameSearch: {
      propDefinition: [
        clockify,
        "strictNameSearch",
      ],
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "If set to `true`, you'll only get archived projects",
      optional: true,
    },
    billable: {
      type: "boolean",
      label: "Billable",
      description: "If set to `true`, you'll only get billable projects",
      optional: true,
    },
    clients: {
      propDefinition: [
        clockify,
        "clientId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      type: "string[]",
      label: "Clients",
      description: "Array of client identifiers",
    },
    containsClient: {
      type: "boolean",
      label: "Contains Client",
      description: "If set to `true`, you'll get a filtered list of projects that contain clients which match the provided id(s) in 'clients' field. If set to `false`, you'll get a filtered list of projects which do NOT contain clients that match the provided id(s) in 'clients' field.",
      optional: true,
    },
    clientStatus: {
      type: "string",
      label: "Client Status",
      description: "Filters projects based on client status provided",
      optional: true,
      options: [
        "ACTIVE",
        "ARCHIVED",
        "ALL",
      ],
    },
    users: {
      propDefinition: [
        clockify,
        "memberIds",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      label: "Users",
      description: "Array of member/user identifiers",
      optional: true,
    },
    containsUser: {
      type: "boolean",
      label: "Contains User",
      description: "If set to `true`, you'll get a filtered list of projects that contain users which match the provided id(s) in 'users' field. If set to `false`, you'll get a filtered list of projects which do NOT contain users that match the provided id(s) in 'users' field.",
      optional: true,
    },
    userStatus: {
      type: "string",
      label: "User Status",
      description: "Filters projects based on user status provided",
      optional: true,
      options: [
        "PENDING",
        "ACTIVE",
        "DECLINED",
        "INACTIVE",
        "ALL",
      ],
    },
    isTemplate: {
      type: "boolean",
      label: "Is Template",
      description: "Filters projects based on whether they are used as a template or not",
      optional: true,
    },
    sortColumn: {
      type: "string",
      label: "Sort Column",
      description: "The column to sort the projects by",
      optional: true,
      options: [
        "ID",
        "NAME",
        "CLIENT_NAME",
        "DURATION",
        "BUDGET",
        "PROGRESS",
      ],
    },
    sortOrder: {
      propDefinition: [
        clockify,
        "sortOrder",
      ],
    },
    hydrated: {
      propDefinition: [
        clockify,
        "hydrated",
      ],
    },
    access: {
      type: "string",
      label: "Access",
      description: "If provided, you'll get a filtered list of projects that matches the provided access",
      optional: true,
      options: [
        "PUBLIC",
        "PRIVATE",
      ],
    },
    page: {
      propDefinition: [
        clockify,
        "page",
      ],
    },
    pageSize: {
      propDefinition: [
        clockify,
        "pageSize",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.clockify.listProjects({
      $,
      workspaceId: this.workspaceId,
      params: {
        "name": this.name,
        "strict-name-search": this.strictNameSearch,
        "archived": this.archived,
        "billable": this.billable,
        "clients": this.clients,
        "contains-client": this.containsClient,
        "client-status": this.clientStatus,
        "users": this.users,
        "contains-user": this.containsUser,
        "user-status": this.userStatus,
        "is-template": this.isTemplate,
        "sort-column": this.sortColumn,
        "sort-order": this.sortOrder,
        "hydrated": this.hydrated,
        "access": this.access,
        "page": this.page,
        "page-size": this.pageSize,
      },
    });

    $.export("$summary", `Successfully listed ${response.length} projects in the workspace`);

    return response;
  },
};
