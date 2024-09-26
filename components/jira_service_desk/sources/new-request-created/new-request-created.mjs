import common from "../common.mjs";

export default {
  ...common,
  key: "jira_service_desk-new-request-created",
  name: "New Request Created",
  description:
    "Emit new event when a customer request is created. [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/#api-rest-servicedeskapi-request-get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getRequestDate(req) {
      return req.createdDate.epochMillis;
    },
    getSummary() {
      return "New Request";
    },
  },
};
