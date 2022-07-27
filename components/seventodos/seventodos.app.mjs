// The API from 7todo is rejecting the pipedream's axios
import axios from "axios";

export default {
  type: "app",
  app: "seventodos",
  propDefinitions: {},
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
    objRemoveUndefinedProps(obj) {
      for (const key of Object.keys(obj)) {
        if (obj[key] === undefined || obj[key] === null) {
          delete obj[key];
        }
      }
      return obj;
    },
    async createTask(param) {
      param.workspaceId = this.$auth.workspaceId;
      param = this.objRemoveUndefinedProps(param);
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
