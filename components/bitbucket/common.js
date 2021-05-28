const bitbucket = require("./bitbucket.app");

module.exports = {
  dedupe: "unique",
  props: {
    bitbucket,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    workspaceId: { propDefinition: [bitbucket, "workspaceId"] },
  },
  hooks: {
    async activate() {
      const hookParams = this._getHookParams();
      const hookPathProps = this.getHookPathProps();
      const opts = {
        hookParams,
        hookPathProps,
      };
      const { hookId } = await this.bitbucket.createHook(opts);
      console.log(
        `Created webhook for ${JSON.stringify(hookPathProps)}.
        Hook parameters: ${JSON.stringify(hookParams)}.
        (Hook ID: ${hookId}, endpoint: ${hookParams.url})`
      );
      this.db.set("hookId", hookId);
    },
    async deactivate() {
      const hookId = this.db.get("hookId");
      const hookPathProps = this.getHookPathProps();
      const opts = {
        hookId,
        hookPathProps,
      };
      await this.bitbucket.deleteHook(opts);
      console.log(
        `Deleted webhook for ${JSON.stringify(hookPathProps)}.
        (Hook ID: ${hookId})`
      );
    },
  },
  methods: {
    _isValidSource(headers, db) {
      const hookId = headers["x-hook-uuid"];
      const expectedHookId = db.get("hookId");
      return hookId === expectedHookId;
    },
    _getHookParams() {
      const eventSourceName = this.getEventSourceName();
      const hookDescription = `Pipedream - ${eventSourceName}`;
      const hookEvents = this.getHookEvents();
      return {
        description: hookDescription,
        url: this.http.endpoint,
        active: true,
        events: hookEvents,
      };
    },
    async processEvent(event) {
      const { body } = event;
      const meta = this.generateMeta(event);
      this.$emit(body, meta);
    },
  },
  async run(event) {
    const { headers } = event;

    // Reject any calls not made by the proper BitBucket webhook.
    if (!this._isValidSource(headers, this.db)) {
      this.http.respond({
        status: 404,
      });
      return;
    }

    // Acknowledge the event back to BitBucket.
    this.http.respond({
      status: 200,
    });

    return await this.processEvent(event);
  },
};
