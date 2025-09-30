import sentry from "../../sentry.app.mjs";

export default {
  key: "sentry-list-issue-events",
  name: "List Issue Events",
  description: "Return a list of events bound to an issue. [See the docs here](https://docs.sentry.io/api/events/list-an-issues-events/)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sentry,
    organizationSlug: {
      propDefinition: [
        sentry,
        "organizationSlug",
      ],
    },
    projectId: {
      propDefinition: [
        sentry,
        "projectId",
      ],
    },
    issueId: {
      propDefinition: [
        sentry,
        "issueId",
        (c) => ({
          organizationSlug: c.organizationSlug,
          projectId: c.projectId,
        }),
      ],
    },
    full: {
      propDefinition: [
        sentry,
        "full",
      ],
    },
    maxResults: {
      propDefinition: [
        sentry,
        "maxResults",
      ],
    },
  },
  async run ({ $ }) {
    const params = {
      full: this.full,
    };
    const data = await this.sentry._paginate(
      this.maxResults,
      this.sentry.listIssueEvents,
      this.issueId,
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
