import common from "../common.mjs";

export default {
  ...common,
  key: "jira_service_desk-request-status-updated",
  name: "Request Status Updated",
  description:
    "Emit new event when a customer request is updated. [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/#api-rest-servicedeskapi-request-get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getRequestDate(req) {
      return req.currentStatus.statusDate.epochMillis;
    },
    getSummary() {
      return "Request Updated";
    },
  },
};
