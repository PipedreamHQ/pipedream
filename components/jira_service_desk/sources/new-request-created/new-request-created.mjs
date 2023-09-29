import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
// import jiraServiceDesk from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-new-request-created",
  name: "New Request Created",
  description: "Emits an event when a new customer request is created. [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/#api-rest-servicedeskapi-request-get)",
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
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastRequestId() {
      return this.db.get("lastRequestId") ?? 0;
    },
    _setLastRequestId(id) {
      this.db.set("lastRequestId", id);
    },
  },
  async run() {
    const lastRequestId = this._getLastRequestId();
    const requests = await axios(this, {
      url: `https://api.atlassian.com/ex/jira/${this.jiraServiceDesk.$auth.oauth_uid}/rest/servicedeskapi/request`,
      headers: {
        Authorization: `Bearer ${this.jiraServiceDesk.$auth.oauth_access_token}`,
      },
    });

    for (const request of requests) {
      if (request.id > lastRequestId) {
        this.$emit(request, {
          id: request.id,
          summary: `New Jira Service Desk Request: ${request.summary}`,
          ts: Date.parse(request.created),
        });
        this._setLastRequestId(request.id);
      }
    }
  },
};
