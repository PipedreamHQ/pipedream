import jira from "../../jira.app.mjs";

export default {
  props: {
    jira,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
      ],
    },
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
    _getHookID() {
      return this.db.get("hookId");
    },
    _setHookID(hookID) {
      this.db.set("hookId", hookID);
    },
    getEvents() {
      throw new Error("getEvents not implemented!");
    },
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
    async deleteExistingWebhooks() {
      const resourcesStream = await this.jira.getResourcesStream({
        cloudId: this.cloudId,
        resourceFn: this.jira.getWebhook,
        resourceFnArgs: {
          params: {},
        },
        resourceFiltererFn: (resource) => resource.values,
      });
      for await (const webhook of resourcesStream) {
        await this.jira.deleteHook({
          hookId: webhook.id,
          cloudId: this.cloudId,
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
        cloudId: this.cloudId,
        //fieldIdsFilter: this.fieldIdsFilter,
      });
      this._setHookID(hookId);
      console.log(`Created webhook. (Hook ID: ${hookId}, endpoint: ${this.http.endpoint})`);
    },
    async deactivate() {
      await this.jira.deleteHook({
        hookId: this._getHookID(),
        cloudId: this.cloudId,
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
