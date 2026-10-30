import searchDocuments from "@pipedream/linear_app/actions/search-documents/search-documents.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...searchDocuments,
  ...utils.getAppProps(searchDocuments),
  key: "linear-search-documents",
  description: "Search Linear documents by text query, or list them filtered by project, initiative, or team. When `query` is provided, performs relevance-ranked full-text search across document titles and content (up to 200 results). When `query` is omitted, lists documents matching the project/initiative/team filter (up to 20 by default). Results do NOT include the document `content` field — call **Get Document** with the returned `id` or `slugId` to fetch the full markdown body. Use **List Projects** for project IDs, **List Initiatives** for initiative IDs, and **Get Teams** for team IDs. Leave filter props out of the call entirely to search all accessible documents — do not pass `\"*\"` or empty strings. Example: `query: \"quarterly review\"` → returns `[{id: \"...\", title: \"Q3 Review Notes\", url: \"...\", project: {id: \"...\", name: \"Product\"}, documentContentId: \"...\"}]`. Example (filter): `projectId: \"b75b71a2-...\"` → returns all documents attached to that project. [See the documentation](https://linear.app/developers/graphql).",
  version: "0.0.1",
  ai: "optimized",
};
