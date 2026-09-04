import github from "../../github.app.mjs";

export default {
  key: "github-list-projects",
  name: "List Projects",
  description: "List the Projects (V2) owned by an organization, or scoped to a specific repository (returns each project's number and title). This is the entry point for the Projects (V2) discovery chain: use the returned project **number** with **List Project Statuses**, **List Project Items**, or **Update Project (V2) Item Status**. Discover organization logins with **List Organizations**. Note: user-owned Projects are not supported. Returns `{ projects, nextCursor }`; when `nextCursor` is non-null there are more results — pass it back as **Cursor** to fetch the next page. Do NOT call this with a guessed or assumed **Owner**: if the user hasn't named the organization/owner, ask them first rather than trying multiple organizations. [See the documentation](https://docs.github.com/en/graphql/reference/projects#object-projectv2)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
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
      propDefinition: [
        github,
        "maxResults",
      ],
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
      github, owner: repoOwner, repo: repoName,
    } = this;
    // Fall back to the prop default so an undefined limit doesn't make
    // `projects.length < maxResults` false on the first iteration (which would
    // skip the loop and return nothing).
    const maxResults = this.maxResults ?? 100;

    let projects = [];
    let cursor = this.cursor ?? null;
    // The cursor to hand back so the caller can fetch the next page. Only set
    // when GitHub reports more results exist beyond what we return.
    let nextCursor = null;

    while (projects.length < maxResults) {
      const remaining = maxResults - projects.length;
      const {
        projects: batch, nextCursor: endCursor, hasNextPage,
      } = await github.getProjectsV2({
        repoOwner,
        repoName,
        cursor,
        first: Math.min(remaining, 100),
      });

      if (!batch?.length) {
        break;
      }

      projects = projects.concat(batch);

      if (!hasNextPage) {
        nextCursor = null;
        break;
      }

      nextCursor = endCursor;

      if (projects.length >= maxResults) {
        break;
      }

      cursor = endCursor;
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
