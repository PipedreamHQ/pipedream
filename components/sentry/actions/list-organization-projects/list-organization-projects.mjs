import app from "../../sentry.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "sentry-list-organization-projects",
  name: "List Organization Projects",
  description: "List the projects of a Sentry organization with their slug, name and platform."
    + " Use to discover a project slug before **Get Project**, **List Project Issues** or **List Project Events**, or to check whether a project exists."
    + " Not for issue or event data: use **List Project Issues** for that."
    + " Returns `{ projects, hasMore }`; `hasMore` is true when more projects exist than `maxResults`. Each project has only the selected fields (always includes `id`); by default: slug, name, platform, dateCreated, isBookmarked, team, teams."
    + " Example: organizationIdOrSlug=\"acme-corp\", query=\"web\" → projects whose name or slug matches `web`, with id, slug, name and platform."
    + " [See the documentation](https://docs.sentry.io/api/organizations/list-an-organizations-projects/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    organizationIdOrSlug: {
      propDefinition: [
        app,
        "organizationIdOrSlug",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: "Optional text to filter projects by name or slug, e.g. `backend`. Omit to list all projects.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
      description: "Maximum number of projects to return, e.g. `100`. Results beyond it are dropped and `hasMore` is true.",
      default: 100,
    },
    fields: {
      propDefinition: [
        app,
        "fieldsSelection",
      ],
      description: "Top-level project fields to return for each project, e.g. `[\"id\",\"slug\",\"name\",\"platform\"]`. `id` is always included. Omit to get the default set listed in the action description.",
    },
  },
  async run({ $ }) {
    const defaultFields = [
      "slug",
      "name",
      "platform",
      "dateCreated",
      "isBookmarked",
      "team",
      "teams",
    ];
    const {
      projects, hasMore,
    } = await this.app.listOrganizationProjects(
      this.organizationIdOrSlug,
      {
        query: this.query,
      },
      this.maxResults ?? 100,
    );
    const names = this.fields?.length
      ? this.fields
      : defaultFields;
    $.export("$summary", `Found ${projects.length} project(s)${hasMore
      ? " (more available)"
      : ""}`);
    return {
      projects: projects.map((p) => utils.pickFields(p, names)),
      hasMore,
    };
  },
};
