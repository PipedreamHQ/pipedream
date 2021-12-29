import { axios } from "@pipedream/platform";
import querystring from "querystring";
import resourceTypes from "./resource-types.mjs";
import { v4 }  from "uuid";
const uuid = v4;

export default {
  type: "app",
  app: "todoist",
  propDefinitions: {
    includeResourceTypes: {
      type: "string[]",
      label: "Resource Types",
      description: "Select one or more resources to include",
      async options() {
        resourceTypes.unshift("all");
        return resourceTypes;
      },
    },
    selectProjects: {
      type: "integer[]",
      label: "Select Projects",
      description:
        "Filter for events that match one or more projects. Leave this blank to emit results for any project.",
      optional: true,
      async options() {
        return (await this.getProjects({})).map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    project: {
      type: "integer",
      label: "Project",
      description: "Select a project to filter results by",
      optional: true,
      async options() {
        return (await this.getProjects({})).map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    section: {
      type: "integer",
      label: "Section",
      description: "Select a section to filter results by",
      optional: true,
      async options({ project }) {
        return (await this.getSections({
          params: {
            project_id: project,
          },
        })).map((section) => ({
          label: section.name,
          value: section.id,
        }));
      },
    },
    label: {
      type: "integer",
      label: "Label",
      description: "Select a label to filter results by",
      optional: true,
      async options() {
        return (await this.getLabels({})).map((label) => ({
          label: label.name,
          value: label.id,
        }));
      },
    },
    task: {
      type: "integer",
      label: "Task",
      description: "Select a task to filter results by",
      async options({
        project, section,
      }) {
        return (await this.getActiveTasks({
          params: {
            project_id: project,
            section_id: section,
          },
        })).map((task) => ({
          label: task.content,
          value: task.id,
        }));
      },
    },
    assignee: {
      type: "integer",
      label: "Assignees",
      description: "The responsible user (if set, and only for shared tasks)",
      async options({ project }) {
        return (await this.getProjectCollaborators(project)).map((assignee) => ({
          label: assignee.name,
          value: assignee.id,
        }));
      },
      optional: true,
    },
    filter: {
      type: "integer",
      label: "Filter",
      description: "Select the filter to update",
      async options() {
        return (await this.getFilters({})).map((filter) => ({
          label: filter.name,
          value: filter.id,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Enter the new name",
    },
    sectionId: {
      type: "integer",
      label: "Section ID",
      description: "Enter a section ID",
    },
    commentId: {
      type: "integer",
      label: "Comment ID",
      description: "Enter a comment ID",
    },
    order: {
      type: "integer",
      label: "Order",
      description: "Order in a list",
      optional: true,
    },
    color: {
      type: "integer",
      label: "Color",
      description: "A numeric ID representing a color. Refer to the id column in the [Colors](https://developer.todoist.com/guides/#colors) guide for more info.",
      optional: true,
    },
    favorite: {
      type: "boolean",
      label: "Favorite",
      description: "Whether this is a favorite",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "The query to search for. [Examples of searches](https://todoist.com/help/articles/introduction-to-filters) can be found in the Todoist help page.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "Comment content",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Task description",
      optional: true,
    },
    priority: {
      type: "integer",
      label: "Priority",
      description: "Task priority from 1 (normal) to 4 (urgent)",
      optional: true,
    },
    dueString: {
      type: "string",
      label: "Due String",
      description: "[Human defined](https://todoist.com/help/articles/205325931) task due date (ex.: \"next Monday\", \"Tomorrow\"). Value is set using local (not UTC) time.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Specific date in `YYYY-MM-DD` format relative to user’s timezone",
      optional: true,
    },
    dueDatetime: {
      type: "string",
      label: "Due Datetime",
      description: "Specific date and time in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) format in UTC.",
      optional: true,
    },
    dueLang: {
      type: "string",
      label: "Due Language",
      description: "2-letter code specifying language in case `due_string` is not written in English",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email Address",
    },
    createIfNotFound: {
      type: "boolean",
      label: "Create If Not Found",
      description: "Create this item if it is not found",
      default: false,
    },
    path: {
      type: "string",
      label: "File Path",
      description: "Path to .csv file containing task names",
    },
  },
  methods: {
    /**
     * Make a request to Todoist's sync API.
     * @params {Object} opts - An object representing the configuration options for this method
     * @params {String} opts.path [opts.path=/sync/v8/sync] - The path for the sync request
     * @params {String} opts.payload - The data to send in the API request at the POST body.
     * This data will converted to `application/x-www-form-urlencoded`
     * @returns {Object} When the request succeeds, an HTTP 200 response will be returned with
     * a JSON object containing the requested resources and also a new `sync_token`.
     */
    async _makeSyncRequest(opts) {
      const {
        $,
        path = "/sync/v8/sync",
      } = opts;
      delete opts.path;
      delete opts.$;
      opts.url = `https://api.todoist.com${path[0] === "/"
        ? ""
        : "/"}${path}`;
      opts.payload.token = this.$auth.oauth_access_token;
      opts.data = querystring.stringify(opts.payload);
      delete opts.payload;
      return axios($ ?? this, opts);
    },
    /**
     * Make a request to Todoist's REST API.
     * @params {Object} opts - An object representing the Axios configuration options
     * for this method
     * @params {String} opts.path - The path for the REST API request
     * @returns {*} The response may vary depending the specific API request.
     */
    async _makeRestRequest(opts) {
      const {
        $,
        path,
      } = opts;
      delete opts.path;
      delete opts.$;
      opts.url = `https://api.todoist.com/rest/v1${path[0] === "/"
        ? ""
        : "/"}${path}`;
      opts.headers = {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
      return axios($ ?? this, opts);
    },
    /**
     * Get syncToken from a db
     * @params {Object} db - a database instance
     * @returns {*} Returns what is stored as "syncToken" in the db specified
     */
    _getSyncToken(db) {
      return db.get("syncToken");
    },
    /**
     * Set the syncToken in a db
     * @params {Object} db - a database instance
     * @syncToken {*} - The data to be stored as "syncToken" in the db specified
     */
    _setSyncToken(db, syncToken) {
      db.set("syncToken", syncToken);
    },
    /**
     * Check whether an array of project IDs contains the given proejct ID. This method is
     * used in multiple sources to validate if an event matches the selection in the project filter.
     * @params {Integer} project_id - The ID for a Todoist project
     * @params {Array} selectedProjectIds - An array of Todoist project IDs
     * @returns {Boolean} Returns `true` if the `project_id` matches a value in the arrar or
     * if the array is empty. Otherwise returns `false`.
     */
    isProjectInList(projectId, selectedProjectIds) {
      return (
        selectedProjectIds.length === 0 ||
        selectedProjectIds.includes(projectId)
      );
    },
    /**
     * Public method to make a sync request.
     * @params {Object} opts - The configuration for an axios request with a `path` key.
     * @returns {Object} When the request succeeds, an HTTP 200 response will be returned
     * with a JSON object containing the requested resources and also a new `sync_token`.
     */
    async sync({
      $, opts,
    }) {
      return this._makeSyncRequest({
        $,
        path: "/sync/v8/sync",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        payload: opts,
      });
    },
    /**
     * Get project by ID or get all projects if no ID specified
     * @params id {Integer} A project ID
     * @returns {Array} Returns a JSON-encoded array containing a project object related to
     * the given ID or all user projects if no ID specified
     */
    async getProjects({
      $, id = "",
    }) {
      return this._makeRestRequest({
        $,
        path: `/projects/${id}`,
        method: "GET",
      });
    },
    /**
     * Create a new project
     * @params data {Object} object containing info about the new project being created
     * @returns {Object} Returns the created project as a JSON object
     */
    async createProject({
      $, data = {},
    }) {
      return this._makeRestRequest({
        $,
        path: "/projects",
        method: "POST",
        data,
      });
    },
    /**
     * Update a project
     * @params data {Object} object containing the projectId
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async updateProject({
      $, data = {},
    }) {
      const { projectId } = data;
      delete data.projectId;
      return this._makeRestRequest({
        $,
        path: `/projects/${projectId}`,
        method: "POST",
        data,
      });
    },
    /**
     * Delete a project
     * @params data {Object} object containing the projectId
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async deleteProject({
      $, data = {},
    }) {
      const { projectId } = data;
      return this._makeRestRequest({
        $,
        path: `/projects/${projectId}`,
        method: "DELETE",
      });
    },
    /**
     * Invite a user to join a project
     * @params data {Object} object containing the project ID and user's email
     * @returns {Object} Returns object including sync_token
     */
    async shareProject({
      $, data = {},
    }) {
      const commands = [
        {
          type: "share_project",
          temp_id: uuid(),
          uuid: uuid(),
          args: data,
        },
      ];
      return this.sync({
        $,
        opts: {
          commands: JSON.stringify(commands),
        },
      });
    },
    /**
     * Get collaborators of a shared project
     * @params projectId {Integer} ID of a project
     * @returns {Object} Returns JSON-encoded array containing all collaborators of a shared project
     */
    async getProjectCollaborators(projectId) {
      if (!projectId) {
        return [];
      }
      return this._makeRestRequest({
        path: `/projects/${projectId}/collaborators`,
        method: "GET",
      });
    },
    /**
     * Get section by ID or get a list of all sections in a project in no ID is specified
     * @params params {Object} object containing section_id and/or project_id
     * @returns {Array} Returns a JSON-encoded array containing a section object related to
     * the given ID or a list of sections if no ID specified
     */
    async getSections({
      $, params = {},
    }) {
      const { section_id: id = "" } = params;
      delete params.section_id;
      return this._makeRestRequest({
        $,
        path: `/sections/${id}`,
        method: "GET",
        params,
      });
    },
    /**
     * Create a new section
     * @params data {Object} object containing info about the new section being created
     * @returns {Object} Returns the created section as a JSON object
     */
    async createSection({
      $, data = {},
    }) {
      return this._makeRestRequest({
        $,
        path: "/sections",
        method: "POST",
        data,
      });
    },
    /**
     * Update a section
     * @params data {Object} object containing the sectionId and updated name
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async updateSection({
      $, data = {},
    }) {
      const { sectionId } = data;
      delete data.sectionId;
      return this._makeRestRequest({
        $,
        path: `/sections/${sectionId}`,
        method: "POST",
        data,
      });
    },
    /**
     * Delete a section
     * @params data {Object} object containing the sectionId
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async deleteSection({
      $, data = {},
    }) {
      const { sectionId } = data;
      return this._makeRestRequest({
        $,
        path: `/sections/${sectionId}`,
        method: "DELETE",
      });
    },
    /**
     * Get label by ID or get all labels if no ID specified
     * @params id {Integer} A label ID
     * @returns {Array} Returns a JSON-encoded array containing a label object related to
     * the given ID or all user labels if no ID specified
     */
    async getLabels({
      $, id = "",
    }) {
      return this._makeRestRequest({
        $,
        path: `/labels/${id}`,
        method: "GET",
      });
    },
    /**
     * Create a new label
     * @params data {Object} object containing info about the new label being created
     * @returns {Object} Returns the created label as a JSON object
     */
    async createLabel({
      $, data = {},
    }) {
      return this._makeRestRequest({
        $,
        path: "/labels",
        method: "POST",
        data,
      });
    },
    /**
     * Update a label
     * @params data {Object} object containing id & info about the label being updated
     * @returns {Object} Returns the created label as a JSON object
     */
    async updateLabel({
      $, data = {},
    }) {
      const { labelId } = data;
      delete data.labelId;
      return this._makeRestRequest({
        $,
        path: `/labels/${labelId}`,
        method: "POST",
        data,
      });
    },
    /**
     * Delete a label
     * @params data {Object} object containing the labelId
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async deleteLabel({
      $, data = {},
    }) {
      const { labelId } = data;
      return this._makeRestRequest({
        $,
        path: `/labels/${labelId}`,
        method: "DELETE",
      });
    },
    /**
     * Get a comment by ID or get a list of comments in a project or task if no ID is specified
     * @params params {Object} object containing one or more of comment_id, project_id or task_id
     * @returns {Array} Returns a JSON-encoded array containing comments
     */
    async getComments({
      $, params = {},
    }) {
      const { comment_id: id = "" } = params;
      delete params.comment_id;
      return this._makeRestRequest({
        $,
        path: `/comments/${id}`,
        method: "GET",
        params,
      });
    },
    /**
     * Create a new comment in a task or project
     * @params data {Object} object containing info about the new comment being created
     * @returns {Object} Returns the created comment as a JSON object
     */
    async createComment({
      $, data = {},
    }) {
      return this._makeRestRequest({
        $,
        path: "/comments",
        method: "POST",
        data,
      });
    },
    /**
     * Update a comment in a task or project
     * @params data {Object} object containing the commentId and new comment content
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async updateComment({
      $, data = {},
    }) {
      const { commentId } = data;
      delete data.commentId;
      return this._makeRestRequest({
        $,
        path: `/comments/${commentId}`,
        method: "POST",
        data,
      });
    },
    /**
     * Delete a comment in a task or project
     * @params data {Object} object containing the commentId
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async deleteComment({
      $, data = {},
    }) {
      const { commentId } = data;
      return this._makeRestRequest({
        $,
        path: `/comments/${commentId}`,
        method: "DELETE",
      });
    },
    /**
     * Get task by ID or get a list of all active tasks in a project if no ID is specified
     * @params params {Object} object containing one or more of task_id, project_id,
     * section_id, and/or label_id
     * @returns {Array} Returns a JSON-encoded array containing a task object related to
     * the given ID or a list of tasks if no ID is specified
     */
    async getActiveTasks({
      $, params = {},
    }) {
      const { task_id: id = "" } = params;
      delete params.task_id;
      return this._makeRestRequest({
        $,
        path: `/tasks/${id}`,
        method: "GET",
        params,
      });
    },
    /**
     * Create a new task
     * @params data {Object} object containing info about the new task being created
     * @returns {Object} Returns the created task as a JSON object
     */
    async createTask({
      $, data = {},
    }) {
      return this._makeRestRequest({
        $,
        path: "/tasks",
        method: "POST",
        data,
      });
    },
    /**
     * Update a task
     * @params data {Object} object containing info about the task being updated
     * @returns {Object} Returns the updated task as a JSON object
     */
    async updateTask({
      $, data = {},
    }) {
      const { taskId } = data;
      delete data.taskId;
      return this._makeRestRequest({
        $,
        path: `/tasks/${taskId}`,
        method: "POST",
        data,
      });
    },
    /**
     * Mark a task as closed/completed by the task id
     * @params params {Object} object containing a taskId
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async closeTask({
      $, params = {},
    }) {
      const { taskId } = params;
      return this._makeRestRequest({
        $,
        path: `tasks/${taskId}/close`,
        method: "POST",
      });
    },
    /**
     * Reopen/uncomplete a task by the task id
     * @params params {Object} object containing a taskId
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async reopenTask({
      $, params = {},
    }) {
      const { taskId } = params;
      return this._makeRestRequest({
        $,
        path: `tasks/${taskId}/reopen`,
        method: "POST",
      });
    },
    /**
     * Delete a task by the task id
     * @params params {Object} object containing a taskId
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async deleteTask({
      $, data = {},
    }) {
      const { taskId } = data;
      return this._makeRestRequest({
        $,
        path: `tasks/${taskId}`,
        method: "DELETE",
      });
    },
    /**
     * Move a task to a different section
     * @params params {Object} object containing a task id and section_id
     * @returns {Object} Object containing the sync_status
     */
    async moveTask({
      $, data = {},
    }) {
      const commands = [
        {
          type: "item_move",
          uuid: uuid(),
          args: data,
        },
      ];
      return this.sync({
        $,
        opts: {
          commands: JSON.stringify(commands),
        },
      });
    },
    /**
     * Get a list of new tasks/items
     * @params db {Object} a database instance
     * @returns {Object} Object containing new tasks
     */
    async syncItems(db) {
      return this.syncResources(db, [
        "items",
      ]);
    },
    /**
     * Get a list of new projects
     * @params db {Object} a database instance
     * @returns {Object} Object containing new projects
     */
    async syncProjects(db) {
      return this.syncResources(db, [
        "projects",
      ]);
    },
    /**
     * Get a list of new sections
     * @params db {Object} a database instance
     * @returns {Object} Object containing new sections
     */
    async syncSections(db) {
      return this.syncResources(db, [
        "sections",
      ]);
    },
    /**
     * Get a list of collaborators
     * @params db {Object} a database instance
     * @returns {Object} Object containing new collaborators
     */
    async syncCollaborators(db = null) {
      return this.syncResources(db, [
        "collaborators",
      ]);
    },
    /**
     * Get a list of new sections
     * @params db {Object} a database instance
     * @returns {Object} Object containing filters
     */
    async getFilters({
      $, db,
    }) {
      if (db) {
        this._setSyncToken(db, "*");
      }
      return (await this.syncResources(db, [
        "filters",
      ], $)).filters;
    },
    /**
     * Create a new filter
     * @params data {Object} object containing info about the new filter being created
     * @returns {Object} Returns object including sync_token
     */
    async createFilter({
      $, data = {},
    }) {
      const commands = [
        {
          type: "filter_add",
          temp_id: uuid(),
          uuid: uuid(),
          args: data,
        },
      ];
      return this.sync({
        $,
        opts: {
          commands: JSON.stringify(commands),
        },
      });
    },
    /**
     * Update filter
     * @params data {Object} object containing info about the new filter being updated
     * @returns {Object} Returns object including sync_token
     */
    async updateFilter({
      $, data = {},
    }) {
      const commands = [
        {
          type: "filter_update",
          uuid: uuid(),
          args: data,
        },
      ];
      return this.sync({
        $,
        opts: {
          commands: JSON.stringify(commands),
        },
      });
    },
    /**
     * Delete filter
     * @params data {Object} object containing a filter ID
     * @returns {Object} Returns object including sync_token
     */
    async deleteFilter({
      $, data = {},
    }) {
      const commands = [
        {
          type: "filter_delete",
          uuid: uuid(),
          args: data,
        },
      ];
      return this.sync({
        $,
        opts: {
          commands: JSON.stringify(commands),
        },
      });
    },
    /**
     * @params db {Object} a database instance
     * @params resourceTypes {Array} an array of strings representing
     * resource_types to retrieve updates for
     * @returns {Object} Object with one or more arrays containing new
     * resources created since the last syncToken
    */
    async syncResources(db, resourceTypes, $ = null) {
      const syncToken = db
        ? this._getSyncToken(db) || "*"
        : "*";
      const result = await this.sync({
        $,
        opts: {
          resource_types: JSON.stringify(resourceTypes),
          sync_token: syncToken,
        },
      });
      if (db) {
        this._setSyncToken(db, result.sync_token);
      }
      return result;
    },
  },
};
