import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "scale_ai",
  propDefinitions: {
    project: {
      type: "string",
      label: "Project",
      description: "The name of the [project](https://docs.scale.com/reference/project-overview) to associate this task with.",
      optional: true,
      async options() {
        const projects = await this.listProjects();
        return projects.map(({ name }) => name);
      },
    },
    batch: {
      type: "string",
      label: "Batch",
      description: "The name of the [batch](https://docs.scale.com/reference/batch-overview) to associate this task with. Note that if a batch is specified, you need not specify the project, as the task will automatically be associated with the batch's project. For Scale Rapid projects specifying a batch is required. See [Batches section](https://docs.scale.com/reference/batch-overview) for more details.",
      optional: true,
    },
    instruction: {
      type: "string",
      label: "Instruction",
      description: "A markdown-enabled string or iframe embedded Google Doc explaining how to do the task. You can use [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) to show example images, give structure to your instructions, and more. See our [instruction best practices](https://scale.com/docs/instructions) for more details. For Scale Rapid projects, DO NOT set this field unless you specifically want to override the project level instructions.",
      optional: true,
      default: "**Instructions:** Please label all the things",
    },
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "The full url (including the scheme `http://` or `https://`) or email address of the [callback](https://docs.scale.com/reference/callbacks) that will be used when the task is completed.",
      optional: true,
    },
    attachment: {
      type: "string",
      label: "Attachment",
      description: "A URL to the image you'd like to be annotated.",
      optional: true,
    },
    priority: {
      type: "integer",
      label: "Priority",
      description: "A value of 10, 20, or 30 that defines the priority of a task within a project. The higher the number, the higher the priority.",
      optional: true,
    },
    uniqueId: {
      type: "string",
      label: "Unique ID",
      description: "A arbitrary ID that you can assign to a task and then query for later. This ID must be unique across all projects under your account, otherwise the task submission will be rejected. See [Avoiding Duplicate Tasks](https://docs.scale.com/reference/idempotent-requests) for more details.",
      optional: true,
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path) {
      return `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...headers,
      };
    },
    getAuth() {
      return {
        username: this.$auth.api_key,
        password: "",
      };
    },
    makeRequest({
      step = this, path, headers, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        auth: this.getAuth(),
        ...args,
      };

      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this.makeRequest({
        path: "/projects",
        ...args,
      });
    },
  },
};
