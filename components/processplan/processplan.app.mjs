import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "processplan",
  propDefinitions: {
    processTemplateHeaderId: {
      type: "string",
      label: "Process",
      description: "Select the process template",
      async options() {
        const { process_template_header_list: items } = await this.listProcessTemplates();
        return items.map(({
          th_id: value, th_name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    processTemplateTaskId: {
      type: "string",
      label: "Task",
      description: "Select the task template to monitor",
      async options({ processTemplateHeaderId }) {
        if (!processTemplateHeaderId) return [];
        const { process_template_task_list: items } = await this.listProcessTemplateTasks({
          processTemplateHeaderId,
        });
        return items.map(({
          tt_id: value, tt_name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    processInstanceHeaderId: {
      type: "string",
      label: "Process Instance ID",
      description: "The ID of the running process instance",
      async options({ processTemplateHeaderId } = {}) {
        const { process_instance_header_list: items } = await this.listProcessInstances({
          processTemplateHeaderId,
        });
        return items.map(({
          ih_id: value, ih_instance_description, ih_th_obj,
        }) => ({
          value,
          label: ih_instance_description || ih_th_obj?.th_name || value,
        }));
      },
    },
    processInstanceHeaderIdByTask: {
      type: "string",
      label: "Process Instance",
      description: "Select the process instance that has this task pending",
      async options({ processTemplateTaskId }) {
        if (!processTemplateTaskId) {
          return [];
        }
        const { process_instance_task_list: pendingTasks } =
          await this.listPendingTasksByTemplateTask({
            processTemplateTaskId,
          });
        return pendingTasks.map(({
          it_ih_id: value, it_instance_description, it_th_obj,
        }) => ({
          value: String(value),
          label: it_instance_description || it_th_obj?.th_name || String(value),
        }));
      },
    },
    fieldValues: {
      type: "object",
      label: "Field Values",
      description: "Key-value pairs of process field names and their values (e.g. `{\"Field Name\": \"value\"}`)",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.regional_subdomain}.processplan.com/api/v4`;
    },
    _headers() {
      return {
        tkn_id: this.$auth.api_token,
      };
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listProcessTemplates(args = {}) {
      return this._makeRequest({
        path: "/process_template_header/list",
        ...args,
      });
    },
    listProcessInstances({
      processTemplateHeaderId, ...args
    } = {}) {
      const path = processTemplateHeaderId
        ? `/process_template_header/${processTemplateHeaderId}/process_instance_header/list`
        : "/process_instance_header/list";
      return this._makeRequest({
        path,
        ...args,
      });
    },
    listProcessTemplateTasks({
      processTemplateHeaderId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/process_template_header/${processTemplateHeaderId}/process_template_task/list`,
        ...args,
      });
    },
    listPendingTasksByTemplateTask({
      processTemplateTaskId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/process_template_task/${processTemplateTaskId}/process_instance_task/list/pending`,
        ...args,
      });
    },
    startProcessInstance({
      processTemplateHeaderId, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/process_template_header/${processTemplateHeaderId}/start`,
        ...args,
      });
    },
    respondToTask({
      processInstanceTaskId, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/process_instance_task/${processInstanceTaskId}/respond`,
        ...args,
      });
    },
  },
};
