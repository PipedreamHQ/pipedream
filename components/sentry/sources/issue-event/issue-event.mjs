import sentry from "../../sentry.app.mjs";

export default {
  key: "sentry-issue-events",
  version: "0.0.3",
  name: "New Issue Event (Instant)",
  description: "Emit new events for issues that have been created or updated.",
  type: "source",
  props: {
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    sentry,
    organizationSlug: {
      propDefinition: [
        sentry,
        "organizationSlug",
      ],
    },
  },
  hooks: {
    async activate() {
      const { slug: integrationSlug } = await this.sentry.createIntegration(
        this.getEventSourceName(),
        this.organizationSlug,
        this.http.endpoint,
      );
      this.db.set("integrationSlug", integrationSlug);

      const clientSecret = await this.sentry.getClientSecret(integrationSlug);
      this.db.set("clientSecret", clientSecret);
    },
    async deactivate() {
      const integrationSlug = this.db.get("integrationSlug");
      await this.sentry.disableIntegration(integrationSlug);
    },
  },
  methods: {
    getEventSourceName() {
      return "Issue Event (Instant)";
    },
    generateMeta(event) {
      const {
        body,
        headers,
      } = event;
      const {
        "request-id": id,
        "sentry-hook-resource": resourceType,
        "sentry-hook-timestamp": ts,
      } = headers;
      const {
        action,
        data,
      } = body;
      const { [resourceType]: resource } = data;
      const summary = `${resourceType} #${resource.id} ${action}`;
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run(event) {
    const clientSecret = this.db.get("clientSecret");
    if (!this.sentry.isValidSource(event, clientSecret)) {
      this.http.respond({
        statusCode: 404,
      });
      return;
    }

    this.http.respond({
      statusCode: 200,
    });

    const { body } = event;
    const meta = this.generateMeta(event);
    this.$emit(body, meta);
  },
};
