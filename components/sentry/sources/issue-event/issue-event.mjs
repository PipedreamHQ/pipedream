import sentry from "../../sentry.app.mjs";

export default {
  key: "sentry-issue-event",
  version: "0.2.0",
  name: "New Issue Event (Instant)",
  description: "Emit new events for issues that have been created or updated. Optionally filter the events by project. [See the documentation](https://docs.sentry.io/organization/integrations/integration-platform/webhooks/issues/)",
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
    projectSlugs: {
      propDefinition: [
        sentry,
        "projectSlugs",
        ({ organizationSlug }) => ({
          organizationSlug,
        }),
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
      this._setIntegrationSlug(integrationSlug);

      const clientSecret = await this.sentry.getClientSecret(integrationSlug);
      this._setClientSecret(clientSecret);
    },
    async deactivate() {
      const integrationSlug = this._getIntegrationSlug();
      await this.sentry.disableIntegration(integrationSlug);
    },
  },
  methods: {
    _setIntegrationSlug(integrationSlug) {
      this.db.set("integrationSlug", integrationSlug);
    },
    _getIntegrationSlug() {
      return this.db.get("integrationSlug");
    },
    _setClientSecret(clientSecret) {
      this.db.set("clientSecret", clientSecret);
    },
    _getClientSecret() {
      return this.db.get("clientSecret");
    },
    getEventSourceName() {
      return "Issue Event (Instant)";
    },
    isProjectSelected(issue) {
      const projectSlugs = [].concat(this.projectSlugs ?? []);
      if (!projectSlugs.length) {
        return true;
      }
      return projectSlugs.includes(issue?.project?.slug);
    },
  },
  async run(event) {
    const clientSecret = this._getClientSecret();
    if (!this.sentry.isValidSource(event, clientSecret)) {
      this.http.respond({
        statusCode: 404,
      });
      return;
    }

    this.http.respond({
      statusCode: 200,
    });

    const {
      body, body: { data: { issue } },
    } = event;

    if (!this.isProjectSelected(issue)) {
      console.log(`Issue ${issue?.id} belongs to project "${issue?.project?.slug}", which is not selected. Skipping.`);
      return;
    }

    this.$emit(body, {
      id: issue.id,
      summary: issue.title,
      ts: Date.parse(issue.lastSeen),
    });
  },
};
