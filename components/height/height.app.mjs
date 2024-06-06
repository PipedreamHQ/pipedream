import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "height",
  propDefinitions: {
    list: {
      type: "string",
      label: "List",
      description: "The list to which the task has been added",
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The name of the task",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the task",
      optional: true,
    },
    deadline: {
      type: "string",
      label: "Deadline",
      description: "The deadline of the task",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the task",
      optional: true,
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
      optional: true,
    },
    newTaskName: {
      type: "string",
      label: "New Task Name",
      description: "The new name of the task",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "The text query to search for tasks",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async emitEvent(eventName, payload) {
      return axios(this, {
        method: "POST",
        url: `https://api.pipedream.com/v1/sources/${this.$auth.sourceId}/emit`,
        headers: {
          "Authorization": `Bearer ${this.$auth.apiKey}`,
        },
        data: {
          name: eventName,
          payload: payload,
        },
      });
    },
    async createTask(taskName, description, deadline, priority) {
      // Implement the API call to create a new task
      // Then emit the event
      await this.emitEvent("task_created", {
        taskName,
        description,
        deadline,
        priority,
      });
    },
    async updateTask(taskId, newTaskName, description, deadline, priority) {
      // Implement the API call to update a task
      // Then emit the event
      await this.emitEvent("task_updated", {
        taskId,
        newTaskName,
        description,
        deadline,
        priority,
      });
    },
    async addTaskToList(list, taskName, description, deadline, priority) {
      // Implement the API call to add a task to a list
      // Then emit the event
      await this.emitEvent("task_added_to_list", {
        list,
        taskName,
        description,
        deadline,
        priority,
      });
    },
    async markTaskAsComplete(taskId) {
      // Implement the API call to mark a task as complete
      // Then emit the event
      await this.emitEvent("task_marked_as_complete", {
        taskId,
      });
    },
    async searchTasks(query) {
      // Implement the API call to search for tasks
      // Then emit the event
      await this.emitEvent("tasks_searched", {
        query,
      });
    },
  },
};
