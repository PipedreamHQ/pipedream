import common from "../common/common.mjs";

export default {
  ...common,
  key: "calendly_v2-routing-form-submission-created",
  name: "New Routing Form Submission Created",
  description: "Emit new event when a new routing form submission is created.",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "routing_form_submission.created",
      ];
    },
    getScope() {
      return "organization";
    },
    generateMeta(body) {
      const submissionId = body.payload.uri.split("/").pop();
      return {
        id: submissionId,
        summary: body.event,
        ts: Date.now(),
      };
    },
  },
};
