import wrike from "../../wrike.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  type: "source",
  props: {
    wrike,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
    },
    folderId: {
      propDefinition: [
        wrike,
        "folderId",
      ],
      description: "Receive notifications for tasks in a folder and, optionally, in its subfolders. Leave blank to receive notifications for all tasks in the account",
      optional: true,
      reloadProps: true,
    },
    spaceId: {
      propDefinition: [
        wrike,
        "spaceId",
      ],
      description: "Receive notifications for changes to tasks, folders, and projects within a space. Leave blank to receive notifications for all tasks in the account",
      optional: true,
      reloadProps: true,
    },
  },
  additionalProps() {
    const props = {};

    if (this.folderId && this.spaceId) {
      throw new ConfigurationError("You can only specify a folder or a space, not both");
    }

    if (this.folderId || this.spaceId) {
      props.recursive = {
        type: "boolean",
        label: "Recursive",
        description: "Specifies whether hook should listen to events for subfolders or tasks anywhere in the hierarchy. Defaults to `false`",
        optional: true,
      };
    }

    return props;
  },
  hooks: {
    async activate() {
      console.log("Creating webhook...");
      const response = await this.wrike.createWebhook({
        folderId: this.folderId,
        spaceId: this.spaceId,
        data: {
          hookUrl: this.http.endpoint,
          recursive: this.recursive,
          events: this.getEventTypes(),
        },
      });
      const webhookId = response.data[0].id;
      this._setWebhookId(webhookId);
    },
    async deactivate() {
      console.log("Deleting webhook...");
      await this.wrike.deleteWebhook({
        webhookId: this._getWebhookId(),
      });
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    getEventTypes() {
      const eventTypes = this.eventTypes();
      return `[${eventTypes.join(",")}]`;
    },
    eventTypes() {
      throw new Error("Missing implementation for eventTypes() method");
    },
    getResource() {
      throw new Error("Missing implementation for getResource() method");
    },
    emitEvent() {
      throw new Error("Missing implementation for emitEvent() method");
    },
  },
  async run(event) {
    console.log("Webhook received");
    for (const data of event.body) {
      const resource = await this.getResource(data);
      this.emitEvent(resource);
    }
  },
};
