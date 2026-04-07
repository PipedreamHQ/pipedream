import { Daytona } from "@daytonaio/sdk";
const DEFAULT_LIMIT = 100;

export default {
  type: "app",
  app: "daytona",
  propDefinitions: {
    snapshotId: {
      type: "string",
      label: "Snapshot ID",
      description: "The ID of a snapshot",
      async options({ page }) {
        const { items: snapshots } = await this.listSnapshots(page + 1, DEFAULT_LIMIT);
        return snapshots?.map((snapshot) => ({
          label: snapshot.name,
          value: snapshot.id,
        })) || [];
      },
    },
    sandboxId: {
      type: "string",
      label: "Sandbox ID",
      description: "The ID of a sandbox",
      async options({ page }) {
        const { items: sandboxes } = await this.listSandboxes({}, page + 1, DEFAULT_LIMIT);
        return sandboxes?.map((sandbox) => ({
          label: sandbox.name,
          value: sandbox.id,
        })) || [];
      },
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Timeout in seconds (0 means no timeout, default is 60)",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to return",
      optional: true,
      default: 1,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of items to return",
      optional: true,
      default: 100,
    },
  },
  methods: {
    _client() {
      return new Daytona({
        apiKey: this.$auth.api_key,
        apiUrl: this.$auth.api_url,
        target: this.$auth.target,
      });
    },
    getSandbox(sandboxId) {
      return this._client().get(sandboxId);
    },
    listSandboxes(labels = {}, page = 1, limit = DEFAULT_LIMIT) {
      return this._client().list(labels, page, limit);
    },
    listSnapshots(page = 1, limit = DEFAULT_LIMIT) {
      return this._client().snapshot.list(page, limit);
    },
    createSandbox(params = {}, options = {}) {
      return this._client().create(params, options);
    },
    async deleteSandbox(sandboxId, timeout) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.delete(timeout);
    },
    async startSandbox(sandboxId, timeout) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.start(timeout);
    },
    async stopSandbox(sandboxId, timeout) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.stop(timeout);
    },
    async runCommand(sandboxId, command, cwd, timeout) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.process.executeCommand(command, cwd, undefined, timeout);
    },
    async runCode(sandboxId, code, params, timeout) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.process.codeRun(code, params, timeout);
    },
    async createSshAccess(sandboxId, timeout) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.createSshAccess(timeout);
    },
    async revokeSshAccess(sandboxId, token) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.revokeSshAccess(token);
    },
    async cloneGitRepository(sandboxId, url, path, branch, commitId, username, password) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.git.clone(url, path, branch, commitId, username, password);
    },
    async getPreviewLink(sandboxId, port) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.getPreviewLink(port);
    },
    async waitUntilStopped(sandboxId, timeout) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.waitUntilStopped(timeout);
    },
  },
};
