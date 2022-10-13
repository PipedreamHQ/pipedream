import admin from "@googleapis/admin";
import { uuid } from "uuidv4";
import { ConfigurationError } from "@pipedream/platform";
import googleWorkspace from "../app/google_workspace.app";
import constants from "../common/constants";

export default {
  props: {
    googleWorkspace,
    db: "$.service.db",
    http: "$.interface.http",
    timer: {
      type: "$.interface.timer",
      description: "How often you want to check if the Webhook has already expired",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  hooks: {
    async activate() {
      await this.createWebhook();
    },
    async deactivate() {
      await this.removeWebhook();
    },
  },
  methods: {
    setWebhookId(webhookId: string) {
      this.db.set(constants.WEBHOOK_ID, webhookId);
    },
    getWebhookId(): string {
      return this.db.get(constants.WEBHOOK_ID);
    },
    setResourceId(resourceId: string) {
      this.db.set(constants.RESOURCE_ID, resourceId);
    },
    getResourceId(): string {
      return this.db.get(constants.RESOURCE_ID);
    },
    setExpirationTS(ts: number) {
      this.db.set(constants.EXPIRATION_TIMESTAMP, ts);
    },
    getExpirationTS(): number {
      return this.db.get(constants.EXPIRATION_TIMESTAMP);
    },
    setToken(token: string) {
      this.db.set(constants.WEBHOOK_TOKEN, token);
    },
    getToken(): string {
      return this.db.get(constants.WEBHOOK_TOKEN);
    },
    generateExpirationTSInMS() {
      // Check [here](https://developers.google.com/admin-sdk/reports/v1/guides/push#optional-properties) for more info about this variable
      // 6 hours ahead of current time in ms
      const hours = 6;
      const minutes = 60;
      const seconds = 60;
      return Date.now() + 1000 * seconds * minutes * hours;
    },
    async createWebhook() {
      console.log("createWebhook");
      const expirationTS = this.generateExpirationTSInMS();
      const token = uuid();
      const args: admin.admin_reports_v1.Params$Resource$Activities$Watch = {
        userKey: this.getUserKey(),
        applicationName: this.getApplicationName(),
        requestBody: {
          id: uuid(),
          type: "web_hook",
          address: this.http.endpoint,
          token,
          expiration: String(expirationTS),
        },
      };
      const {
        id,
        resourceId,
        expiration,
      }: admin.admin_reports_v1.Schema$Channel =
        await this.googleWorkspace.watchAdminActivities(args);

      this.setWebhookId(id);
      this.setResourceId(resourceId);
      this.setExpirationTS(expiration);
      this.setToken(token);
    },
    async removeWebhook() {
      console.log("removeWebhook");
      const webhookId = this.getWebhookId();
      const resourceId = this.getResourceId();

      const args: admin.admin_reports_v1.Params$Resource$Channels$Stop = {
        requestBody: {
          id: webhookId,
          resourceId,
        },
      };
      await this.googleWorkspace.stopAdminActivities(args);
    },
    async renewWebhook() {
      console.log("renewWebhook");
      await this.removeWebhook();
      await this.createWebhook();
    },
    getUserKey() {
      return "all";
    },
    getApplicationName() {
      return "admin";
    },
    getMetadata() {
      throw new Error("getMetadata not implemented!");
    },
  },
  async run(event) {
    const {
      timestamp,
      headers,
      body,
    } = event;
    const currentTSInMS = timestamp * 1000;
    const expirationTSInMS = this.getExpirationTS();
    const token = this.getToken();

    if (headers?.["x-goog-channel-token"] !== token) {
      throw new ConfigurationError("Webhook token is not valid!");
    }

    const {
      events = [],
      ...otherProps
    } = body;

    events.forEach((event) => {
      const data = {
        ...otherProps,
        ...event,
      };
      this.$emit(data, this.getMetadata(data));
    });

    if (expirationTSInMS && expirationTSInMS < currentTSInMS) {
      await this.renewWebhook();
    }
  },
};

