import ghostAdminApi from "../ghost_org_admin_api.app.mjs";

export default {
  props: {
    ghostAdminApi,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const event = this.getEvent();
      const { webhooks = [] } = await this.ghostAdminApi.createHook({
        data: {
          webhooks: [
            {
              event,
              target_url: this.http.endpoint,
            },
          ],
        },
      });

      const [
        webhook,
      ] = webhooks;

      if (!webhook) {
        throw new Error("No webhook was returned by Ghost. Please try again.");
      }

      this._setHookId(webhook.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (!hookId) {
        console.warn("No hookId provided. No webhook deleted");
      }
      await this.ghostAdminApi.deleteHook({
        hookId,
      });
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    /**
     * Gets the [Ghost event](https://ghost.org/docs/webhooks/) for which this webhook should
     * receive events
     *
     * To receive webhook requests for the Ghost event `site.changed`, the function would look like
     * this:
     * @example
     * function getEvent() {
     *   return "site.changed";
     * }
     *
     * @returns {string} The full Ghost event string
     */
    getEvent() {
      throw new Error("getEvent is not implemented");
    },
    /**
     * Generates the metadata object to append to the emitted event
     *
     * @param {object} data - The data being processed by the event source
     * @returns {object} A metadata object containing a unique ID (`id`), a summary of the event
     * (`summary`) and its timestamp (`ts`) as the number of milliseconds since the [Unix
     * Epoch](https://en.wikipedia.org/wiki/Unix_time)
     */
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    /**
     * Emits an event. Components should overwrite this function if something more
     * needs to be emitted in the event.
     *
     * @param {object} body - The event body to be emitted
     */
    emitEvent(body) {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    },
  },
  async run(event) {
    this.emitEvent(event.body);
  },
};
