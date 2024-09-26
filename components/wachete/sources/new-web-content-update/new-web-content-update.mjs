import wachete from "../../wachete.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "wachete-new-web-content-update",
  name: "New Web Content Update (Instant)",
  description: "Emit new event when a Wachet receives a new notification",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    wachete,
    http: "$.interface.http",
    folderId: {
      propDefinition: [
        wachete,
        "folderId",
      ],
    },
    wachetId: {
      propDefinition: [
        wachete,
        "wachetId",
        (c) => ({
          parentId: c.folderId,
        }),
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        notificationEndpoints, ...otherData
      } = await this.wachete.getMonitor({
        id: this.wachetId,
      });
      const endpoints = notificationEndpoints || [];
      endpoints.push({
        type: "Webhook",
        value: this.http.endpoint,
      });
      await this.updateMonitor({
        notificationEndpoints: endpoints,
        ...otherData,
      });
    },
    async deactivate() {
      const {
        notificationEndpoints, ...otherData
      } = await this.wachete.getMonitor({
        id: this.wachetId,
      });
      const endpoints = notificationEndpoints || [];
      const newNotificationEndpoints = endpoints
        .filter(({ value }) => value !== this.http.endpoint);
      await this.updateMonitor({
        notificationEndpoints: newNotificationEndpoints,
        ...otherData,
      });
    },
  },
  methods: {
    async updateMonitor(data) {
      await this.wachete.createOrUpdateMonitor({
        data: {
          id: this.wachetId,
          ...data,
        },
      });
    },
    generateMeta(body) {
      const ts = Date.now();
      return {
        id: `${body.taskId}${ts}`,
        summary: `New Notification: ${body.taskId}`,
        ts,
      };
    },
  },
  async run(event) {
    const { body } = event;
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
  sampleEmit,
};
