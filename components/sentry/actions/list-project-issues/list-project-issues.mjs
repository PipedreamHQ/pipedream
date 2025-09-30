import app from "../../sentry.app.mjs";

export default {
  key: "sentry-list-project-issues",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  name: "List Project Issues.",
  description: "Return a list of issues bound to a project. [See the docs here](https://docs.sentry.io/api/issues/list-a-projects-issues/)",
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
    statsPeriod: {
      type: "string",
      label: "Stats Period",
      description: "An optional stat period (e.g. `\"24h\"`, `\"14d\"`).",
      optional: true,
    },
    shortIdLookup: {
      type: "boolean",
      label: "Short ID Lookup",
      description: "If this is set to true then short IDs are looked up by this function as well. This can cause the return value of the function to return an event issue of a different project which is why this is an opt-in.",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "An optional Sentry structured search query. If not provided an implied `is:unresolved` is assumed.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      statsPeriod: this.statsPeriod,
      shortIdLookup: this.shortIdLookup,
      query: this.query,
    };
    const data = await this.app._paginate(
      this.maxResults ?? 1000,
      this.app.listProjectIssues,
      this.organizationSlug,
      this.projectId,
      params,
    );
    if (data.length === 0) {
      $.export("$summary", "No issues found");
    } else {
      $.export("$summary", `${data.length} issue(s) found`);
    }
    return data;
  },
};
