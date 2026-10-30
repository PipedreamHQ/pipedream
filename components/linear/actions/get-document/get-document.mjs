import getDocument from "@pipedream/linear_app/actions/get-document/get-document.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...getDocument,
  ...utils.getAppProps(getDocument),
  key: "linear-get-document",
  description: "Fetch a single Linear document by its UUID or slugId and return the full markdown content plus metadata. Use when you need to read, show, or display the full contents of a document — **Search Documents** does not return the `content` field. Workflow: first call **Search Documents** to find the document `id` or `slugId`, then call this tool with that identifier. Provide the document UUID (e.g. `a1b2c3d4-0000-0000-0000-000000000001`) or slugId (the short code at the end of the document URL, e.g. `10b5bc2940c7`). The optional `fields` prop narrows the response to only the keys you need. Example: `documentId: \"10b5bc2940c7\"` → returns `{id: \"29a25062-...\", title: \"Q3 Hiring Plan\", content: \"# Q3 Hiring Plan\\n\\nWe are looking for...\", url: \"https://linear.app/.../document/q3-hiring-plan-10b5bc2940c7\"}`. [See the documentation](https://linear.app/developers/graphql).",
  version: "0.0.1",
  ai: "optimized",
};
