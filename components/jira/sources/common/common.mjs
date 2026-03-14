import jira from "../../jira.app.mjs";

export default {
  props: {
    jira,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    jqlFilter: {
      propDefinition: [
        jira,
        "jqlFilter",
      ],
      description: "The JQL filter that specifies which issues the webhook is sent for, only a subset of JQL can be used, e.g. `project = P1` [See supported JQL filters](https://developer.atlassian.com/cloud/jira/service-desk/webhooks/#supported-jql-queries)",
    },
    overrideExistingWebhooks: {
      type: "boolean",
      label: "Override Existing Webhooks",
      description: "Override existing webhooks with this new Pipedream source's webhook. Recommend to set this to `true` if you have an existing Jira webhook that you no longer use and want to override with the new Pipedream source.",
      default: false,
      optional: true,
    },
  },
  methods: {
    /**
     * Returns the stored webhook ID from the database.
     * @returns {string} The stored hook ID
     */
    _getHookID() {
      return this.db.get("hookId");
    },
    /**
     * Stores the webhook ID in the database for later cleanup.
     * @param {string} hookID - The webhook ID to store
     */
    _setHookID(hookID) {
      this.db.set("hookId", hookID);
    },
    /**
     * Returns the list of Jira event types this source subscribes to.
     * Must be overridden by each source component.
     * @returns {Array<string>} List of Jira event type strings
     */
    getEvents() {
      throw new Error("getEvents not implemented!");
    },
    /**
     * Extracts the relevant item, type, summary, and timestamp from a raw Jira webhook event.
     * @param {object} event - The raw HTTP event from the Jira webhook
     * @returns {object} Object containing summary, itemType, item, and ts
     */
    exportItem(event) {
      //Since Jira is sending all information in events,
      //we don't re-fetch related items(issue, comment, etc.)
      const eventType =  event.body.webhookEvent;
      let itemType, item, summary;
      let ts = event?.body?.timestamp * 1000;
      switch (eventType) {
      case "jira:issue_created":
        itemType = "issue";
        item = event.body?.issue;
        summary = `New issue created. - ${event.body?.issue?.fields?.summary} (${event.body?.issue?.id})`;
        break;
      case "jira:issue_updated":
        itemType = "issue";
        item = event.body?.issue;
        summary = `Issue updated. - ${event.body?.issue?.fields?.summary} (${event.body?.issue?.id})`;
        break;
      case "jira:issue_deleted":
        itemType = "issue";
        item = event.body?.issue;
        summary = `Issue deleted. - ${event.body?.issue?.fields?.summary} (${event.body?.issue?.id})`;
        break;
      /*case "comment_created":
        itemType = "comment";
        item = event.body?.comment;
        summary = "New comment created.";
        break;
      case "comment_updated":
        itemType = "comment";
        item = event.body?.comment;
        summary = "Comment updated.";
        break;
      case "comment_deleted":
        itemType = "comment";
        item = event.body?.comment;
        summary = "Comment deleted.";
        break;
      case "issue_property_set":
        itemType = "property";
        item = event.body?.property;
        summary = "Property set.";
        break;
      case "issue_property_deleted":
        itemType = "property";
        item = event.body?.property;
        summary = "Property deleted.";
        break;*/
      default:
        itemType = "body";
        item = event?.body;
        summary = "Unknown event";
      }
      return {
        summary,
        itemType,
        item,
        ts,
      };
    },
    /**
     * Deletes all existing Jira webhooks registered by this app to avoid conflicts on re-activation.
     * @returns {Promise<void>}
     */
    async deleteExistingWebhooks() {
      const resourcesStream = await this.jira.getResourcesStream({
        resourceFn: this.jira.getWebhook,
        resourceFnArgs: {
          params: {},
        },
        resourceFiltererFn: (resource) => resource.values,
      });
      for await (const webhook of resourcesStream) {
        await this.jira.deleteHook({
          hookId: webhook.id,
        });
      }
    },
  },
  hooks: {
    async activate() {
      if (this.overrideExistingWebhooks) {
        await this.deleteExistingWebhooks();
      }
      const { hookId } = await this.jira.createHook({
        url: this.http.endpoint,
        events: this.getEvents(),
        jqlFilter: this.jqlFilter,
        //fieldIdsFilter: this.fieldIdsFilter,
      });
      this._setHookID(hookId);
      console.log(`Created webhook. (Hook ID: ${hookId}, endpoint: ${this.http.endpoint})`);
    },
    async deactivate() {
      await this.jira.deleteHook({
        hookId: this._getHookID(),
      });
    },
  },
  async run(event) {
    const {
      summary,
      itemType,
      item,
      ts,
    } = this.exportItem(event);
    this.$emit(
      {
        event,
        [itemType]: item,
      },
      {
        summary,
        id: ts,
        ts,
      },
    );
  },
};
