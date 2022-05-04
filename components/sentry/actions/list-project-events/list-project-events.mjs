import app from "../../sentry.app.mjs";

export default {
  key: "sentry-list-project-events",
  version: "0.0.22",
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
  async run ({ $ }) {
    const MAX_RESULTS = this.maxResults ?? 1000;
    const ITEMS_PER_PAGE = 100;
    let currentPage = 0;
    let data = [];
    do {
      const params = {
        full: this.full,
        cursor: `0:${currentPage * ITEMS_PER_PAGE}:0`,
      };
      const res = await this.app.listProjectEvents(
        this.organizationSlug,
        this.projectId,
        params,
      );
      if (res?.data.length == 0) {
        break;
      }
      data.push(...res.data);
      if (data.length > MAX_RESULTS) {
        data = data.slice(0, MAX_RESULTS);
        break;
      }
      currentPage++;
    } while (true);
    if (data.length == 0) {
      $.export("$summary", "No Events found");
    } else {
      $.export("$summary", `${data.length} Event(s) found`);
    }
    return data;
  },
};
