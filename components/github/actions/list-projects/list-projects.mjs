import github from "../../github.app.mjs";

export default {
  key: "github-list-projects",
  name: "List Projects",
  description: "List the Projects (V2) owned by an organization, or scoped to a specific repository (returns each project's number and title). This is the entry point for the Projects (V2) discovery chain: use the returned project **number** with **List Project Statuses**, **List Project Items**, or **Update Project (V2) Item Status**. Discover organization logins with **List Organizations**. Note: user-owned Projects are not supported. Returns `{ projects, nextCursor }`; when `nextCursor` is non-null there are more results — pass it back as **Cursor** to fetch the next page. [See the documentation](https://docs.github.com/en/graphql/reference/projects#object-projectv2)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    github,
    owner: {
      propDefinition: [
        github,
        "projectOwnerStatic",
      ],
    },
    repo: {
      propDefinition: [
        github,
        "projectRepoStatic",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of projects to return. Defaults: `100`",
      default: 100,
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Pagination cursor to fetch the next page of results. Omit for the first page; to get more, pass the `nextCursor` value returned by a previous call.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      github, owner: repoOwner, repo: repoName, maxResults,
    } = this;

    let projects = [];
    let cursor = this.cursor ?? null;
    // The cursor to hand back so the caller can fetch the next page. Only set
    // when GitHub reports more results exist beyond what we return.
    let nextCursor = null;

    while (projects.length < maxResults) {
      const {
        projects: batch, nextCursor: endCursor, hasNextPage,
      } = await github.getProjectsV2({
        repoOwner,
        repoName,
        cursor,
      });

      if (!batch?.length) {
        nextCursor = null;
        break;
      }

      projects = projects.concat(batch);
      nextCursor = hasNextPage
        ? endCursor
        : null;

      if (!hasNextPage) {
        break;
      }
      cursor = endCursor;
    }

    if (projects.length > maxResults) {
      // The final page overshot maxResults. The discarded items sit between the
      // last returned project and nextCursor, so handing back nextCursor would
      // silently skip them. Clear it — better to stop than to skip results.
      projects = projects.slice(0, maxResults);
      nextCursor = null;
    }

    $.export("$summary", `Found ${projects.length} project(s) for ${repoName
      ? `${repoOwner}/${repoName}`
      : repoOwner}${nextCursor
      ? " (more available)"
      : ""}`);

    return {
      projects,
      nextCursor,
    };
  },
};
