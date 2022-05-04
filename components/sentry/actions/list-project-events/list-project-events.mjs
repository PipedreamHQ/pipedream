import app from "../../sentry.app.mjs";

export default {
  key: "sentry-list-project-events",
  version: "0.0.25",
  type: "action",
  name: "List Project Events.",
  description: "Return a list of events bound to a project. [See the docs here](https://docs.sentry.io/api/events/list-a-projects-events/)",
  props: {
    app,
    organizationSlug: {
      propDefinition: [
        app,
        "organizationSlug",
      ],
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    full: {
      type: "boolean",
      label: "Full",
      description: "If this is set to true then the event payload will include the full event body, including the stacktrace. Set to true to enable.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of events to return. Defaults to `1000`.",
      optional: true,
      max: 10000,
    },
  },
  async run () {
    const params = {
      full: this.full,
    };
    return this.app._paginate(
      this.maxResults ?? 1000,
      this.app.listProjectEvents,
      this.organizationSlug,
      this.projectId,
      params,
    );
  },
};
