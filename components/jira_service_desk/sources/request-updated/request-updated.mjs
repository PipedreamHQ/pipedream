// import jiraServiceDesk from "../../jira_service_desk.app.mjs";
// import { axios } from "@pipedream/platform";

export default {
  key: "jira_service_desk-request-updated",
  name: "Request Updated",
  description: "Emits an event each time a request is updated in Jira Service Desk.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    jiraServiceDesk: {
      type: "app",
      app: "jira_service_desk",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      const data = await this.jiraServiceDesk.getRequests();
      if (Array.isArray(data) && data.length > 0) {
        this.db.set("lastModified", new Date(data[0].updated));
      }
    },
  },
  methods: {
    generateMeta(data) {
      return {
        id: data.id,
        summary: `Request Updated: ${data.summary}`,
        ts: Date.parse(data.updated),
      };
    },
  },
  async run() {
    const lastModified = this.db.get("lastModified");
    const requests = await this.jiraServiceDesk.getRequests();

    for (const request of requests) {
      if (new Date(request.updated) > new Date(lastModified)) {
        this.$emit(request, this.generateMeta(request));
      }
    }

    this.db.set("lastModified", new Date(requests[0].updated));
  },
};
