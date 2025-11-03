import app from "../../sentry.app.mjs";

export default {
  key: "sentry-list-project-events",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      propDefinition: [
        app,
        "full",
      ],
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run ({ $ }) {
    const params = {
      full: this.full,
    };
    const data = await this.app._paginate(
      this.maxResults ?? 1000,
      this.app.listProjectEvents,
      this.organizationSlug,
      this.projectId,
      params,
    );
    if (data.length === 0) {
      $.export("$summary", "No events found");
    } else {
      $.export("$summary", `${data.length} event(s) found`);
    }
    return data;
  },
};
