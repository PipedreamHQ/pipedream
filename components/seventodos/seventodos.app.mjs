// The API from 7todo is rejecting the pipedream's axios
import axios from "axios";

export default {
  type: "app",
  app: "seventodos",
  propDefinitions: {
    title: {
      type: "string",
      label: "Title",
      description: "The title of the task",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the task",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start date",
      description: "The starting date of the task, format: yyyy-mm-dd",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due date",
      description: "The due date of the task, format: yyyy-mm-dd",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the task",
      options: [
        "todo",
        "progress",
        "done",
      ],
      optional: true,
    },
    complexity: {
      type: "integer",
      label: "Complexity",
      description: "The complexity of the task",
      options: [
        {
          label: "one",
          value: 1,
        },
        {
          label: "two",
          value: 2,
        },
        {
          label: "three",
          value: 3,
        },
        {
          label: "four",
          value: 4,
        },
        {
          label: "five",
          value: 5,
        },
      ],
      optional: true,
    },
  },
  methods: {
    _getBaseUrl(endpoint) {
      return `https://7todos.com/api/v1/${endpoint}`;
    },
    _getHeaders() {
      return {
        "content-type": "application/json",
        "key": `${this.$auth.key}`,
        "workspaceId": `${this.$auth.workspaceId}`,
      };
    },
    filterEmptyValues(obj) {
      return Object.entries(obj)
        .reduce((reduction,
          [
            key,
            value,
          ]) => {
          if (value === undefined || value === null) {
            return reduction;
          }
          return {
            ...reduction,
            [key]: value,
          };
        }, {});
    },
    async createTask(param) {
      param.workspaceId = this.$auth.workspaceId;
      param = this.filterEmptyValues(param);
      const { data } = await axios.request(
        {
          url: this._getBaseUrl("/tasks/create"),
          data: param,
          headers: this._getHeaders(),
          method: "POST",
        },
      );
      return data;
    },
  },
};
