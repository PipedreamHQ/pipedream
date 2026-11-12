import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kosa8",
  propDefinitions: {
    sandboxId: {
      type: "string",
      label: "Sandbox ID",
      description: "The ID of the sandbox, e.g. `sbx_a1b2c3d4`. Use **List Sandboxes** to find it (the `sandboxes[].id` field).",
      async options() {
        const { sandboxes = [] } = await this.listSandboxes();
        return sandboxes.map((sandbox) => ({
          label: `${sandbox.id} (${sandbox.template}, ${sandbox.state})`,
          value: sandbox.id,
        }));
      },
    },
    template: {
      type: "string",
      label: "Template",
      description: "The key of the template to create the sandbox from, e.g. `base`. Use **List Templates** to find valid keys (the `templates[].key` field). Leave empty to use your organization's default template.",
      optional: true,
      async options() {
        const { templates = [] } = await this.listTemplates();
        return templates.map((template) => ({
          label: `${template.key} (${template.cpus} vCPU, ${template.mem_mb} MB)`,
          value: template.key,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.kosa8.com/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    listSandboxes(opts = {}) {
      return this._makeRequest({
        path: "/sandboxes",
        ...opts,
      });
    },
    createSandbox(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sandboxes",
        ...opts,
      });
    },
    getSandbox({
      sandboxId, ...opts
    }) {
      return this._makeRequest({
        path: `/sandboxes/${sandboxId}`,
        ...opts,
      });
    },
    deleteSandbox({
      sandboxId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/sandboxes/${sandboxId}`,
        ...opts,
      });
    },
    runCommand({
      sandboxId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/sandboxes/${sandboxId}/exec`,
        ...opts,
      });
    },
    sleepSandbox({
      sandboxId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/sandboxes/${sandboxId}/sleep`,
        ...opts,
      });
    },
    wakeSandbox({
      sandboxId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/sandboxes/${sandboxId}/wake`,
        ...opts,
      });
    },
  },
};
