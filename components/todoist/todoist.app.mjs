import { axios } from "@pipedream/platform";
import querystring from "query-string";
import resourceTypes from "./common/resource-types.mjs";
import colors, { numericToString } from "./common/colors.mjs";
import { v4 as uuid } from "uuid";

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
      type: "string[]",
      label: "Select Projects",
      description:
        "Filter for events that match one or more projects. Leave this blank to emit results for any project.",
      optional: true,
      async options() {
        const { results } = await this.getProjects({});
        return results?.map((project) => ({
          label: project.name,
          value: project.id,
        })) || [];
      },
    },
    project: {
      type: "string",
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
      type: "string",
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
      type: "string",
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
    labelString: {
      type: "string[]",
      label: "Labels",
      description: "Select labels to add to the task.",
      optional: true,
      async options() {
        return (await this.getLabels({})).map((label) => label.name);
      },
    },
    task: {
      type: "string",
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
    completedTask: {
      type: "string",
      label: "Completed Task",
      description: "Select the task to reopen",
      async options({
        project, prevContext,
      }) {
        const { cursor } = prevContext;
        const limit = 30;
        const params = {
          limit,
        };
        if (cursor) {
          params.cursor = cursor;
        }
        if (project) {
          params.project_id = project;
        }
        const response = await this.getCompletedTasks({
          params,
        });
        const tasks = response.items.map((task) => ({
          label: task.content,
          value: task.id,
        }));
        return {
          options: tasks,
          context: {
            cursor: response.next_cursor,
          },
        };
      },
    },
    assignee: {
      type: "string",
      label: "Assignee",
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
      type: "string",
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
    commentId: {
      type: "string",
      label: "Comment ID",
      description: "Select a comment",
      async options({
        project, task,
      }) {
        if (!project && !task) {
          return [];
        }
        return (await this.getComments({
          params: {
            project_id: project,
            task_id: task,
          },
        })).map((comment) => ({
          label: comment.content,
          value: comment.id,
        }));
      },
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
      description: "A numeric ID representing a color (automatically converted to v1 API format). Refer to the id column in the [Colors](https://developer.todoist.com/guides/#colors) guide for more info.",
      options: colors,
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
      label: "File Path or URL",
      description: "The .csv file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.csv`)",
    },
  },
  methods: {
    /**
     * Make a request to Todoist's sync API.
     * @params {Object} opts - An object representing the configuration options for this method
     * @params {String} [opts.path=/sync/v9/sync] - The path for the sync request
     * @params {String} opts.payload - The data to send in the API request at the POST body.
     * This data will converted to `application/x-www-form-urlencoded`
     * @returns {Object} When the request succeeds, an HTTP 200 response with
     * a JSON object containing the requested resources and also a new `sync_token`.
     */
    async _makeSyncRequest(opts) {
      const {
        $,
        path = "/api/v1/sync",
      } = opts;
      delete opts.path;
      delete opts.$;
      opts.url = `https://api.todoist.com${path[0] === "/"
        ? ""
        : "/"}${path}`;
      opts.payload.token = this.$auth.oauth_access_token;
      opts.data = querystring.stringify(opts.payload);
      delete opts.payload;
      opts.headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
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
      opts.url = `https://api.todoist.com/api/v1${path[0] === "/"
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
     * @returns {*} "syncToken" in the db specified
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
     * Check whether an array of project IDs contains the given project ID. This method is
     * used in multiple sources to validate if an event matches the selection in the project filter.
     * @params {Integer} project_id - The ID for a Todoist project
     * @params {Array} selectedProjectIds - An array of Todoist project IDs
     * @returns {Boolean} `true` if the `project_id` matches a value in the arrar or
     * if the array is empty. Otherwise `false`.
     */
    isProjectInList(projectId, selectedProjectIds) {
      return (
        selectedProjectIds.length === 0 ||
        selectedProjectIds.map((pId) => pId.toString()).includes(projectId)
      );
    },
    /**
     * Public method to make a sync request.
     * @params {Object} opts - The configuration for an axios request with a `path` key.
     * @returns {Object} When the request succeeds, an HTTP 200 response
     * with a JSON object containing the requested resources and also a new `sync_token`.
     */
    async sync({
      $, opts,
    }) {
      return this._makeSyncRequest({
        $,
        path: "/api/v1/sync",
        method: "POST",
        payload: opts,
      });
    },
    /**
     * Breaks sync commands into batches of no more than 100
     * @params {Array} commands - An array of sync commands
     * @returns {Array} An array of batches (arrays) of commands
     */
    _makeBatches(commands) {
      const BATCH_SIZE = 100;
      let batches = [];
      for (let i = 0; i < commands.length; i += BATCH_SIZE) {
        batches.push(commands.slice(i, i + BATCH_SIZE));
      }
      return batches;
    },
    /**
     * Processes sync commands in batches
     * @params {Object} opts - An object representing configuration options for this method
     * @returns {Array} A collection of responses, one for each batch of commands
     */
    async batchSync({
      $, opts,
    }) {
      const { commands } = opts;
      const batches = this._makeBatches(commands);
      return Promise.all(batches.map((batch) => {
        return this.sync({
          $,
          opts: {
            ...opts,
            commands: JSON.stringify(batch),
          },
        });
      }));
    },
    /**
     * Get project by ID or get all projects if no ID specified
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Integer} [opts.id = ""] - A project ID
     * @returns {Object|Array} A project object related to the given ID or all user projects
     * if no ID specified
     */
    async getProjects(opts) {
      const {
        $,
        id = "",
      } = opts;
      return this._makeRestRequest({
        $,
        path: id
          ? `/projects/${id}`
          : "/projects",
        method: "GET",
      });
    },
    /**
     * Create a new project
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing info about the new project
     * being created
     * @returns {Object} The created project as a JSON object
     */
    async createProject(opts) {
      const {
        $,
        data = {},
      } = opts;
      // Transform numeric color to string for v1 API
      if (data.color && typeof data.color === "number") {
        data.color = numericToString(data.color);
      }
      return this._makeRestRequest({
        $,
        path: "/projects",
        method: "POST",
        data,
      });
    },
    /**
     * Update a project
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing the projectId
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async updateProject(opts) {
      const {
        $,
        data = {},
      } = opts;
      const { projectId } = data;
      delete data.projectId;
      // Transform numeric color to string for v1 API
      if (data.color && typeof data.color === "number") {
        data.color = numericToString(data.color);
      }
      return this._makeRestRequest({
        $,
        path: `/projects/${projectId}`,
        method: "POST",
        data,
      });
    },
    /**
     * Delete a project
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing the projectId
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async deleteProject(opts) {
      const {
        $,
        data = {},
      } = opts;
      const { projectId } = data;
      return this._makeRestRequest({
        $,
        path: `/projects/${projectId}`,
        method: "DELETE",
      });
    },
    /**
     * Invite a user to join a project
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing the project ID and user's email
     * @returns {Object} Object including sync_token
     */
    async shareProject(opts) {
      const {
        $,
        data = {},
      } = opts;
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
     * @params {Integer} [projectId] ID of a project
     * @returns {Object} JSON-encoded array containing all collaborators of a shared project
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
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} params [opts.params = {}] - object containing section_id and/or project_id
     * @returns {Object|Array} A section object related to the given ID or a list of sections if
     * no ID specified
     */
    async getSections(opts) {
      const {
        $,
        params = {},
      } = opts;
      const { section_id: id = "" } = params;
      delete params.section_id;
      return this._makeRestRequest({
        $,
        path: id
          ? `/sections/${id}`
          : "/sections",
        method: "GET",
        params,
      });
    },
    /**
     * Create a new section
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing info about the new section
     * being created
     * @returns {Object} The created section as a JSON object
     */
    async createSection(opts) {
      const {
        $,
        data = {},
      } = opts;
      return this._makeRestRequest({
        $,
        path: "/sections",
        method: "POST",
        data,
      });
    },
    /**
     * Update a section
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing the sectionId and updated name
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async updateSection(opts) {
      const {
        $,
        data = {},
      } = opts;
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
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing the sectionId
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async deleteSection(opts) {
      const {
        $,
        data = {},
      } = opts;
      const { sectionId } = data;
      return this._makeRestRequest({
        $,
        path: `/sections/${sectionId}`,
        method: "DELETE",
      });
    },
    /**
     * Get label by ID or get all labels if no ID specified
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Integer} [opts.id = ""] - A label ID
     * @returns {Object|Array} A label object related to the given ID or all user labels if
     * no ID specified
     */
    async getLabels(opts) {
      const {
        $,
        id = "",
      } = opts;
      return this._makeRestRequest({
        $,
        path: id
          ? `/labels/${id}`
          : "/labels",
        method: "GET",
      });
    },
    /**
     * Create a new label
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing info about the new label being created
     * @returns {Object} The created label as a JSON object
     */
    async createLabel(opts) {
      const {
        $,
        data = {},
      } = opts;
      // Transform numeric color to string for v1 API
      if (data.color && typeof data.color === "number") {
        data.color = numericToString(data.color);
      }
      return this._makeRestRequest({
        $,
        path: "/labels",
        method: "POST",
        data,
      });
    },
    /**
     * Update a label
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing id & info about the label being updated
     * @returns {Object} The created label as a JSON object
     */
    async updateLabel(opts) {
      const {
        $,
        data = {},
      } = opts;
      const { labelId } = data;
      delete data.labelId;
      // Transform numeric color to string for v1 API
      if (data.color && typeof data.color === "number") {
        data.color = numericToString(data.color);
      }
      return this._makeRestRequest({
        $,
        path: `/labels/${labelId}`,
        method: "POST",
        data,
      });
    },
    /**
     * Delete a label
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing the labelId
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async deleteLabel(opts) {
      const {
        $,
        data = {},
      } = opts;
      const { labelId } = data;
      return this._makeRestRequest({
        $,
        path: `/labels/${labelId}`,
        method: "DELETE",
      });
    },
    /**
     * Get a comment by ID or get a list of comments in a project or task if no ID is specified
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.params = {}] - object containing one or more of comment_id,
     * project_id or task_id
     * @returns {Array} JSON-encoded array containing comments
     */
    async getComments(opts) {
      const {
        $,
        params,
      } = opts;
      const {
        comment_id: id = "",
        task_id: taskId,
      } = params;
      if (taskId) {
        delete params.project_id;
      }
      delete params.comment_id;
      return this._makeRestRequest({
        $,
        path: id
          ? `/comments/${id}`
          : "/comments",
        method: "GET",
        params,
      });
    },
    /**
     * Create a new comment in a task or project
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing info about the new comment
     * being created
     * @returns {Object} The created comment as a JSON object
     */
    async createComment(opts) {
      const {
        $,
        data = {},
      } = opts;
      return this._makeRestRequest({
        $,
        path: "/comments",
        method: "POST",
        data,
      });
    },
    /**
     * Update a comment in a task or project
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing the commentId and new comment content
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async updateComment(opts) {
      const {
        $,
        data = {},
      } = opts;
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
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] = object containing the commentId
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async deleteComment(opts) {
      const {
        $,
        data = {},
      } = opts;
      const { commentId } = data;
      return this._makeRestRequest({
        $,
        path: `/comments/${commentId}`,
        method: "DELETE",
      });
    },
    /**
     * Get task by ID or get a list of all active tasks in a project if no ID is specified
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.params = {}] - object containing one or more of task_id, project_id,
     * section_id, and/or label_id
     * @returns {Object|Array} A task object related to the given ID or a list of tasks if
     * no ID is specified
     */
    async getActiveTasks(opts) {
      const {
        $,
        params = {},
      } = opts;
      const { task_id: id = "" } = params;
      delete params.task_id;
      return this._makeRestRequest({
        $,
        path: id
          ? `/tasks/${id}`
          : "/tasks",
        method: "GET",
        params,
      });
    },
    /**
     * Get a list of all completed tasks in a project
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.params = {}] - object containing project_id,
     * @returns {Object|Array} A list of task objects
     */
    async getCompletedTasks(opts) {
      const {
        $,
        params = {},
      } = opts;
      return this._makeRestRequest({
        $,
        path: "/tasks/completed/by_completion_date",
        method: "GET",
        params,
      });
    },
    /**
     * Create a new task
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing info about the new task being created
     * @returns {Object} The created task as a JSON object
     */
    async createTask(opts) {
      const {
        $,
        data = {},
      } = opts;
      return this._makeRestRequest({
        $,
        path: "/tasks",
        method: "POST",
        data,
      });
    },
    /**
     * Create multiple new tasks
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Array} [opts.data = []] - an array of objects, each containing parameters
     * for a new task to be created
     * @returns {Object} An array of responses and tempIds for each new task
     */
    async createTasks(opts) {
      const {
        $,
        data = [],
      } = opts;
      const commands = [];
      for (const taskData of data) {
        commands.push({
          type: "item_add",
          temp_id: uuid(),
          uuid: uuid(),
          args: taskData,
        });
      }
      const syncResponses = await this.batchSync({
        $,
        opts: {
          commands,
        },
      });
      return {
        responses: syncResponses,
        tempIds: commands.map((command) => command.temp_id),
      };
    },
    /**
     * Moves tasks to new parent_id, section_id, or project_id
     * @params {Object} opts - An object representing configuration options for this method
     * @returns {Object} - An array of responses, one per batch of tasks
    */
    async moveTasks(opts) {
      const {
        $,
        data = [],
      } = opts;

      const commands = data.map((args) => ({
        type: "item_move",
        uuid: uuid(),
        args,
      }));

      const syncResponses = await this.batchSync({
        $,
        opts: {
          commands,
        },
      });
      return {
        responses: syncResponses,
      };
    },
    /**
     * Update a task
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing info about the task being updated
     * @returns {Object} The updated task as a JSON object
     */
    async updateTask(opts) {
      const {
        $,
        data = {},
      } = opts;
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
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.params = {}] - object containing a taskId
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async closeTask(opts) {
      const {
        $,
        params = {},
      } = opts;
      const { taskId } = params;
      return this._makeRestRequest({
        $,
        path: `/tasks/${taskId}/close`,
        method: "POST",
      });
    },
    /**
     * Reopen/uncomplete a task by the task id
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.params = {}] - object containing a taskId
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async reopenTask(opts) {
      const {
        $,
        params = {},
      } = opts;
      const { taskId } = params;
      return this._makeRestRequest({
        $,
        path: `/tasks/${taskId}/reopen`,
        method: "POST",
      });
    },
    /**
     * Delete a task by the task id
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing a taskId
     * @returns {Object} A successful response has 204 No Content status and an empty body
     */
    async deleteTask(opts) {
      const {
        $,
        data = {},
      } = opts;
      const { taskId } = data;
      return this._makeRestRequest({
        $,
        path: `/tasks/${taskId}`,
        method: "DELETE",
      });
    },
    /**
     * Move a task to a different section
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing a task id and section_id
     * @returns {Object} Object containing the sync_status
     */
    async moveTask(opts) {
      const {
        $,
        data = {},
      } = opts;
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
     * @params {Object} db - a database instance
     * @returns {Object} Object containing new tasks
     */
    async syncItems(db) {
      return this.syncResources(db, [
        "items",
      ]);
    },
    /**
     * Get a list of new projects
     * @params {Object} db - a database instance
     * @returns {Object} Object containing new projects
     */
    async syncProjects(db) {
      return this.syncResources(db, [
        "projects",
      ]);
    },
    /**
     * Get a list of new sections
     * @params {Object} db - a database instance
     * @returns {Object} Object containing new sections
     */
    async syncSections(db) {
      return this.syncResources(db, [
        "sections",
      ]);
    },
    /**
     * Get a list of collaborators
     * @params {Object} [db = null] - a database instance
     * @returns {Object} Object containing new collaborators
     */
    async syncCollaborators(db = null) {
      return this.syncResources(db, [
        "collaborators",
      ]);
    },
    /**
     * Get a list of filters
     * @params {Object} [db] - a database instance
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
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing info about the new filter being created
     * @returns {Object} Object including sync_token
     */
    async createFilter(opts) {
      const {
        $,
        data = {},
      } = opts;
      // Transform numeric color to string for v1 API
      if (data.color && typeof data.color === "number") {
        data.color = numericToString(data.color);
      }
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
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing info about the filter being updated
     * @returns {Object} Object including sync_token
     */
    async updateFilter(opts) {
      const {
        $,
        data = {},
      } = opts;
      // Transform numeric color to string for v1 API
      if (data.color && typeof data.color === "number") {
        data.color = numericToString(data.color);
      }
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
     * @params {Object} opts - An object representing configuration options for this method
     * @params {Object} [opts.data = {}] - object containing a filter ID
     * @returns {Object} Object including sync_token
     */
    async deleteFilter(opts) {
      const {
        $,
        data = {},
      } = opts;
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
     * @params {Object} [db] - a database instance
     * @params {Array} resourceTypes - an array of strings representing
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
