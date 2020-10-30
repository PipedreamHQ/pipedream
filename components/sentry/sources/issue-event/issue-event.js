const sentry = require("../../sentry.app");

module.exports = {
  key: "sentry-issue-events",
  name: "Issue Event (Instant)",
  props: {
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    sentry,
    organizationSlug: { propDefinition: [sentry, "organizationSlug"] },
  },
  methods: {
    generateMeta(event) {
      const { body, headers } = event;
      const {
        "request-id": id,
        "sentry-hook-resource": resourceType,
        "sentry-hook-timestamp": ts,
      } = headers;
      const { action, data } = body;
      const {
        [resourceType]: resource,
      } = data;
      const summary = `${resourceType} #${resource.id} ${action}`;
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run(event) {
    this.http.respond({
      statusCode: 200,
    });

    const { body } = event;
    const meta = this.generateMeta(event);
    this.$emit(body, meta);
  },
};
