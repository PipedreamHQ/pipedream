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
    /**
     * Creates and returns a new Daytona SDK client authenticated with the
     * user's API key, API URL, and target region.
     *
     * @returns {Daytona} Authenticated Daytona client instance
     */
    _client() {
      return new Daytona({
        apiKey: this.$auth.api_key,
        apiUrl: this.$auth.api_url,
        target: this.$auth.target,
      });
    },
    /**
     * Retrieves a sandbox by its ID.
     *
     * @param {string} sandboxId - The ID of the sandbox to retrieve
     * @returns {Promise<Sandbox>} The sandbox instance
     */
    getSandbox(sandboxId) {
      return this._client().get(sandboxId);
    },
    /**
     * Returns a paginated list of sandboxes, optionally filtered by labels.
     *
     * @param {Object} [labels={}] - Key-value label filters
     * @param {number} [page=1] - Page number (1-indexed)
     * @param {number} [limit=DEFAULT_LIMIT] - Max results per page
     * @returns {Promise<PaginatedSandboxes>} Paginated sandbox list
     */
    listSandboxes(labels = {}, page = 1, limit = DEFAULT_LIMIT) {
      return this._client().list(labels, page, limit);
    },
    /**
     * Returns a paginated list of available snapshots.
     *
     * @param {number} [page=1] - Page number (1-indexed)
     * @param {number} [limit=DEFAULT_LIMIT] - Max results per page
     * @returns {Promise<PaginatedSnapshots>} Paginated snapshot list
     */
    listSnapshots(page = 1, limit = DEFAULT_LIMIT) {
      return this._client().snapshot.list(page, limit);
    },
    /**
     * Creates a new sandbox from a snapshot, image, or the default snapshot.
     *
     * @param {Object} [params={}] - Snapshot or image creation parameters
     * @param {Object} [options={}] - Additional options (e.g. timeout)
     * @returns {Promise<Sandbox>} The created sandbox instance
     */
    createSandbox(params = {}, options = {}) {
      return this._client().create(params, options);
    },
    /**
     * Permanently deletes a sandbox.
     *
     * @param {string} sandboxId - The ID of the sandbox to delete
     * @param {number} [timeout] - Timeout in seconds (0 means no timeout)
     * @returns {Promise<void>}
     */
    async deleteSandbox(sandboxId, timeout) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.delete(timeout);
    },
    /**
     * Starts a stopped sandbox and waits for it to be ready.
     *
     * @param {string} sandboxId - The ID of the sandbox to start
     * @param {number} [timeout] - Timeout in seconds (0 means no timeout)
     * @returns {Promise<void>}
     */
    async startSandbox(sandboxId, timeout) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.start(timeout);
    },
    /**
     * Stops a running sandbox.
     *
     * @param {string} sandboxId - The ID of the sandbox to stop
     * @param {number} [timeout] - Timeout in seconds (0 means no timeout)
     * @returns {Promise<void>}
     */
    async stopSandbox(sandboxId, timeout) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.stop(timeout);
    },
    /**
     * Executes a shell command inside a sandbox.
     *
     * @param {string} sandboxId - The ID of the sandbox
     * @param {string} command - Shell command to execute
     * @param {string} [cwd] - Working directory for the command
     * @param {number} [timeout] - Timeout in seconds (0 means no timeout)
     * @returns {Promise<ExecuteResponse>} Command execution result
     */
    async runCommand(sandboxId, command, cwd, timeout) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.process.executeCommand(command, cwd, undefined, timeout);
    },
    /**
     * Executes code inside a sandbox using the appropriate language runtime.
     *
     * @param {string} sandboxId - The ID of the sandbox
     * @param {string} code - Code to execute
     * @param {CodeRunParams} [params] - Optional code execution parameters
     * @param {number} [timeout] - Timeout in seconds (0 means no timeout)
     * @returns {Promise<ExecuteResponse>} Code execution result
     */
    async runCode(sandboxId, code, params, timeout) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.process.codeRun(code, params, timeout);
    },
    /**
     * Creates a time-limited SSH access token for a sandbox.
     *
     * @param {string} sandboxId - The ID of the sandbox
     * @param {number} [expiresInMinutes] - Token expiry duration in minutes
     * @returns {Promise<SshAccessDto>} SSH access token and connection details
     */
    async createSshAccess(sandboxId, expiresInMinutes) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.createSshAccess(expiresInMinutes);
    },
    /**
     * Revokes an SSH access token for a sandbox.
     *
     * @param {string} sandboxId - The ID of the sandbox
     * @param {string} token - The SSH access token to revoke
     * @returns {Promise<void>}
     */
    async revokeSshAccess(sandboxId, token) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.revokeSshAccess(token);
    },
    /**
     * Clones a Git repository into a sandbox.
     *
     * @param {string} sandboxId - The ID of the sandbox
     * @param {string} url - Repository URL to clone from
     * @param {string} path - Destination path inside the sandbox
     * @param {string} [branch] - Branch to clone (defaults to the repo's default branch)
     * @param {string} [commitId] - Specific commit SHA to checkout
     * @param {string} [username] - Git username for authentication
     * @param {string} [password] - Git password or personal access token
     * @returns {Promise<void>}
     */
    async cloneGitRepository(sandboxId, url, path, branch, commitId, username, password) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.git.clone(url, path, branch, commitId, username, password);
    },
    /**
     * Returns a preview URL and token for a service running on a specific
     * port in the sandbox.
     *
     * @param {string} sandboxId - The ID of the sandbox
     * @param {number} port - The port the service is listening on
     * @returns {Promise<PortPreviewUrl>} Preview URL and access token
     */
    async getPreviewLink(sandboxId, port) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.getPreviewLink(port);
    },
    /**
     * Polls until the sandbox reaches the stopped state.
     *
     * @param {string} sandboxId - The ID of the sandbox
     * @param {number} [timeout] - Timeout in seconds (0 means no timeout)
     * @returns {Promise<void>}
     */
    async waitUntilStopped(sandboxId, timeout) {
      const sandbox = await this.getSandbox(sandboxId);
      return sandbox.waitUntilStopped(timeout);
    },
  },
};
