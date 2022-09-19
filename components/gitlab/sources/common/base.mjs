import gitlab from "../../gitlab.app.mjs";

export default {
  props: {
    gitlab,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    projectId: {
      propDefinition: [
        gitlab,
        "projectId",
      ],
    },
  },
  hooks: {
    /**
     * This method should be implemented in every source component
     */
    async activate() {
      // await this.activateHook(eventType);
      throw new Error("activate() hook not implemented");
    },
    async deactivate() {
      const hookId = this.getHookId();
      await this.gitlab.deleteProjectHook(this.projectId, hookId);
      console.log(
        `Deleted webhook for project ID ${this.projectId}.
        (Hook ID: ${hookId})`,
      );
    },
  },
  methods: {
    _buildHookOpts(eventType) {
      if (Array.isArray(eventType)) {
        return eventType.reduce((prev, e) => ({
          ...prev,
          [e]: true,
        }), {});
      }
      return {
        [eventType]: true,
      };
    },
    getHookId() {
      return this.db.get("hookId");
    },
    setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getToken() {
      return this.db.get("token");
    },
    setToken(token) {
      this.db.set("token", token);
    },
    async activateHook(eventType) {
      const opts = this._buildHookOpts(eventType);
      const url = this.http.endpoint;
      const {
        hookId,
        token,
      } = await this.gitlab.createProjectHook(this.projectId, url, opts);
      console.log(
        `Created "${eventType}" webhook for project ID ${this.projectId}.
        (Hook ID: ${hookId}, endpoint: ${url})`,
      );
      this.setHookId(hookId);
      this.setToken(token);
    },
    emitEvent() {
      throw new Error("emitEvent is not implemented");
    },
    isValidSource(headers) {
      const token = headers["x-gitlab-token"];
      const expectedToken = this.getToken();
      return token === expectedToken;
    },
    isValidEvent(headers) {
      // Reject any calls not made by the proper Gitlab webhook.
      if (!this.isValidSource(headers)) {
        this.http.respond({
          status: 404,
        });
        return false;
      }
      // Acknowledge the event back to Gitlab.
      this.http.respond({
        status: 200,
      });
      return true;
    },
  },
  async run(event) {
    const {
      headers,
      body,
    } = event;
    if (this.isValidEvent(headers)) {
      await this.emitEvent(body);
    }
  },
};
