import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

const DEFAULT_FIELDS = [
  "id",
  "title",
  "slugId",
  "url",
  "createdAt",
  "updatedAt",
  "project",
  "documentContentId",
];

export default {
  key: "linear_app-search-documents",
  name: "Search Documents",
  description:
    "Search Linear documents by text query, or list them filtered by project, initiative, or team."
    + " When `query` is provided, performs relevance-ranked full-text search across document titles and content (up to 200 results)."
    + " When `query` is omitted, lists documents matching the project/initiative/team filter (up to 20 by default)."
    + " Results do NOT include the document `content` field — call **Get Document** with the returned `id` or `slugId` to fetch the full markdown body."
    + " Use **List Projects** for project IDs, **List Initiatives** for initiative IDs, and **Get Teams** for team IDs."
    + " Leave filter props out of the call entirely to search all accessible documents — do not pass `\"*\"` or empty strings."
    + " The optional `fields` prop narrows results to only the keys you need; defaults to a compact set of 8 fields (id, title, slugId, url, createdAt, updatedAt, project, documentContentId)."
    + " Example: `query: \"quarterly review\"` → returns `[{id: \"...\", title: \"Q3 Review Notes\", url: \"...\", project: {id: \"...\", name: \"Product\"}, documentContentId: \"...\"}]`."
    + " Example (filter): `projectId: \"b75b71a2-...\"` → returns all documents attached to that project."
    + " [See the documentation](https://linear.app/developers/graphql).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linearApp,
    query: {
      type: "string",
      label: "Query",
      description: "Free-text search term for relevance-ranked document search. When provided, searches across document titles and content. When omitted, lists documents by project/initiative/team filter instead.",
      optional: true,
    },
    projectId: {
      propDefinition: [
        linearApp,
        "projectId",
      ],
      description: "Filter documents by project UUID (e.g. `a1b2c3d4-0000-0000-0000-000000000001`). Applied only on the filter path (when no `query` is provided). Leave out entirely to search across all projects — do not pass `\"*\"` or an empty string. Use **List Projects** to find valid project IDs.",
    },
    initiativeId: {
      propDefinition: [
        linearApp,
        "initiativeId",
      ],
      optional: true,
      description: "Filter documents by initiative UUID. Applied only on the filter path (when no `query` is provided). Use **List Initiatives** to find valid initiative IDs.",
    },
    teamId: {
      propDefinition: [
        linearApp,
        "teamId",
      ],
      optional: true,
      description: "Filter documents by team UUID. Applied on both the search path (with `query`) and the filter path. Leave out entirely to search across all teams — do not pass `\"*\"` or an empty string. Use **Get Teams** to find valid team IDs.",
    },
    includeArchived: {
      propDefinition: [
        linearApp,
        "includeArchived",
      ],
    },
    orderBy: {
      propDefinition: [
        linearApp,
        "orderBy",
      ],
      description: "Sort order for results when using the filter path (no `query`). Available options: `createdAt` (default) and `updatedAt`.",
    },
    limit: {
      propDefinition: [
        linearApp,
        "limit",
      ],
      description: "Maximum total number of documents to return. Defaults to 200 when a `query` is provided, 20 when only filters are used.",
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Field names to return for each document. Defaults to a compact set: id, title, slugId, url, createdAt, updatedAt, project, documentContentId. The `content` field is not returned by default — use **Get Document** with the `id` or `slugId` to fetch the full markdown body.",
      optional: true,
    },
  },
  async run({ $ }) {
    const docs = [];
    let hasNextPage;
    let after;

    const maxLimit = this.limit
      || (this.query
        ? constants.DEFAULT_MAX_RECORDS
        : constants.DEFAULT_NO_QUERY_LIMIT);

    if (this.query) {
      do {
        if (docs.length >= maxLimit) break;
        const remainingNeeded = maxLimit - docs.length;
        const first = utils.clampFirst(Math.min(constants.DEFAULT_LIMIT, remainingNeeded));

        const {
          nodes, pageInfo,
        } = await this.linearApp.searchDocuments({
          term: this.query,
          teamId: this.teamId || undefined,
          first,
          after,
          includeArchived: this.includeArchived,
        });

        docs.push(...nodes);
        after = pageInfo.endCursor;
        hasNextPage = pageInfo.hasNextPage;
      } while (hasNextPage && docs.length < maxLimit);
    } else {
      const filter = {};
      if (this.projectId) {
        filter.project = {
          id: {
            eq: this.projectId,
          },
        };
      }
      if (this.initiativeId) {
        filter.initiative = {
          id: {
            eq: this.initiativeId,
          },
        };
      }
      if (this.teamId) {
        filter.team = {
          id: {
            eq: this.teamId,
          },
        };
      }

      do {
        if (docs.length >= maxLimit) break;
        const remainingNeeded = maxLimit - docs.length;
        const first = utils.clampFirst(Math.min(constants.DEFAULT_LIMIT, remainingNeeded));

        const {
          nodes, pageInfo,
        } = await this.linearApp.listDocuments({
          filter: Object.keys(filter).length
            ? filter
            : undefined,
          first,
          after,
          orderBy: this.orderBy,
          includeArchived: this.includeArchived,
        });

        docs.push(...nodes);
        after = pageInfo.endCursor;
        hasNextPage = pageInfo.hasNextPage;
      } while (hasNextPage && docs.length < maxLimit);
    }

    $.export("$summary", `Found ${docs.length} document${docs.length === 1
      ? ""
      : "s"}`);

    const fieldsList = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    return docs.map((doc) => utils.pickFields(doc, fieldsList));
  },
};
